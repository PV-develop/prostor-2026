/**
 * Вся интерактивность главной (порт поведения экспорта Claude Design).
 * Чистый TypeScript, без runtime-зависимостей.
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   Меню (открытие/закрытие, якоря, группы услуг, Escape/outside)
   ============================================================ */
function initMenu(): void {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const btn = document.querySelector<HTMLButtonElement>('[data-mbtn]');
  if (!menu || !btn) return;

  const setOpen = (open: boolean) => {
    menu.dataset.open = String(open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  const isOpen = () => menu.dataset.open === 'true';

  btn.addEventListener('click', (e) => { e.preventDefault(); setOpen(!isOpen()); });
  menu.querySelectorAll('[data-mclose]').forEach((b) =>
    b.addEventListener('click', () => setOpen(false)));

  // Клик по якорной ссылке — закрыть меню и плавно проскроллить
  menu.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    setOpen(false);
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const t = document.querySelector(id);
      if (t) setTimeout(() => t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }), 80);
    }
  });

  // Закрытие по клику вне меню и по Escape
  document.addEventListener('click', (e) => {
    if (isOpen() && !(e.target as Element).closest?.('[data-menu]') && !(e.target as Element).closest?.('[data-mbtn]')) {
      setOpen(false);
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  });

  // Группы услуг: на мобильном свёрнуты, на десктопе развёрнуты
  const groups = [...menu.querySelectorAll<HTMLDetailsElement>('[data-msnav] details')];
  if (groups.length) {
    let wasMobile = window.innerWidth <= 768;
    groups.forEach((d) => { d.open = !wasMobile; });
    window.addEventListener('resize', () => {
      const m = window.innerWidth <= 768;
      if (m !== wasMobile) {
        wasMobile = m;
        groups.forEach((d) => { d.open = !m; });
      }
    });
    // На десктопе группы всегда раскрыты: клик по заголовку не сворачивает
    menu.addEventListener('click', (e) => {
      const s = (e.target as Element).closest?.('summary');
      if (s && s.closest('[data-msnav]') && window.innerWidth > 768) e.preventDefault();
    });
  }
}

/* ============================================================
   Scroll-reveal + проявление горизонтальных меток секций
   ============================================================ */
function initReveal(): void {
  const rv = document.querySelectorAll('[data-reveal]');
  if (REDUCED) {
    rv.forEach((el) => el.classList.add('in'));
    document.querySelectorAll('.section-label--h, .section-label--v, .srow__label').forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((es) =>
    es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .1 });
  rv.forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
    else io.observe(el);
  });
  // Страховка: ничего не должно остаться невидимым
  setTimeout(() => rv.forEach((el) => el.classList.add('in')), 2500);
}

/* ============================================================
   Счётчики цифр кейсов
   ============================================================ */
function initCounters(): void {
  if (REDUCED) {
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count ?? '0';
    });
    return;
  }
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const co = new IntersectionObserver((es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target as HTMLElement;
      const to = Number(el.dataset.count ?? 0);
      const t0 = performance.now();
      const d = 1500;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / d);
        el.textContent = String(Math.round(to * ease(p)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: .4 });
  document.querySelectorAll('[data-count]').forEach((el) => co.observe(el));
}

/* ============================================================
   Чипы отраслей: фон-фото выезжает при hover
   ============================================================ */
function initChips(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-chip]').forEach((a) => {
    const src = a.dataset.chip;
    if (!src) return;
    const ph = document.createElement('span');
    ph.dataset.chipPh = '';
    ph.style.cssText =
      `position:absolute;inset:-1px;z-index:-1;pointer-events:none;` +
      `background:linear-gradient(rgba(15,15,15,.5),rgba(15,15,15,.5)),url(${src}) center/cover #0F0F0F;` +
      `clip-path:inset(0 100% 0 0);transition:clip-path .5s cubic-bezier(.7,0,.2,1)`;
    a.appendChild(ph);
    new Image().src = src;
    a.addEventListener('mouseenter', () => { ph.style.clipPath = 'inset(0 0 0 0)'; });
    a.addEventListener('mouseleave', () => { ph.style.clipPath = 'inset(0 100% 0 0)'; });
  });
}

/* ============================================================
   Стрелки блока процесса (последовательная отрисовка clip-path)
   ============================================================ */
