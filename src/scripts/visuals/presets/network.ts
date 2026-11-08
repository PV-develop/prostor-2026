/**
 * Пресет «performance-network» — сеть рекламных каналов и потоков данных:
 * несколько выраженных узлов, множество связей между ними, неоднородная
 * плотность частиц и отдельные потоки, направленные к центральным точкам.
 *
 * Геометрия нормализована (0..1). На широких холстах облако смещено вправо
 * (заголовок hero слева), на мобильном занимает всю область.
 */
import type { BuildContext, PresetScene, SceneParticle, Vec2, VisualPreset } from '../types';

/** Опорные узлы сети в нормализованных координатах (jitter добавляется при сборке). */
const HUBS: Vec2[] = [
  { x: 0.08, y: 0.24 },
  { x: 0.50, y: 0.08 },
  { x: 0.86, y: 0.26 },
  { x: 0.24, y: 0.55 },
  { x: 0.56, y: 0.48 },
  { x: 0.34, y: 0.88 },
  { x: 0.82, y: 0.80 },
];

/** Рёбра сети (пары индексов узлов) — связность без визуального шума. */
const EDGES: Array<[number, number]> = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 4],
  [3, 4], [4, 6], [3, 5], [5, 6], [2, 6], [0, 4],
];

export const networkPreset: VisualPreset = {
  name: 'performance-network',
  build({ w, budget, rand }: BuildContext): PresetScene {
    const mobile = w < 768;
    // Область облака: desktop — правая часть hero, mobile — весь холст
    const x0 = mobile ? 0.06 : 0.50;
    const x1 = mobile ? 0.94 : 0.97;
    const y0 = 0.10;
    const y1 = 0.92;
    const mx = (nx: number) => x0 + (x1 - x0) * nx;
    const my = (ny: number) => y0 + (y1 - y0) * ny;
    // Приближённое нормальное распределение (-1..1)
    const g = () => (rand() + rand() + rand() - 1.5) / 1.5;
    const particles: SceneParticle[] = [];
    const links: PresetScene['links'] = [];
    const hubCount = budget < 300 ? 5 : HUBS.length;
    const hubs = HUBS.slice(0, hubCount).map((hb) => ({
      x: mx(hb.x + g() * 0.02),
      y: my(hb.y + g() * 0.02),
    }));
    const edges = EDGES.filter(([a, b]) => a < hubCount && b < hubCount);
    // Центр композиции — для направления потоков «к центральным точкам»
    const center: Vec2 = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
    const dist = (p: Vec2) => Math.hypot(p.x - center.x, p.y - center.y);
    const hubNodeIdx: number[] = [];
    const drift = () => ({
      driftAmp: 1.5 + rand() * 4.5,
      driftFreq: 0.15 + rand() * 0.4,
      driftPhase: rand() * Math.PI * 2,
    });

    // 1. Узлы сети: крупная частица-ядро + неоднородное облако вокруг
    hubs.forEach((hb) => {
      hubNodeIdx.push(particles.length);
      particles.push({
        home: hb,
        size: 2.6 + rand() * 0.8,
        alpha: 0.9 + rand() * 0.1,
        delay: rand() * 0.15,
        ...drift(),
      });
      const cluster = Math.max(6, Math.round((budget * 0.38) / hubCount));
      for (let k = 0; k < cluster; k++) {
        const red = rand() < 0.06;
        particles.push({
          home: { x: hb.x + g() * 0.028, y: hb.y + g() * 0.05 },
          size: (red ? 1.4 : 0.9) + rand() * 1.0,
          alpha: 0.5 + rand() * 0.35,
          red,
          delay: 0.15 + rand() * 0.75,
          ...drift(),
        });
      }
    });

    // 2. Частицы вдоль рёбер: плотность выше у узлов
    const edgeCount = Math.round(budget * 0.34);
    for (let k = 0; k < edgeCount; k++) {
      const e = edges[Math.floor(rand() * edges.length)] ?? edges[0]!;
      const a = hubs[e[0]]!;
      const b = hubs[e[1]]!;
      // t с усилением у концов отрезка
      const r = rand();
      const t = rand() < 0.5 ? Math.pow(r, 0.7) : 1 - Math.pow(r, 0.7);
      const off = g() * 0.012;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const red = rand() < 0.06;
      particles.push({
        home: {
          x: a.x + dx * t - (dy / len) * off,
          y: a.y + dy * t + (dx / len) * off,
        },
        size: (red ? 1.3 : 0.8) + rand() * 0.8,
        alpha: 0.4 + rand() * 0.35,
        red,
        delay: 0.2 + rand() * 1.3,
        ...drift(),
      });
    }

    // 3. Разреженный фон — ощущение глубины и пространства
    const ambient = Math.round(budget * 0.16);
    for (let k = 0; k < ambient; k++) {
      particles.push({
        home: { x: x0 + rand() * (x1 - x0), y: y0 + rand() * (y1 - y0) },
        size: 0.7 + rand() * 0.7,
        alpha: 0.16 + rand() * 0.28,
        delay: 0.5 + rand() * 1.5,
        driftAmp: 2 + rand() * 5,
        driftFreq: 0.1 + rand() * 0.3,
        driftPhase: rand() * Math.PI * 2,
      });
    }

    // 4. Потоки к центральным точкам: движутся вдоль рёбер после сборки
    const flows = mobile ? 6 : Math.round(budget * 0.1);
    for (let k = 0; k < flows; k++) {
      const e = edges[Math.floor(rand() * edges.length)] ?? edges[0]!;
      const a = hubs[e[0]]!;
      const b = hubs[e[1]]!;
      const from = dist(a) > dist(b) ? a : b;
      const to = dist(a) > dist(b) ? b : a;
      particles.push({
        home: from,
        size: 1.1 + rand() * 0.7,
        alpha: 0.6 + rand() * 0.3,
        red: rand() < 0.3,
        delay: 0.8 + rand() * 1.0,
        ...drift(),
        flow: { from, to, speed: 0.06 + rand() * 0.08, phase: rand() },
      });
    }

    // Тонкие связи между узлами (линии рисует движок)
    edges.forEach(([a, b]) => {
      links.push({ a: hubNodeIdx[a]!, b: hubNodeIdx[b]!, alpha: 0.13 + rand() * 0.14 });
    });

    return { particles, links };
  },
};
