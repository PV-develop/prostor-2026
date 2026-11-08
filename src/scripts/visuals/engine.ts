/**
 * Движок генеративной графики ServiceHero: Canvas 2D, без зависимостей.
 * Отвечает за жизненный цикл: частицы появляются вокруг будущей формы,
 * движутся по индивидуальным траекториям и собираются в геометрию пресета,
 * затем медленно дрейфуют, сохраняя форму (без циклов разрушения).
 *
 * Производительность: cap DPR 1.5, бюджет частиц по ширине/типу указателя,
 * пауза анимации вне вьюпорта (IntersectionObserver), пассивные листенеры,
 * батчинг отрисовки по альфа-корзинам (приём движка частиц главной).
 * prefers-reduced-motion — один статичный кадр собранной композиции.
 */
import type { PresetScene, VisualPreset } from './types';

interface Runtime {
  home: { x: number; y: number };
  size: number;
  alpha: number;
  red?: boolean;
  delay: number;
  driftAmp: number;
  driftFreq: number;
  driftPhase: number;
  flow?: { from: { x: number; y: number }; to: { x: number; y: number }; speed: number; phase: number };
  sx: number;      // стартовая позиция (вокруг формы), px
  sy: number;
  ax: number;      // амплитуда индивидуальной дуги, px
  ay: number;
  ox: number;      // смещение от курсора (пружина), px
  oy: number;
}

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(pointer: fine)').matches;

const ASSEMBLE = 1.8;   // длительность сборки одной частицы, с
const FADE = 0.45;      // проявление частицы, с
const PULL_R = 130;     // радиус деликатной реакции на курсор, px
const DPR_MAX = 1.5;
const NB = 8;           // альфа-корзины отрисовки