function initArrows(): void {
  // Секция процесса с карточками помечена data-process-arrows (ProcessSection, cards)
  const sec = document.querySelector('[data-process-arrows]');
  if (!sec) return;
  if (REDUCED) return; // стрелки остаются статичными (нарисованы CSS)
  const seq: Array<[HTMLElement, string, string, number]> = [];
  sec.querySelectorAll<HTMLElement>('[data-arw], [data-arw-a]').forEach((el) => {
    if (el.hasAttribute('data-arw')) {
      seq.push([el, 'inset(-6px 100% -6px 0)', 'inset(-6px -6px -6px 0)', 420]);
    } else {
      seq.push([el, 'inset(-6px 100% -6px 0)', 'inset(-6px -6px -6px 0)', 360]);
      const b = el.parentElement?.querySelector<HTMLElement>('[data-arw-b]');
      if (b) seq.push([b, 'inset(-6px 0 -6px 100%)', 'inset(-6px -6px -6px -6px)', 360]);
    }
  });
  const c3 = sec.querySelector<HTMLElement>('[data-arw-c]');
  if (c3) seq.push([c3, 'inset(-6px 0 -20px 100%)', 'inset(-6px -6px -20px -6px)', 420]);
  seq.forEach(([el, from]) => { el.style.clipPath = from; });
  const grid = seq.length ? seq[0][0].closest('[data-reveal]')?.parentElement : sec;
  if (!grid) return;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scroll', chk);
    window.removeEventListener('resize', chk);
    io.disconnect();
    let t = 650;
    seq.forEach(([el, , to, d]) => {
      el.style.transition = `clip-path ${d}ms cubic-bezier(.6,0,.3,1) ${t}ms`;
      requestAnimationFrame(() => { el.style.clipPath = to; });
      t += d + 60;
    });
    // Fallback: если окружение приостанавливает requestAnimationFrame
    // (паттерн плавных якорей страницы), применяем конечный кадр таймером
    window.setTimeout(() => seq.forEach(([el, , to]) => { el.style.clipPath = to; }), 40);
  };
  const chk = () => {
    const r = grid.getBoundingClientRect();
    if (r.top < innerHeight * .75 && r.bottom > 0) run();
  };
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) run(); }, { threshold: .35 });
  io.observe(grid);
  window.addEventListener('scroll', chk, { passive: true });
  window.addEventListener('resize', chk);
  chk();
}

/* ============================================================
   Формы: плавающие подписи (input/textarea/select), файл,
   обязательные поля + mock-отправка
   ============================================================ */
function initForms(): void {
  // Состояние ошибки обязательного поля (используется при отправке и сбрасывается при вводе)
  const setFieldError = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, on: boolean) => {
    const field = input.closest<HTMLElement>('[data-field]');
    const cell = input.closest<HTMLElement>('[data-cell]');
    const err = cell?.querySelector<HTMLElement>('[data-err]') ?? null;
    field?.classList.toggle('is-error', on);
    cell?.classList.toggle('is-error', on);
    if (err) err.hidden = !on;
    if (on) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };

  document.querySelectorAll<HTMLElement>('[data-field]').forEach((field) => {
    const input = field.querySelector<HTMLInputElement>('input, textarea, select');
    if (!input) return;
    const sync = () => field.classList.toggle('is-filled', input.value.length > 0);
    const clearError = () => {
      if (input.hasAttribute('aria-invalid')) setFieldError(input, false);
    };
    input.addEventListener('focus', () => field.classList.add('is-focus'));
    input.addEventListener('blur', () => { field.classList.remove('is-focus'); sync(); });
    input.addEventListener('input', () => { sync(); clearError(); });
    input.addEventListener('change', () => { sync(); clearError(); });
    sync();
  });

  document.querySelectorAll<HTMLElement>('[data-file]').forEach((f) => {
    const input = f.querySelector<HTMLInputElement>('input[type="file"]');
    const label = f.querySelector<HTMLElement>('[data-file-label]');
    input?.addEventListener('change', () => {
      const file = input.files?.[0];
      if (label) label.textContent = file ? file.name : (label.dataset.default ?? label.textContent ?? '');
    });
    if (label) label.dataset.default = label.textContent ?? '';
  });

  document.querySelectorAll<HTMLFormElement>('[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Обязательные поля (form novalidate — браузерную валидацию не используем):
      // пустое значение или одни пробелы блокируют отправку
      const requiredFields = [...form.querySelectorAll<HTMLInputElement>('input[required], textarea[required], select[required]')];
      const invalid = requiredFields.filter((i) => i.value.trim().length === 0);
      requiredFields.forEach((i) => setFieldError(i, invalid.includes(i)));
      if (invalid.length > 0) {
        invalid[0]?.focus();
        return;
      }
      const btn = form.querySelector<HTMLButtonElement>('[data-submit]');
      if (btn) {
        btn.dataset.saved = btn.querySelector('span')?.textContent ?? '';
        btn.querySelector('span')!.textContent = 'Заявка отправлена';
        btn.disabled = true;
      }
      const sent = form.parentElement?.querySelector<HTMLElement>('[data-sent]');
      if (sent) { sent.hidden = false; setTimeout(() => { sent.hidden = true; }, 4000); }
    });
  });
}

/* ============================================================
   «Наверх» в футере
   ============================================================ */
function initToTop(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-top]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });
}

/* ============================================================
   Нить: красная линия слева, метки-ответвления, логотип шапки,
   анимация марки в футере. Порт _thread() из экспорта.
   ============================================================ */