export function mountVisual(host: HTMLElement, preset: VisualPreset): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // без Canvas 2D hero остаётся типографским (тексты и CTA не зависят от графики)

  // Цвета — из дизайн-токенов; значения по умолчанию дублируют токены
  const cs = getComputedStyle(document.documentElement);
  const PAPER = cs.getPropertyValue('--color-particle').trim() || '#D4D7DC';
  const RED = cs.getPropertyValue('--color-red').trim() || '#FA001E';

  let W = 0, H = 0, dpr = 1;
  let scene: PresetScene | null = null;
  let P: Runtime[] = [];
  let t0 = 0, raf = 0, resizeT = 0, timer = 0;
  let visible = true;
  let assembled = false;
  let running = false;
  let rafFired = true; // был ли реально вызван rAF (окружение может его приостанавливать)
  const mouse = { x: -1e4, y: -1e4 };

  // Позиции и корзины текущего кадра (переиспользуются, без аллокаций на кадр)
  let xs = new Float32Array(0);
  let ys = new Float32Array(0);
  let its = new Float32Array(0);
  let bx = new Float32Array(0);
  let by = new Float32Array(0);
  let bs = new Float32Array(0);
  let bb = new Uint8Array(0);
  let br = new Uint8Array(0);

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  const build = () => {
    const r = host.getBoundingClientRect();
    W = Math.round(r.width);
    H = Math.round(r.height);
    if (!(W > 0 && H > 0)) return;
    dpr = Math.min(DPR_MAX, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
    if (!canvas.parentNode) host.appendChild(canvas);

    // Бюджет частиц: ширина области + тип указателя (mobile/coarse — меньше)
    const budget = Math.round(
      (W <= 480 ? 170 : W <= 768 ? 240 : W <= 1200 ? 430 : 560) * (FINE ? 1 : 0.85),
    );
    scene = preset.build({ w: W, h: H, budget, rand: Math.random });
    const R = Math.min(W, H);
    P = scene.particles.map((p) => {
      const hx = p.home.x * W;
      const hy = p.home.y * H;
      const a = Math.random() * Math.PI * 2;
      const d = R * (0.35 + Math.random() * 0.5); // старт — вокруг будущей формы
      return {
        ...p,
        sx: hx + Math.cos(a) * d,
        sy: hy + Math.sin(a) * d * 0.75,
        ax: (Math.random() - 0.5) * 220,
        ay: -40 - Math.random() * 190,
        ox: 0,
        oy: 0,
      };
    });
    const n = P.length;
    xs = new Float32Array(n);
    ys = new Float32Array(n);
    its = new Float32Array(n);
    bx = new Float32Array(n);
    by = new Float32Array(n);
    bs = new Float32Array(n);
    bb = new Uint8Array(n);
    br = new Uint8Array(n);
    if (!t0) t0 = performance.now();
    if (REDUCED) {
      assembled = true;
      draw(performance.now() + 1e5); // статичный кадр собранной композиции
    } else {
      wake();
    }
  };

  /** Планирование кадров: rAF; если окружение его приостанавливает — таймер. */
  const tick = (now: number) => {
    draw(now);
    if (!visible || REDUCED) {
      running = false;
      raf = 0;
      clearTimeout(timer);
      timer = 0;
      return;
    }
    rafFired = false;
    raf = requestAnimationFrame((t) => {
      rafFired = true;
      raf = 0;
      tick(t);
    });
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (rafFired || !visible || REDUCED) return;
      cancelAnimationFrame(raf);
      raf = 0;
      timer = window.setTimeout(function drive() {
        if (!visible || REDUCED) { running = false; timer = 0; return; }
        draw(performance.now());
        timer = window.setTimeout(drive, 90); // ~11 fps: дрейф остаётся живым
      }, 0);
    }, 160);
  };

  const wake = () => {
    if (!running && visible && !REDUCED) {
      running = true;
      tick(performance.now());
    }
  };

  const draw = (now: number) => {
    raf = 0;
    if (!scene || !P.length) return;
    const T = (now - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const rect = canvas.getBoundingClientRect();
    const mx = mouse.x - rect.left;
    const my = mouse.y - rect.top;
    const n = P.length;
    let done = true;

    for (let i = 0; i < n; i++) {
      const p = P[i]!;
      const it = assembled ? 1 : ease(Math.min(1, Math.max(0, (T - p.delay) / ASSEMBLE)));
      its[i] = it;
      if (it <= 0) { done = false; continue; }
      if (it < 1) done = false;

      // «Домашняя» позиция: цель + медленный дрейф (+ поток после сборки)
      let hx = p.home.x * W;
      let hy = p.home.y * H;
      if (p.flow) {
        const f = p.flow;
        const ft = (T * f.speed + f.phase) % 1;
        hx = (f.from.x + (f.to.x - f.from.x) * ft) * W;
        hy = (f.from.y + (f.to.y - f.from.y) * ft) * H;
      }
      hx += Math.sin(T * p.driftFreq + p.driftPhase) * p.driftAmp;
      hy += Math.cos(T * p.driftFreq * 0.83 + p.driftPhase * 1.7) * p.driftAmp;

      const arc = Math.sin(Math.PI * it);
      let x = p.sx + (hx - p.sx) * it + p.ax * arc;
      let y = p.sy + (hy - p.sy) * it + p.ay * arc;

      // Деликатная реакция на курсор с плавным возвратом (только точные указатели)
      if (FINE && !REDUCED) {
        const dx = mx - x;
        const dy = my - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < PULL_R * PULL_R) {
          const u = 1 - Math.sqrt(d2) / PULL_R;
          const f = 0.5 * u * Math.sqrt(u);
          p.ox += (dx * f - p.ox) * 0.08;
          p.oy += (dy * f - p.oy) * 0.08;
        } else if (p.ox !== 0 || p.oy !== 0) {
          p.ox *= 0.92;
          p.oy *= 0.92;
          if (Math.abs(p.ox) < 0.1 && Math.abs(p.oy) < 0.1) { p.ox = 0; p.oy = 0; }
        }
        x += p.ox;
        y += p.oy;
      }

      xs[i] = x;
      ys[i] = y;
      const fade = Math.min(1, Math.max(0, (T - p.delay) / FADE));
      const a = Math.max(0, Math.min(1, p.alpha * fade));
      const bucket = Math.min(NB - 1, Math.round(a * NB));
      if (p.red) {
        br[i] = bucket + 1; // 0 — не красная
        bb[i] = 0;
      } else {
        br[i] = 0;
        bb[i] = bucket + 1; // 0 — невидима
      }
      bs[i] = p.size;
      bx[i] = x - p.size / 2;
      by[i] = y - p.size / 2;
    }
    if (!assembled && done) assembled = true;

    // Тонкие связи между узлами (проявляются по мере сборки концов)
    if (scene.links.length) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = PAPER;
      for (const l of scene.links) {
        const ia = its[l.a] ?? 0;
        const ib = its[l.b] ?? 0;
        const k = Math.min(ia, ib);
        if (k < 0.05) continue;
        ctx.globalAlpha = (l.alpha ?? 0.2) * k;
        ctx.beginPath();
        ctx.moveTo(xs[l.a] ?? 0, ys[l.a] ?? 0);
        ctx.lineTo(xs[l.b] ?? 0, ys[l.b] ?? 0);
        ctx.stroke();
      }
    }

    // Частицы: белые — корзинами (как в движке главной), красные — поверх
    ctx.fillStyle = PAPER;
    for (let b = 1; b <= NB; b++) {
      ctx.globalAlpha = 0.55 * (b - 0.5) / NB;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (bb[i] === b && br[i] === 0) ctx.rect(bx[i] ?? 0, by[i] ?? 0, bs[i] ?? 0, bs[i] ?? 0);
      }
      ctx.fill();
    }
    ctx.fillStyle = RED;
    for (let b = 1; b <= NB; b++) {
      ctx.globalAlpha = 0.7 * (b - 0.5) / NB;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (br[i] === b && bb[i] === 0) ctx.rect(bx[i] ?? 0, by[i] ?? 0, bs[i] ?? 0, bs[i] ?? 0);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Планирование следующего кадра — в tick() (rAF с таймерной страховкой)
  };

  // Пауза/возобновление по видимости области графики
  const io = new IntersectionObserver((es) => {
    const vis = es.some((e) => e.isIntersecting);
    if (vis && !visible) {
      visible = true;
      if (!scene) build(); // область могла быть скрыта при загрузке
      wake();
    } else {
      visible = vis;
    }
  });
  io.observe(host);

  const onResize = () => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(build, 150); // assembled сохраняется — без пересборки анимации
  };
  window.addEventListener('resize', onResize);

  if (FINE && !REDUCED) {
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -1e4; mouse.y = -1e4; };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
  }

  build();
}