function initThread(): void {
  const root = document.querySelector<HTMLElement>('[data-page-root]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const hdr = document.querySelector<HTMLElement>('[data-hdr]');
  if (!root || !hero || !hdr || REDUCED) {
    // Без нити метки секций проявляем через IntersectionObserver
    const labels = document.querySelectorAll('.section-label--h, .section-label--v, .srow__label');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .2 });
    labels.forEach((l) => io.observe(l));
    return;
  }
  root.style.position = 'relative';

  const logoA = hdr.querySelector<HTMLElement>('[data-logo]');
  const conn = hdr.querySelector<HTMLElement>('[data-hconn]');
  const X = 22;
  const RED = '#FA001E';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:6';
  wrap.dataset.thread = '1';
  const mk = (css: string) => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;' + css;
    wrap.appendChild(d);
    return d;
  };
  const stub = mk(`left:${X}px;height:1px;background:${RED};transform:scaleX(0);transform-origin:right;transition:transform .6s cubic-bezier(.6,0,.2,1)`);
  const track = mk(`left:${X}px;width:1px;background:rgba(128,128,128,.42)`);
  const fill = mk(`left:${X}px;width:1px;background:${RED};height:0`);
  const head = mk(`left:${X - 3}px;width:7px;height:7px;background:${RED};opacity:0;transition:opacity .2s`);
  root.appendChild(wrap);

  stub.style.display = 'none';
  head.style.opacity = '1';
  wrap.style.transition = 'opacity .35s';
  wrap.style.opacity = '0';

  /* --- Логотип шапки: разбор SVG на буквы + иконку --- */
  type LogoLetters = { letters: { g: SVGGElement; b: DOMRect }[]; icon: SVGGElement };
  let lg: LogoLetters | null = null;
  const EZ = 'cubic-bezier(.7,0,.2,1)';
  const applyLogo = (collapsed: boolean) => {
    if (!lg) return;
    const n = lg.letters.length;
    lg.letters.forEach((it, i) => {
      const d = collapsed ? i * 55 : (n - 1 - i) * 40;
      it.g.style.transition = `transform .6s ${EZ} ${d}ms, opacity .25s ${collapsed ? d + 420 : d}ms`;
      it.g.style.transform = `translate(${collapsed ? 3 - it.b.x : -48}px,0)`;
      it.g.style.opacity = collapsed ? '0' : '1';
    });
    const id = collapsed ? (n - 1) * 55 + 480 : 0;
    lg.icon.style.transition = `transform .45s cubic-bezier(.3,1.3,.5,1) ${id}ms, opacity .3s ${id}ms`;
    lg.icon.style.transform = collapsed ? 'scale(1)' : 'scale(.82)';
    lg.icon.style.opacity = collapsed ? '1' : '0';
    lg.icon.querySelectorAll('path').forEach((p) => {
      p.style.transition = collapsed ? `fill .5s ${id + 320}ms` : 'fill .25s';
      p.style.fill = collapsed ? RED : '';
    });
  };

  /* --- Марка футера: буквы выезжают по клипу --- */
  const fmEl = root.querySelector<HTMLElement>('[data-fmark]');
  let fm: {
    rc: SVGRectElement;
    letters: { gw: SVGGElement; gr: SVGGElement; b: DOMRect }[];
    icon: SVGGElement[];
    w: number;
  } | null = null;
  let fmY = -1, fmOn = false, fmRaf = 0;
  const fmT: number[] = [];

  const buildFM = (svgText: string) => {
    if (!fmEl) return;
    const NS = 'http://www.w3.org/2000/svg';
    const ps = [...new DOMParser().parseFromString(svgText, 'image/svg+xml').querySelectorAll('path')];
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 219 34');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible';
    const id = 'fmc' + Math.random().toString(36).slice(2, 7);
    const defs = document.createElementNS(NS, 'defs');
    const cp = document.createElementNS(NS, 'clipPath');
    const rc = document.createElementNS(NS, 'rect');
    cp.setAttribute('id', id);
    rc.setAttribute('x', '-2'); rc.setAttribute('y', '-4'); rc.setAttribute('height', '42'); rc.setAttribute('width', '0');
    cp.appendChild(rc); defs.appendChild(cp); svg.appendChild(defs);
    const LW = document.createElementNS(NS, 'g');
    const LR = document.createElementNS(NS, 'g');
    LR.setAttribute('clip-path', `url(#${id})`);
    svg.appendChild(LW); svg.appendChild(LR);
    fmEl.appendChild(svg);
    const letters: NonNullable<typeof fm>['letters'] = [];
    const icon: SVGGElement[] = [];
    ps.forEach((p) => {
      const gw = document.createElementNS(NS, 'g');
      const gr = document.createElementNS(NS, 'g');
      const pw = document.importNode(p, true);
      const pr = document.importNode(p, true);
      pw.setAttribute('fill', '#E9EBEF');
      pr.setAttribute('fill', RED);
      gw.appendChild(pw); gr.appendChild(pr); LW.appendChild(gw); LR.appendChild(gr);
      const b = gw.getBBox();
      if (b.x + b.width >= 40) letters.push({ gw, gr, b });
      else icon.push(gw, gr);
    });
    icon.forEach((g) => { g.style.transformBox = 'view-box'; g.style.transformOrigin = '17px 17px'; });
    letters.sort((a, b) => a.b.x - b.b.x);
    letters.forEach((it) => [it.gw, it.gr].forEach((g) => {
      g.style.transform = `translate(${3 - it.b.x}px,0)`;
      g.style.opacity = '0';
    }));
    fm = { rc, letters, icon, w: 0 };
    if (fmOn) playFM(true);
  };

  const tweenW = (to: number, dur: number, delay: number) => {
    if (!fm) return;
    const from = fm.w;
    const t0 = performance.now() + delay;
    cancelAnimationFrame(fmRaf);
    const st = (now: number) => {
      if (!fm) return;
      const k = Math.max(0, Math.min(1, (now - t0) / dur));
      const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      fm.w = from + (to - from) * e;
      fm.rc.setAttribute('width', fm.w.toFixed(2));
      if (k < 1) fmRaf = requestAnimationFrame(st);
    };
    fmRaf = requestAnimationFrame(st);
  };

  const playFM = (on: boolean) => {
    if (!fm) return;
    fmT.forEach(clearTimeout);
    const n = fm.letters.length;
    if (on) {
      fm.icon.forEach((g) => { g.style.transition = 'none'; g.style.transform = 'none'; g.style.opacity = '1'; });
      tweenW(36, 560, 0);
      fmT.push(setTimeout(() => {
        fm!.icon.forEach((g) => {
          g.style.transition = `transform .5s ${EZ}, opacity .35s ease .1s`;
          g.style.transform = 'scale(.55)';
          g.style.opacity = '0';
        });
        tweenW(176, 1100, 120);
      }, 600));
      fm.letters.forEach((it, i) => {
        const d = 640 + i * 70;
        [it.gw, it.gr].forEach((g) => {
          g.style.transition = `transform .8s ${EZ} ${d}ms, opacity .25s ${d}ms`;
          g.style.transform = 'translate(-48px,0)';
          g.style.opacity = '1';
        });
      });
    } else {
      fm.letters.forEach((it, i) => {
        const d = (n - 1 - i) * 40;
        [it.gw, it.gr].forEach((g) => {
          g.style.transition = `transform .55s ${EZ} ${d}ms, opacity .2s ${d + 340}ms`;
          g.style.transform = `translate(${3 - it.b.x}px,0)`;
          g.style.opacity = '0';
        });
      });
      fm.icon.forEach((g) => {
        g.style.transition = `transform .45s ${EZ} .35s, opacity .3s .35s`;
        g.style.transform = 'none';
        g.style.opacity = '1';
      });
      tweenW(0, 500, 650);
    }
  };

  fetch('/images/logo/logo-white.svg')
    .then((r) => r.text())
    .then((t) => {
      if (fmEl) buildFM(t);
      if (!logoA) return t;
      const NS = 'http://www.w3.org/2000/svg';
      const ps = [...new DOMParser().parseFromString(t, 'image/svg+xml').querySelectorAll('path')];
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 219 34');
      svg.setAttribute('width', (219 * 26 / 34).toFixed(2));
      svg.setAttribute('height', '26');
      svg.style.cssText = 'position:absolute;top:0;left:-28px;overflow:visible';
      logoA.appendChild(svg);
      const icon = document.createElementNS(NS, 'g');
      icon.style.cssText = 'transform-box:view-box;transform-origin:17px 17px;opacity:0;transform:scale(.82)';
      svg.appendChild(icon);
      const letters: LogoLetters['letters'] = [];
      ps.forEach((p) => {
        const g = document.createElementNS(NS, 'g');
        g.appendChild(document.importNode(p, true));
        svg.appendChild(g);
        const b = g.getBBox();
        if (b.x + b.width < 40) { icon.appendChild(g.firstChild as Node); g.remove(); }
        else letters.push({ g, b });
      });
      letters.sort((a, b) => a.b.x - b.b.x);
      letters.forEach((it) => { it.g.style.transform = 'translate(-48px,0)'; });
      logoA.querySelectorAll('img').forEach((i) => i.remove());
      const per = document.createElementNS(NS, 'path');
      per.setAttribute('d', 'M3 31H31V3H3V31');
      per.setAttribute('fill', 'none');
      per.setAttribute('stroke', RED);
      per.setAttribute('stroke-width', '1.4');
      per.setAttribute('stroke-linecap', 'square');
      per.style.strokeDasharray = '112';
      per.style.strokeDashoffset = '112';
      svg.appendChild(per);
      lg = { icon, letters };
      requestAnimationFrame(() => applyLogo(intro));
      return t;
    })
    .catch(() => { /* логотип остаётся статичным img */ });

  /* --- Состояние шапки при скролле --- */
  let intro = false, live = false, iT = 0;
  const setC = (c: boolean) => {
    if (c === intro) return;
    intro = c;
    clearTimeout(iT);
    hdr.classList.toggle('is-scrolled', c);
    applyLogo(c);
    if (conn) {
      conn.style.transitionDelay = c ? '1.82s' : '0s';
      conn.style.transform = c ? 'scaleY(1)' : 'scaleY(0)';
    }
    wrap.style.transitionDelay = c ? '2.05s' : '0s';
    wrap.style.opacity = c ? '1' : '0';
    live = false;
    if (c) { iT = window.setTimeout(() => { live = true; req(); }, 2050); }
    else req();
  };
  const onHdr = () => setC(scrollY > 40);
  window.addEventListener('scroll', onHdr, { passive: true });
  onHdr();

  /* --- Геометрия нити и меток --- */
  type Node2 = { l: HTMLElement; v: boolean; p: boolean; t: number; y: number; h: number; br: HTMLDivElement; on: boolean; last: number };
  let nodes: Node2[] = [];
  let invs: { t: number; h: number; d: HTMLDivElement }[] = [];
  let y0 = 0, y1 = 0, raf = 0, disp = 0;
  const off = (e: Element | null) => {
    let t = 0, l = 0;
    while (e && e !== root) {
      t += (e as HTMLElement).offsetTop;
      l += (e as HTMLElement).offsetLeft;
      e = (e as HTMLElement).offsetParent;
    }
    return { t, l };
  };

  const layout = () => {
    const sp = document.querySelector<HTMLElement>('[data-hsp]');
    if (sp) sp.style.height = hdr.offsetHeight + 'px';
    y0 = hdr.offsetHeight;
    stub.style.top = y0 + 'px';
    stub.style.width = '0px';
    nodes.forEach((n) => n.br.remove());
    nodes = [];
    invs.forEach((z) => z.d.remove());
    invs = [];
    root.querySelectorAll<HTMLElement>('[data-tl-inv]').forEach((e) => {
      const o = off(e);
      invs.push({ t: o.t, h: e.offsetHeight, d: mk(`left:${X}px;top:${o.t}px;width:1px;height:0;background:#0F0F0F`) });
    });
    root.querySelectorAll<HTMLElement>('[data-tl]').forEach((l) => {
      const o = off(l);
      const v = l.dataset.tl === 'v';
      const x = false;
      const h = l.offsetHeight;
      const lb = l.getBoundingClientRect();
      const sq = [...l.children].find((c) => c.tagName === 'SPAN' && /background:\s*(#FA001E|rgb\(250, 0, 30\))/i.test(c.getAttribute('style') || ''));
      const sr = sq ? sq.getBoundingClientRect() : lb;
      const y = Math.round(o.t + (sr.top - lb.top) + sr.height / 2);
      const sx = Math.round(o.l + (sr.left - lb.left));
      const br = mk(`left:${X + 1}px;top:${y}px;height:1px;width:${Math.max(0, sx - X - 1)}px;background:${x || l.closest('[data-tl-inv]') ? '#0F0F0F' : RED};transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.7,0,.2,1)`);
      nodes.push({ l, v, p: v, t: o.t, y, h, br, on: false, last: -1 });
    });
    y1 = Math.round(root.getBoundingClientRect().height - 60);
    if (fmEl) {
      fmEl.style.marginLeft = '0px';
      fmEl.style.width = '100%';
      const o0 = off(fmEl);
      const s = (o0.l + fmEl.offsetWidth - X) / 165;
      fmEl.style.width = (219 * s) + 'px';
      fmEl.style.maxWidth = 'none';
      fmEl.style.marginLeft = (X - o0.l - 3 * s) + 'px';
      const o = off(fmEl);
      fmY = Math.round(o.t + 3 * s);
      y1 = fmY;
    }
    track.style.top = y0 + 'px';
    track.style.height = (y1 - y0) + 'px';
    fill.style.top = y0 + 'px';
    upd();
  };

  const upd = () => {
    raf = 0;
    const rr = root.getBoundingClientRect();
    const rem = rr.bottom - innerHeight;
    const lead = innerHeight * (.6 + .36 * Math.max(0, Math.min(1, 1 - rem / (innerHeight * .5))));
    const tgt = live ? Math.max(0, Math.min(y1, lead - rr.top) - y0) : 0;
    disp += (tgt - disp) * (disp < 200 && tgt > disp ? .07 : .12);
    if (Math.abs(tgt - disp) < .5) disp = tgt;
    const fy = y0 + disp;
    fill.style.height = disp + 'px';
    head.style.top = (fy - 3) + 'px';
    let inZ = false;
    invs.forEach((z) => {
      const hh = Math.max(0, Math.min(z.h, fy - z.t));
      z.d.style.height = hh + 'px';
      if (fy > z.t && fy < z.t + z.h) inZ = true;
    });
    head.style.background = inZ ? '#0F0F0F' : RED;
    nodes.forEach((n) => {
      const on = fy >= n.y;
      if (on !== n.on) {
        n.on = on;
        n.br.style.transform = on ? 'scaleX(1)' : 'scaleX(0)';
        if (!n.v) n.l.classList.toggle('in', on);
      }
      if (n.v) {
        const fr = Math.max(0, Math.min(1, (fy - n.t) / n.h));
        if (fr !== n.last) {
          n.last = fr;
          n.l.style.clipPath = `inset(${((1 - fr) * 100).toFixed(2)}% 0 0 0)`;
        }
      }
    });
    if (fmEl && fmY > 0) {
      const on = fy >= fmY - 1;
      if (on !== fmOn) {
        fmOn = on;
        fmT.forEach(clearTimeout);
        if (on) fmT.push(setTimeout(() => playFM(true), 380));
        else playFM(false);
      }
      head.style.opacity = on ? '0' : '1';
    }
    if (disp !== tgt) req();
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(upd); };

  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', layout);
  layout();
  setTimeout(layout, 1200);
  if (document.fonts) document.fonts.ready.then(() => layout());
  [...root.querySelectorAll('img')].forEach((im) => {
    if (!im.complete) im.addEventListener('load', () => layout(), { once: true });
  });
}

/* ============================================================
   Частицы «20»: canvas, разбор глифа, параллакс, курсор.
   Порт _particles() из экспорта.
   ============================================================ */
function initParticles(): void {
  const el = document.querySelector<HTMLElement>('[data-parallax]');
  if (!el || REDUCED) return;
  const S = 4, DEP = 110, F = 1400, R = 240, COL = '#D4D7DC';
  const host = el.closest<HTMLElement>('[data-screen-label]') ?? el.parentElement!;
  const capEl = host.querySelector<HTMLElement>('[data-cap]');
  const cap = capEl && {
    lines: [...capEl.querySelectorAll<HTMLElement>('[data-cap-line]')],
    plate: capEl.querySelector<HTMLElement>('[data-cap-plate]'),
  };
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d')!;
  if (capEl) {
    const cw = capEl.closest('[data-reveal]') ?? capEl;
    const g = cw.parentElement;
    if (g && g !== host) {
      [...(g as HTMLElement).children].forEach((c) => {
        const st = getComputedStyle(c);
        if (st.position === 'static') (c as HTMLElement).style.position = 'relative';
        if (st.zIndex === 'auto') (c as HTMLElement).style.zIndex = '3';
      });
      (g as HTMLElement).style.zIndex = 'auto';
    }
    const st = getComputedStyle(cw);
    if (st.position === 'static') (cw as HTMLElement).style.position = 'relative';
    (cw as HTMLElement).style.zIndex = '5';
  }

  type P = {
    hx: number; hy: number; hz: number; sx: number; sy: number; ex: number; ey: number;
    dl: number; ax: number; ay: number; th: number; ox: number; oy: number;
    pull: number; spr: number; sz: number;
  };
  let P: P[] = [];
  let W = 0, H = 0, base = 1, dpr = 1, raf = 0, t0 = 0, alive = true, ocx = 0, ocy = 0;
  let BX: Float32Array, BY: Float32Array, BS: Float32Array, BB: Uint8Array;
  let GR = 400, lastP = -1;
  const NB = 8;
  const mouse = { x: -1e4, y: -1e4, nx: 0, ny: 0, sx: 0, sy: 0 };

  const build = () => {
    const r = el.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const w = Math.round(r.width);
    const pad = Math.round(fs * .25);
    const mw = w + pad * 2;
    const mh = Math.round(r.height) + pad * 2;
    W = Math.round(hr.width);
    H = Math.round(hr.height);
    dpr = Math.min(1.5, devicePixelRatio || 1);
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none;z-index:4`;
    if (!cv.parentNode) host.appendChild(cv);
    const m = document.createElement('canvas');
    m.width = mw; m.height = mh;
    const mc = m.getContext('2d')!;
    mc.font = `${cs.fontWeight} ${fs}px Steelfish`;
    mc.fillStyle = mc.strokeStyle = '#000';
    mc.textBaseline = 'alphabetic';
    mc.lineWidth = fs * .04;
    mc.lineJoin = 'round';
    const met = mc.measureText('20');
    const asc = met.fontBoundingBoxAscent ?? fs * .8;
    const desc = met.fontBoundingBoxDescent ?? fs * .2;
    const ls = parseFloat(cs.letterSpacing) || 0;
    const chars = (el.firstChild?.textContent ?? '20').trim().split('');
    const gap = mc.lineWidth * 1.4;
    const adv = chars.map((c) => mc.measureText(c).width);
    const tot = adv.reduce((a, b) => a + b + ls, 0) + gap * (chars.length - 1);
    let x = pad + w - tot - mc.lineWidth / 2;
    const y = pad + (r.height - (asc + desc)) / 2 + asc;
    chars.forEach((c, i) => { mc.fillText(c, x, y); mc.strokeText(c, x, y); x += adv[i]! + ls + gap; });
    if (!(mw > 0 && mh > 0)) return;
    const d = mc.getImageData(0, 0, mw, mh).data;
    const on = (xx: number, yy: number) => xx >= 0 && yy >= 0 && xx < mw && yy < mh && d[(yy * mw + xx) * 4 + 3]! > 128;
    let x0 = mw, x1 = 0, y0 = mh, y1 = 0;
    for (let yy = 0; yy < mh; yy += 2) {
      for (let xx = 0; xx < mw; xx += 2) {
        if (on(xx, yy)) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      }
    }
    const shiftY = Math.max(0, (y1 - pad) - r.height + fs * .02);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    ocx = r.left - hr.left - pad + cx;
    ocy = r.top - hr.top - pad + cy - shiftY + 40;
    base = hr.top + scrollY + ocy + (y1 - y0) / 2;
    GR = Math.max(x1 - x0, y1 - y0) * .85;
    P = [];
    // Источник точек — текст H1
    const SRC: number[] = [];
    const h1 = host.querySelector('h1');
    if (h1) {
      const sm = document.createElement('canvas');
      sm.width = W; sm.height = H;
      const sc = sm.getContext('2d')!;
      sc.textBaseline = 'bottom';
      sc.fillStyle = '#000';
      const tw = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      const rg = document.createRange();
      let tn: Node | null;
      while ((tn = tw.nextNode())) {
        const st = getComputedStyle(tn.parentElement!);
        sc.font = `${st.fontWeight} ${st.fontSize} Steelfish`;
        try { sc.fontStretch = 'ultra-condensed'; } catch { /* ignore */ }
        const re = /\S+/g;
        const txt = tn.textContent ?? '';
        let mt: RegExpExecArray | null;
        while ((mt = re.exec(txt))) {
          rg.setStart(tn, mt.index);
          rg.setEnd(tn, mt.index + mt[0].length);
          const rc = rg.getBoundingClientRect();
          if (!rc.width) continue;
          const wd = mt[0].toUpperCase();
          const mm = sc.measureText(wd);
          const sxk = mm.width ? rc.width / mm.width : 1;
          const asc2 = mm.fontBoundingBoxAscent ?? parseFloat(st.fontSize) * .8;
          const dsc2 = mm.fontBoundingBoxDescent ?? parseFloat(st.fontSize) * .2;
          const by = rc.top - hr.top + (rc.height - asc2 - dsc2) / 2 + asc2;
          sc.setTransform(sxk, 0, 0, 1, rc.left - hr.left, by);
          sc.textBaseline = 'alphabetic';
          sc.fillText(wd, 0, 0);
          sc.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
      if (!(W > 0 && H > 0)) return;
      const sd = sc.getImageData(0, 0, W, H).data;
      for (let yy = 0; yy < H; yy += 3) {
        for (let xx = 0; xx < W; xx += 3) {
          if (sd[(yy * W + xx) * 4 + 3]! > 128) SRC.push(xx, yy);
        }
      }
    }
    const ns = SRC.length / 2;
    const add = (x2: number, y2: number, z: number) => {
      let sx: number, sy: number;
      if (ns) {
        const j = (Math.random() * ns | 0) * 2;
        sx = SRC[j]!; sy = SRC[j + 1]!;
      } else { sx = Math.random() * W; sy = Math.random() * H; }
      const j2 = ns ? (Math.random() * ns | 0) * 2 : 0;
      P.push({
        hx: x2 - cx, hy: y2 - cy, hz: z, sx, sy,
        ex: ns ? SRC[j2]! : sx, ey: ns ? SRC[j2 + 1]! : sy,
        dl: Math.random() * .9,
        ax: (Math.random() - .5) * 260, ay: -80 - Math.random() * 220,
        th: Math.random(), ox: 0, oy: 0,
        pull: .55 + Math.random() * .4, spr: .05 + Math.random() * .09,
        sz: .8 + Math.random() * .8,
      });
    };
    for (let yy = 0; yy < mh; yy += S) {
      for (let xx = 0; xx < mw; xx += S) {
        const jx = xx + (Math.random() - .5) * S * .9 | 0;
        const jy = yy + (Math.random() - .5) * S * .9 | 0;
        if (!on(jx, jy)) continue;
        const edge = !on(jx - S, jy) || !on(jx + S, jy) || !on(jx, jy - S) || !on(jx, jy + S);
        add(jx, jy, -DEP / 2);
        if (edge) { for (let k = 1; k <= 5; k++) add(jx, jy, -DEP / 2 + DEP * k / 5); }
        else if (Math.random() < .25) add(jx, jy, DEP / 2);
      }
    }
    ctx.fillStyle = COL;
    if (!t0) t0 = performance.now();
    BX = new Float32Array(P.length);
    BY = new Float32Array(P.length);
    BS = new Float32Array(P.length);
    BB = new Uint8Array(P.length);
    wake();
  };

  const wake = () => { if (!raf && alive) raf = requestAnimationFrame(loop); };
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  const loop = (now: number) => {
    raf = 0;
    if (!alive || !P.length) return;
    const rb = cv.getBoundingClientRect();
    if (rb.bottom < 0 || rb.top > innerHeight) return;
    const p = Math.min(1, Math.max(0, scrollY / base));
    const T = (now - t0) / 1000;
    if (p >= 1 && lastP >= 1) return;
    const dsx = mouse.nx - mouse.sx, dsy = mouse.ny - mouse.sy;
    mouse.sx += dsx * .06; mouse.sy += dsy * .06;
    const ry = -.18 + mouse.sx * .2, rx = .06 - mouse.sy * .1;
    const cl = cap ? cap.lines : [];
    for (let j = 0; j < cl.length; j++) {
      const ii = Math.min(1, Math.max(0, (T - 1.6 - j * .14) / .8));
      const ie = 1 - Math.pow(1 - ii, 4);
      const so = Math.min(1, Math.max(0, (p - j * .035) / .16));
      const se2 = so * so * (3 - 2 * so);
      cl[j]!.style.transform = `translateY(${((1 - ie) * 110 - se2 * 110).toFixed(2)}%)`;
    }
    if (cap && cap.plate) {
      const pi = Math.min(1, Math.max(0, (T - 2.2) / .55));
      const pe = 1 - Math.pow(1 - pi, 3);
      const ps = Math.min(1, Math.max(0, p / .09));
      cap.plate.style.clipPath = `inset(0 ${((1 - pe) * 100).toFixed(1)}% 0 ${(ps * 100).toFixed(1)}%)`;
    }
    let moving = T < 3.6 || p !== lastP || Math.abs(dsx) + Math.abs(dsy) > .002;
    lastP = p;
    const R2 = R * R, iDep = 1 / (DEP * 2);
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
    const ox0 = ocx, oy0 = ocy;
    const mx = mouse.x - rb.left, my = mouse.y - rb.top;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const ga = Math.min(1, T / 2.6) * (1 - p);
    if (ga > .01) {
      const gr = ctx.createRadialGradient(ocx, ocy, 0, ocx, ocy, GR);
      gr.addColorStop(0, `rgba(233,235,239,${.085 * ga})`);
      gr.addColorStop(.45, `rgba(233,235,239,${.035 * ga})`);
      gr.addColorStop(1, 'rgba(233,235,239,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(ocx - GR, ocy - GR, GR * 2, GR * 2);
      ctx.fillStyle = COL;
    }
    for (let i = 0, n = P.length; i < n; i++) {
      const q = P[i]!;
      const st = p <= q.th * .45 ? 0 : Math.min(1, (p - q.th * .45) / .5);
      const se = st < 1 ? st * st * (3 - 2 * st) : 1;
      const it = T >= q.dl + 2 ? 1 : ease(Math.max(0, (T - q.dl) / 2));
      const a = (T < q.dl ? 0 : 1) * (1 - Math.max(0, se - .8) * 5);
      if (a <= .02) { BB[i] = 255; continue; }
      const x = q.hx, y = q.hy, z = q.hz;
      let x1 = x * cY - z * sY, z1 = x * sY + z * cY;
      const y1 = y * cX - z1 * sX;
      z1 = y * sX + z1 * cX;
      const k = F / (F + z1);
      const hx2 = ox0 + x1 * k, hy2 = oy0 + y1 * k;
      const ai = Math.sin(Math.PI * it), as = Math.sin(Math.PI * se);
      let px2 = q.sx + (hx2 - q.sx) * it + q.ax * ai;
      let py2 = q.sy + (hy2 - q.sy) * it + q.ay * ai;
      if (se > 0) { px2 += (q.ex - px2) * se + q.ax * as; py2 += (q.ey - py2) * se + q.ay * as; }
      const dx = mx - px2, dy = my - py2;
      const d2 = dx * dx + dy * dy;
      let tx = 0, ty = 0;
      if (d2 < R2) {
        const u = 1 - Math.sqrt(d2) / R;
        const f = q.pull * u * Math.sqrt(u);
        tx = dx * f; ty = dy * f;
      }
      if (tx || ty || q.ox || q.oy) {
        const ex = tx - q.ox, ey = ty - q.oy;
        if (ex * ex + ey * ey < .01) { q.ox = tx; q.oy = ty; }
        else { q.ox += ex * q.spr; q.oy += ey * q.spr; moving = true; }
        px2 += q.ox; py2 += q.oy;
      }
      const l0 = Math.max(.22, Math.min(1, .8 - z1 * iDep));
      const fr = se > 0 ? Math.min(it, 1 - se) : it;
      const light = l0 + (1 - l0) * (1 - fr) * (1 - fr);
      const s2 = q.sz * k;
      BX[i] = px2 - s2 / 2;
      BY[i] = py2 - s2 / 2;
      BS[i] = s2;
      BB[i] = Math.min(NB - 1, a * light * NB | 0);
    }
    for (let b = 0; b < NB; b++) {
      ctx.globalAlpha = .6 * (b + .5) / NB;
      ctx.beginPath();
      for (let i = 0, n = P.length; i < n; i++) if (BB[i] === b) ctx.rect(BX[i]!, BY[i]!, BS[i]!, BS[i]!);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (moving) wake();
  };

  const onMove = (e: MouseEvent) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    mouse.nx = (e.clientX / innerWidth - .5) * 2;
    mouse.ny = (e.clientY / innerHeight - .5) * 2;
    wake();
  };
  const onLeave = () => { mouse.x = mouse.y = -1e4; wake(); };
  const onScroll = () => wake();
  const onResize = () => build();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  window.addEventListener('resize', onResize);

  (document.fonts
    ? document.fonts.load('800 100px Steelfish').then(() => document.fonts.ready)
    : Promise.resolve()
  ).then(build);
}

/* ============================================================
   Запуск
   ============================================================ */
function boot(): void {
  initMenu();
  initReveal();
  initCounters();
  initChips();
  initArrows();
  initForms();
  initToTop();
  initThread();
  initParticles();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
