/**
 * Интерактив главной страницы «Простор».
 * Порт логики экспорта Claude Design (reference/claude-design/index.html)
 * на чистый TypeScript без React-рантайма.
 *
 * Модули: reveal, counters, меню, шапка (scroll + морф логотипа + нить),
 * частицы «20», стрелки процесса, чипы отраслей, формы (mock), наверх.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) document.documentElement.classList.add('fx');

const on = (el: EventTarget | null | undefined, ev: string, fn: EventListener, opts?: AddEventListenerOptions) =>
  el?.addEventListener(ev, fn, opts);

/* ============================================================
   Scroll-reveal
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reducedMotion) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.1 }
  );
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    else io.observe(el);
  });
  // Страховка: если observer не сработал, показываем всё
  setTimeout(() => els.forEach((el) => el.classList.add('in')), 2500);
}

/* Горизонтальные подписи секций раскрываются нитью; но даём им и reveal-фолбэк */
function initLabelReveal() {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.4 }
  );
  document.querySelectorAll('.section-label[data-tl="h"]').forEach((el) => io.observe(el));
}

/* ============================================================
   Счётчики кейсов
   ============================================================ */
function initCounters() {
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const to = Number(el.dataset.count);
        const t0 = performance.now();
        const d = 1500;
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / d);
          el.textContent = String(Math.round(to * ease(p)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }),
    { threshold: 0.4 }
  );
  document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
}

/* ============================================================
   Чипы отраслей: фото-подложка по hover
   ============================================================ */
function initChips() {
  document.querySelectorAll<HTMLElement>('[data-chip-photo]').forEach((a) => {
    const src = a.dataset.chipPhoto;
    if (!src || a.querySelector('.industry-chip__photo')) return;
    const ph = document.createElement('span');
    ph.className = 'industry-chip__photo';
    ph.style.backgroundImage = `linear-gradient(rgba(15,15,15,.5),rgba(15,15,15,.5)),url("${src}")`;
    a.appendChild(ph);
    const img = new Image();
    img.src = src;
    if (reducedMotion) return;
    a.addEventListener('mouseenter', () => (ph.style.clipPath = 'inset(0 0 0 0)'));
    a.addEventListener('mouseleave', () => (ph.style.clipPath = 'inset(0 100% 0 0)'));
  });
}

/* ============================================================
   Мобильное меню
   ============================================================ */
function initMenu() {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const btn = document.querySelector<HTMLElement>('[data-mbtn]');
  const closeBtn = menu?.querySelector<HTMLElement>('[data-close-menu]');
  if (!menu || !btn) return;

  const setOpen = (open: boolean) => {
    menu.dataset.open = String(open);
    menu.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  setOpen(false);

  on(btn, 'click', (e) => {
    e.preventDefault();
    setOpen(menu.dataset.open !== 'true');
  });
  on(closeBtn, 'click', () => setOpen(false));

  // Якорные ссылки внутри меню: закрываем и скроллим
  on(menu, 'click', (e) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('href')!;
    setOpen(false);
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) setTimeout(() => t.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }), 80);
    }
  });

  on(document, 'click', (e) => {
    if (menu.dataset.open === 'true' && !(e.target as HTMLElement).closest('[data-menu]') && !(e.target as HTMLElement).closest('[data-mbtn]'))
      setOpen(false);
  });
  on(window, 'keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Escape' && menu.dataset.open === 'true') {
      setOpen(false);
      btn.focus();
    }
  });

  // Группы услуг: на мобильном свёрнуты, на десктопе раскрыты;
  // на десктопе переключение отключено — группы всегда раскрыты
  const groups = [...menu.querySelectorAll<HTMLDetailsElement>('[data-msnav] details')];
  if (groups.length) {
    let mobile = window.innerWidth <= 768;
    groups.forEach((d) => (d.open = !mobile));
    menu.querySelectorAll('[data-msnav] summary').forEach((s) =>
      on(s, 'click', (e) => {
        if (window.innerWidth > 768) e.preventDefault();
      })
    );
    on(window, 'resize', () => {
      const m = window.innerWidth <= 768;
      if (m !== mobile) {
        mobile = m;
        groups.forEach((d) => (d.open = !m));
      }
    });
  }
}

/* ============================================================
   Формы: плавающие подписи, файл, mock-отправка
   ============================================================ */
function initForms() {
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-float-input]').forEach((input) => {
    const field = input.closest('[data-field]');
    const sync = () => field?.classList.toggle('is-filled', Boolean(input.value));
    on(input, 'input', sync);
    on(input, 'change', sync);
    sync();
    if (input instanceof HTMLInputElement && input.dataset.placeholderOnFocus) {
      on(input, 'focus', () => (input.placeholder = input.dataset.placeholderOnFocus!));
      on(input, 'blur', () => (input.placeholder = ''));
    }
  });

  document.querySelectorAll<HTMLElement>('[data-file-field]').forEach((field) => {
    const input = field.querySelector<HTMLInputElement>('input[type="file"]');
    const label = field.querySelector<HTMLElement>('[data-file-label]');
    const defaultLabel = label?.textContent ?? '';
    on(input, 'change', () => {
      const f = input?.files?.[0];
      if (label) label.textContent = f ? f.name : defaultLabel;
    });
  });

  document.querySelectorAll<HTMLFormElement>('[data-mock-form]').forEach((form) => {
    on(form, 'submit', (e) => {
      e.preventDefault();
      // Валидация обязательных полей (поля с data-required; на главной их нет)
      const requiredInputs = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-required]')];
      let firstInvalid: HTMLInputElement | HTMLTextAreaElement | null = null;
      for (const input of requiredInputs) {
        const invalid = !input.value.trim();
        input.closest('[data-field]')?.classList.toggle('is-error', invalid);
        if (invalid && !firstInvalid) firstInvalid = input;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      const btn = form.querySelector<HTMLElement>('[data-send-label]');
      if (btn) btn.textContent = 'Заявка отправлена';
      form.classList.add('is-sent');
    });
    // Ошибки сбрасываются при вводе
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-required]').forEach((input) =>
      on(input, 'input', () => input.closest('[data-field]')?.classList.remove('is-error'))
    );
  });
}

/* ============================================================
   FAQ-аккордеон: кнопка + hidden-панель
   ============================================================ */
function initFaq() {
  document.querySelectorAll<HTMLElement>('[data-faq-item]').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('[data-faq-button]');
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    if (!btn || !panel) return;
    on(btn, 'click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });
}

/* ============================================================
   Наверх
   ============================================================ */
function initToTop() {
  document.querySelectorAll('[data-to-top]').forEach((btn) =>
    on(btn, 'click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    })
  );
}

/* ============================================================
   Шапка: состояние при скролле, морф логотипа, «нить»,
   анимация марки в футере
   ============================================================ */
interface LogoParts {
  icon: SVGGElement[];
  letters: { g: SVGGElement; gr?: SVGGElement; b: DOMRect }[];
  per?: SVGPathElement;
}

function initHeaderFx() {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;
  const root = (hero.parentElement as HTMLElement) ?? document.body;
  root.style.position = 'relative';
  const hdr = document.querySelector<HTMLElement>('[data-hdr]');
  const logoA = hdr?.querySelector<HTMLElement>('[data-logo]') ?? null;
  const conn = hdr?.querySelector<HTMLElement>('[data-hconn]') ?? null;

  const X = window.innerWidth <= 768 ? 10 : 22;
  const RED = '#FA001E';
  const TR = 'rgba(128,128,128,.42)';
  const EZ = 'cubic-bezier(.7,0,.2,1)';

  /* ---- Оверлей нити ---- */
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:6';
  wrap.dataset.thread = '1';
  const mk = (css: string) => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;' + css;
    wrap.appendChild(d);
    return d as HTMLElement;
  };
  const stub = mk(`left:${X}px;height:1px;background:${RED};transform:scaleX(0);transform-origin:right;transition:transform .6s cubic-bezier(.6,0,.2,1);display:none`);
  mk(`left:${X}px;width:1px;background:${TR}`);
  const track = wrap.children[1] as HTMLElement;
  const fill = mk(`left:${X}px;width:1px;background:${RED};height:0`);
  const head = mk(`left:${X - 3}px;width:7px;height:7px;background:${RED};opacity:1;transition:opacity .2s`);
  root.appendChild(wrap);
  wrap.style.transition = 'opacity .35s';
  wrap.style.opacity = '0';
  stub.style.display = 'none';

  /* ---- Морф логотипа шапки ---- */
  let lg: LogoParts | null = null;
  let intro = false;

  const applyLogo = (c: boolean) => {
    if (!lg) return;
    const n = lg.letters.length;
    lg.letters.forEach((it, i) => {
      const d = c ? i * 55 : (n - 1 - i) * 40;
      it.g.style.transition = `transform .6s ${EZ} ${d}ms, opacity .25s ${c ? d + 420 : d}ms`;
      it.g.style.transform = `translate(${c ? 3 - it.b.x : -48}px,0)`;
      it.g.style.opacity = c ? '0' : '1';
    });
    const id = c ? (n - 1) * 55 + 480 : 0;
    const iconG = lg.icon[0] as unknown as SVGGElement & HTMLElement;
    if (iconG) {
      iconG.style.transition = `transform .45s cubic-bezier(.3,1.3,.5,1) ${id}ms, opacity .3s ${id}ms`;
      iconG.style.transform = c ? 'scale(1)' : 'scale(.82)';
      iconG.style.opacity = c ? '1' : '0';
    }
    if (lg.per) {
      lg.per.style.transition = c ? `stroke-dashoffset .5s ${id + 320}ms` : 'stroke-dashoffset .25s';
      lg.per.style.strokeDashoffset = c ? '0' : '112';
    }
  };

  /* ---- Марка футера ---- */
  const fmEl = root.querySelector<HTMLElement>('[data-fmark]');
  let fm: { rc: SVGRectElement; letters: { gw: SVGGElement; gr: SVGGElement; b: DOMRect }[]; icon: SVGGElement[]; w: number } | null = null;
  let fmY = -1;
  let fmOn = false;
  let fmRaf = 0;
  let fmT: number[] = [];

  const tweenW = (to: number, dur: number, delay: number) => {
    if (!fm) return;
    const from = fm.w;
    const t0 = performance.now() + delay;
    cancelAnimationFrame(fmRaf);
    const st = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - t0) / dur));
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      fm!.w = from + (to - from) * e;
      fm!.rc.setAttribute('width', fm!.w.toFixed(2));
      if (k < 1) fmRaf = requestAnimationFrame(st);
    };
    fmRaf = requestAnimationFrame(st);
  };

  const playFM = (onv: boolean) => {
    if (!fm) return;
    fmT.forEach(clearTimeout);
    fmT = [];
    const n = fm.letters.length;
    const setG = (g: SVGGElement, tr: string, op: string) => {
      (g as unknown as HTMLElement).style.transform = tr;
      (g as unknown as HTMLElement).style.opacity = op;
    };
    if (onv) {
      fm.icon.forEach((g) => setG(g, 'none', '1'));
      tweenW(36, 560, 0);
      fmT.push(
        setTimeout(() => {
          fm!.icon.forEach((g) => {
            (g as unknown as HTMLElement).style.transition = `transform .5s ${EZ}, opacity .35s ease .1s`;
            setG(g, 'scale(.55)', '0');
          });
          tweenW(176, 1100, 120);
        }, 600)
      );
      fm.letters.forEach((it, i) => {
        const d = 640 + i * 70;
        [it.gw, it.gr].forEach((g) => {
          (g as unknown as HTMLElement).style.transition = `transform .8s ${EZ} ${d}ms, opacity .25s ${d}ms`;
          setG(g, 'translate(-48px,0)', '1');
        });
      });
    } else {
      fm.letters.forEach((it, i) => {
        const d = (n - 1 - i) * 40;
        [it.gw, it.gr].forEach((g) => {
          (g as unknown as HTMLElement).style.transition = `transform .55s ${EZ} ${d}ms, opacity .2s ${d + 340}ms`;
          setG(g, `translate(${3 - it.b.x}px,0)`, '0');
        });
      });
      fm.icon.forEach((g) => {
        (g as unknown as HTMLElement).style.transition = `transform .45s ${EZ} .35s, opacity .3s .35s`;
        setG(g, 'none', '1');
      });
      tweenW(0, 500, 650);
    }
  };

  const buildFM = (text: string) => {
    if (!fmEl) return;
    const NS = 'http://www.w3.org/2000/svg';
    const ps = [...new DOMParser().parseFromString(text, 'image/svg+xml').querySelectorAll('path')];
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 219 34');
    (svg as unknown as HTMLElement).style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible';
    const id = 'fmc' + Math.random().toString(36).slice(2, 7);
    const defs = document.createElementNS(NS, 'defs');
    const cp = document.createElementNS(NS, 'clipPath');
    const rc = document.createElementNS(NS, 'rect');
    cp.setAttribute('id', id);
    rc.setAttribute('x', '-2');
    rc.setAttribute('y', '-4');
    rc.setAttribute('height', '42');
    rc.setAttribute('width', '0');
    cp.appendChild(rc);
    defs.appendChild(cp);
    svg.appendChild(defs);
    const LW = document.createElementNS(NS, 'g');
    const LR = document.createElementNS(NS, 'g');
    LR.setAttribute('clip-path', `url(#${id})`);
    svg.appendChild(LW);
    svg.appendChild(LR);
    fmEl.appendChild(svg);
    const letters: { gw: SVGGElement; gr: SVGGElement; b: DOMRect }[] = [];
    const icon: SVGGElement[] = [];
    ps.forEach((p) => {
      const gw = document.createElementNS(NS, 'g');
      const gr = document.createElementNS(NS, 'g');
      const pw = document.importNode(p, true) as SVGPathElement;
      const pr = document.importNode(p, true) as SVGPathElement;
      pw.setAttribute('fill', '#E9EBEF');
      pr.setAttribute('fill', RED);
      gw.appendChild(pw);
      gr.appendChild(pr);
      LW.appendChild(gw);
      LR.appendChild(gr);
      const b = (gw as unknown as SVGGElement).getBBox();
      if (b.x + b.width >= 40) letters.push({ gw, gr, b });
      else icon.push(gw, gr);
    });
    icon.forEach((g) => {
      (g as unknown as HTMLElement).style.transformBox = 'view-box';
      (g as unknown as HTMLElement).style.transformOrigin = '17px 17px';
    });
    letters.sort((a, b) => a.b.x - b.b.x);
    letters.forEach((it) =>
      [it.gw, it.gr].forEach((g) => {
        (g as unknown as HTMLElement).style.transform = `translate(${3 - it.b.x}px,0)`;
        (g as unknown as HTMLElement).style.opacity = '0';
      })
    );
    fm = { rc: rc as unknown as SVGRectElement, letters, icon, w: 0 };
    if (fmOn) playFM(true);
  };

  /* ---- Построение логотипа шапки из SVG ---- */
  const buildHeaderLogo = (text: string) => {
    if (!logoA) return;
    const NS = 'http://www.w3.org/2000/svg';
    const ps = [...new DOMParser().parseFromString(text, 'image/svg+xml').querySelectorAll('path')];
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 219 34');
    svg.setAttribute('width', (219 * 26 / 34).toFixed(2));
    svg.setAttribute('height', '26');
    (svg as unknown as HTMLElement).style.cssText = 'position:absolute;top:0;left:-28px;overflow:visible';
    logoA.appendChild(svg);
    const iconG = document.createElementNS(NS, 'g');
    (iconG as unknown as HTMLElement).style.cssText =
      'transform-box:view-box;transform-origin:17px 17px;opacity:0;transform:scale(.82)';
    svg.appendChild(iconG);
    const letters: { g: SVGGElement; b: DOMRect }[] = [];
    ps.forEach((p) => {
      const g = document.createElementNS(NS, 'g');
      g.appendChild(document.importNode(p, true));
      svg.appendChild(g);
      const b = (g as unknown as SVGGElement).getBBox();
      if (b.x + b.width < 40) {
        iconG.appendChild(g.firstChild!);
        g.remove();
      } else {
        letters.push({ g: g as unknown as SVGGElement, b });
      }
    });
    letters.sort((a, b) => a.b.x - b.b.x);
    letters.forEach((it) => ((it.g as unknown as HTMLElement).style.transform = 'translate(-48px,0)'));
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
    lg = { icon: [iconG as unknown as SVGGElement], letters: letters.map((l) => ({ g: l.g, b: l.b })), per: per as unknown as SVGPathElement };
    requestAnimationFrame(() => applyLogo(intro));
  };

  fetch('/images/logo/logo-white.svg')
    .then((r) => r.text())
    .then((t) => {
      buildFM(t);
      if (logoA) buildHeaderLogo(t);
    })
    .catch(() => {});

  /* ---- Состояние шапки при скролле ---- */
  let live = false;
  let iT = 0;
  const setC = (c: boolean) => {
    if (c === intro || !hdr) return;
    intro = c;
    window.clearTimeout(iT);
    hdr.classList.toggle('is-scrolled', c);
    applyLogo(c);
    if (conn) {
      (conn as HTMLElement).style.transitionDelay = c ? '1.82s' : '0s';
      conn.style.transform = c ? 'scaleY(1)' : 'scaleY(0)';
    }
    wrap.style.transitionDelay = c ? '2.05s' : '0s';
    wrap.style.opacity = c ? '1' : '0';
    live = false;
    if (c) {
      disp = 0;
      iT = window.setTimeout(() => {
        live = true;
        req();
      }, 2050);
    } else req();
  };
  const onHdr = () => setC(window.scrollY > 40);
  on(window, 'scroll', onHdr, { passive: true });
  onHdr();

  /* ---- Нить: узлы [data-tl], инверсии [data-tl-inv] ---- */
  interface Node {
    l: HTMLElement;
    v: boolean;
    p: boolean;
    t: number;
    y: number;
    h: number;
    br: HTMLElement;
    on: boolean;
    last: number;
  }
  let nodes: Node[] = [];
  let invs: { t: number; h: number; d: HTMLElement }[] = [];
  let y0 = 0;
  let y1 = 0;
  let raf = 0;
  let disp = 0;

  const off = (e: HTMLElement) => {
    let t = 0;
    let l = 0;
    let el: HTMLElement | null = e;
    while (el && el !== root) {
      t += el.offsetTop;
      l += el.offsetLeft;
      el = el.offsetParent as HTMLElement | null;
    }
    return { t, l };
  };

  const layout = () => {
    const rr = root.getBoundingClientRect();
    if (hdr) {
      const sp = document.querySelector<HTMLElement>('[data-hsp]');
      if (sp) sp.style.height = hdr.offsetHeight + 'px';
      const logoImg = hdr.querySelector<HTMLElement>('[data-logo-word]');
      if (logoImg) {
        const ir = logoImg.getBoundingClientRect();
        const hb = hdr.getBoundingClientRect();
        const k = logoImg.offsetHeight / 34;
        conn && ((conn as HTMLElement).style.top = `${Math.round(ir.top - hb.top + 31 * k)}px`);
      }
    }
    const logoImg = root.querySelector<HTMLElement>('img');
    y0 = hdr ? hdr.offsetHeight : 0;
    stub.style.top = y0 + 'px';
    stub.style.width = `${Math.max(0, Math.round((logoImg ? logoImg.getBoundingClientRect().left - rr.left : 0)) - X)}px`;
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
      const h = l.offsetHeight;
      const lb = l.getBoundingClientRect();
      const sq = [...l.children].find(
        (c) => c.tagName === 'SPAN' && /background:\s*(#FA001E|rgb\(250, 0, 30\))/i.test(c.getAttribute('style') || '')
      );
      const sr = sq ? (sq as HTMLElement).getBoundingClientRect() : lb;
      const y = Math.round(o.t + (sr.top - lb.top) + sr.height / 2);
      const sx = Math.round(o.l + (sr.left - lb.left));
      const dark = Boolean(l.closest('[data-tl-inv]'));
      const br = mk(
        `left:${X + 1}px;top:${y}px;height:1px;width:${Math.max(0, sx - X - 1)}px;background:${dark ? '#0F0F0F' : RED};transform:scaleX(0);transform-origin:left;transition:transform .45s ${EZ}`
      );
      nodes.push({ l, v, p: false, t: o.t, y, h, br, on: false, last: -1 });
    });
    y1 = Math.round(rr.height - 60);
    if (fmEl) {
      fmEl.style.marginLeft = '0px';
      fmEl.style.width = '100%';
      const o0 = off(fmEl);
      const s = (o0.l + fmEl.offsetWidth - X) / 165;
      fmEl.style.width = 219 * s + 'px';
      fmEl.style.maxWidth = 'none';
      fmEl.style.marginLeft = X - o0.l - 3 * s + 'px';
      const o = off(fmEl);
      fmY = Math.round(o.t + 3 * s);
      y1 = fmY;
    }
    track.style.top = y0 + 'px';
    track.style.height = y1 - y0 + 'px';
    fill.style.top = y0 + 'px';
    upd();
  };

  const upd = () => {
    raf = 0;
    const rr = root.getBoundingClientRect();
    const rem = rr.bottom - window.innerHeight;
    const lead = window.innerHeight * (0.6 + 0.36 * Math.max(0, Math.min(1, 1 - rem / (window.innerHeight * 0.5))));
    const tgt = live ? Math.max(0, Math.min(y1, lead - rr.top) - y0) : 0;
    disp += (tgt - disp) * (disp < 200 && tgt > disp ? 0.07 : 0.12);
    if (Math.abs(tgt - disp) < 0.5) disp = tgt;
    const fy = y0 + disp;
    fill.style.height = disp + 'px';
    head.style.top = fy - 3 + 'px';
    let inZ = false;
    invs.forEach((z) => {
      const hh = Math.max(0, Math.min(z.h, fy - z.t));
      z.d.style.height = hh + 'px';
      if (fy > z.t && fy < z.t + z.h) inZ = true;
    });
    head.style.background = inZ ? '#0F0F0F' : RED;
    nodes.forEach((n) => {
      const onv = fy >= n.y;
      if (onv !== n.on) {
        n.on = onv;
        n.br.style.transform = onv ? 'scaleX(1)' : 'scaleX(0)';
        if (!n.v && !n.p) n.l.style.clipPath = onv ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)';
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
      const onv = fy >= fmY - 1;
      if (onv !== fmOn) {
        fmOn = onv;
        fmT.forEach(clearTimeout);
        fmT = [];
        if (onv) fmT.push(window.setTimeout(() => playFM(true), 380));
        else playFM(false);
      }
      head.style.opacity = onv ? '0' : '1';
    }
    if (disp !== tgt) req();
  };
  const req = () => {
    if (!raf) raf = requestAnimationFrame(upd);
  };
  on(window, 'scroll', req, { passive: true });
  on(window, 'resize', layout);
  layout();
  setTimeout(layout, 1200);
  if (document.fonts) document.fonts.ready.then(() => layout());
  [...root.querySelectorAll('img')].forEach((im) => {
    if (!(im as HTMLImageElement).complete) on(im, 'load', () => layout(), { once: true });
  });

  /* ---- Частицы «20» ---- */
  const px = document.querySelector<HTMLElement>('[data-parallax]');
  if (px && !reducedMotion) initParticles(px, hero);
}

/* ============================================================
   Частицы вокруг цифры «20»
   ============================================================ */
function initParticles(el: HTMLElement, host: HTMLElement) {
  const S = 4;
  const DEP = 110;
  const F = 1400;
  const R = 240;
  const COL = '#D4D7DC';
  const capEl = host.querySelector<HTMLElement>('[data-cap]');
  const cap = capEl
    ? {
        lines: [...capEl.querySelectorAll<HTMLElement>('[data-cap-line]')],
        plate: capEl.querySelector<HTMLElement>('[data-cap-plate]'),
      }
    : null;
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d')!;
  let P: {
    hx: number; hy: number; hz: number; sx: number; sy: number; ex: number; ey: number;
    dl: number; ax: number; ay: number; th: number; ox: number; oy: number;
    pull: number; spr: number; sz: number;
  }[] = [];
  let W = 0, H = 0, base = 1, dpr = 1, raf = 0, t0 = 0, alive = true;
  let ocx = 0, ocy = 0, GR = 400, lastP = -1;
  const NB = 8;
  let BX = new Float32Array(0), BY = new Float32Array(0), BS = new Float32Array(0), BB = new Uint8Array(0);
  const mouse = { x: -1e4, y: -1e4, nx: 0, ny: 0, sx: 0, sy: 0 };

  const build = () => {
    const r = el.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const w = Math.round(r.width);
    const pad = Math.round(fs * 0.25);
    const mw = w + pad * 2;
    const mh = Math.round(r.height) + pad * 2;
    W = Math.round(hr.width);
    H = Math.round(hr.height);
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none;z-index:4`;
    if (!cv.parentNode) host.appendChild(cv);
    const m = document.createElement('canvas');
    m.width = mw;
    m.height = mh;
    const mc = m.getContext('2d')!;
    mc.font = `${cs.fontWeight} ${fs}px Steelfish`;
    mc.fillStyle = mc.strokeStyle = '#000';
    mc.textBaseline = 'alphabetic';
    mc.lineWidth = fs * 0.04;
    mc.lineJoin = 'round';
    const met = mc.measureText('20');
    const asc = met.fontBoundingBoxAscent ?? fs * 0.8;
    const desc = met.fontBoundingBoxDescent ?? fs * 0.2;
    const ls = parseFloat(cs.letterSpacing) || 0;
    const chars = (el.firstChild?.textContent ?? '20').trim().split('');
    const gap = mc.lineWidth * 1.4;
    const adv = chars.map((c) => mc.measureText(c).width);
    const tot = adv.reduce((a, b) => a + b + ls, 0) + gap * (chars.length - 1);
    let x = pad + w - tot - mc.lineWidth / 2;
    const y = pad + (r.height - (asc + desc)) / 2 + asc;
    chars.forEach((c, i) => {
      mc.fillText(c, x, y);
      mc.strokeText(c, x, y);
      x += adv[i] + ls + gap;
    });
    if (!(mw > 0 && mh > 0)) return;
    const d = mc.getImageData(0, 0, mw, mh).data;
    const onv = (xx: number, yy: number) =>
      xx >= 0 && yy >= 0 && xx < mw && yy < mh && d[(yy * mw + xx) * 4 + 3] > 128;
    let x0 = mw, x1 = 0, y0 = mh, y1 = 0;
    for (let yy = 0; yy < mh; yy += 2)
      for (let xx = 0; xx < mw; xx += 2)
        if (onv(xx, yy)) {
          if (xx < x0) x0 = xx;
          if (xx > x1) x1 = xx;
          if (yy < y0) y0 = yy;
          if (yy > y1) y1 = yy;
        }
    const shiftY = Math.max(0, y1 - pad - r.height + fs * 0.02);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    ocx = r.left - hr.left - pad + cx;
    ocy = r.top - hr.top - pad + cy - shiftY + 40;
    base = hr.top + window.scrollY + ocy + (y1 - y0) / 2;
    GR = Math.max(x1 - x0, y1 - y0) * 0.85;
    P = [];
    // Источник частиц — заголовок h1
    const SRC: number[] = [];
    const h1 = host.querySelector('h1');
    if (h1) {
      const sm = document.createElement('canvas');
      sm.width = W;
      sm.height = H;
      const sc = sm.getContext('2d')!;
      sc.textBaseline = 'bottom';
      sc.fillStyle = '#000';
      const tw = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      const rg = document.createRange();
      let tn: Node | null;
      while ((tn = tw.nextNode())) {
        const st = getComputedStyle(tn.parentElement!);
        sc.font = `${st.fontWeight} ${st.fontSize} Steelfish`;
        try {
          (sc as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = 'ultra-condensed';
        } catch {
          /* fontStretch не поддерживается — не критично */
        }
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
          const asc2 = mm.fontBoundingBoxAscent ?? parseFloat(st.fontSize) * 0.8;
          const dsc2 = mm.fontBoundingBoxDescent ?? parseFloat(st.fontSize) * 0.2;
          const by = rc.top - hr.top + (rc.height - asc2 - dsc2) / 2 + asc2;
          sc.setTransform(sxk, 0, 0, 1, rc.left - hr.left, by);
          sc.textBaseline = 'alphabetic';
          sc.fillText(wd, 0, 0);
          sc.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
      if (W > 0 && H > 0) {
        const sd = sc.getImageData(0, 0, W, H).data;
        for (let yy = 0; yy < H; yy += 3)
          for (let xx = 0; xx < W; xx += 3) if (sd[(yy * W + xx) * 4 + 3] > 128) SRC.push(xx, yy);
      }
    }
    const ns = SRC.length / 2;
    const add = (x: number, y: number, z: number) => {
      const sx = ns ? SRC[(Math.random() * ns | 0) * 2] : Math.random() * W;
      const sy = ns ? SRC[((Math.random() * ns) | 0) * 2 + 1] : Math.random() * H;
      const j2 = ns ? ((Math.random() * ns) | 0) * 2 : 0;
      P.push({
        hx: x - cx, hy: y - cy, hz: z, sx, sy,
        ex: ns ? SRC[j2] : sx, ey: ns ? SRC[j2 + 1] : sy,
        dl: Math.random() * 0.9,
        ax: (Math.random() - 0.5) * 260, ay: -80 - Math.random() * 220,
        th: Math.random(), ox: 0, oy: 0,
        pull: 0.55 + Math.random() * 0.4, spr: 0.05 + Math.random() * 0.09,
        sz: 0.8 + Math.random() * 0.8,
      });
    };
    for (let yy = 0; yy < mh; yy += S)
      for (let xx = 0; xx < mw; xx += S) {
        const jx = (xx + ((Math.random() - 0.5) * S * 0.9) | 0);
        const jy = (yy + ((Math.random() - 0.5) * S * 0.9) | 0);
        if (!onv(jx, jy)) continue;
        const edge = !onv(jx - S, jy) || !onv(jx + S, jy) || !onv(jx, jy - S) || !onv(jx, jy + S);
        add(jx, jy, -DEP / 2);
        if (edge) for (let k = 1; k <= 5; k++) add(jx, jy, -DEP / 2 + (DEP * k) / 5);
        else if (Math.random() < 0.25) add(jx, jy, DEP / 2);
      }
    ctx.fillStyle = COL;
    if (!t0) t0 = performance.now();
    BX = new Float32Array(P.length);
    BY = new Float32Array(P.length);
    BS = new Float32Array(P.length);
    BB = new Uint8Array(P.length);
    wake();
  };

  const wake = () => {
    if (!raf && alive) raf = requestAnimationFrame(loop);
  };
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  const loop = (now: number) => {
    raf = 0;
    if (!alive || !P.length) return;
    const rb = cv.getBoundingClientRect();
    if (rb.bottom < 0 || rb.top > window.innerHeight) return;
    const p = Math.min(1, Math.max(0, window.scrollY / base));
    const T = (now - t0) / 1000;
    if (p >= 1 && lastP >= 1) return;
    const dsx = mouse.nx - mouse.sx;
    const dsy = mouse.ny - mouse.sy;
    mouse.sx += dsx * 0.06;
    mouse.sy += dsy * 0.06;
    const ry = -0.18 + mouse.sx * 0.2;
    const rx = 0.06 - mouse.sy * 0.1;
    const cl = cap ? cap.lines : [];
    for (let j = 0; j < cl.length; j++) {
      const ii = Math.min(1, Math.max(0, (T - 1.6 - j * 0.14) / 0.8));
      const ie = 1 - Math.pow(1 - ii, 4);
      const so = Math.min(1, Math.max(0, (p - j * 0.035) / 0.16));
      const se2 = so * so * (3 - 2 * so);
      cl[j].style.transform = `translateY(${((1 - ie) * 110 - se2 * 110).toFixed(2)}%)`;
    }
    if (cap?.plate) {
      const pi = Math.min(1, Math.max(0, (T - 2.2) / 0.55));
      const pe = 1 - Math.pow(1 - pi, 3);
      const ps = Math.min(1, Math.max(0, p / 0.09));
      cap.plate.style.clipPath = `inset(0 ${((1 - pe) * 100).toFixed(1)}% 0 ${(ps * 100).toFixed(1)}%)`;
    }
    let moving = T < 3.6 || p !== lastP || Math.abs(dsx) + Math.abs(dsy) > 0.002;
    lastP = p;
    const R2 = R * R;
    const iDep = 1 / (DEP * 2);
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
    const ox0 = ocx, oy0 = ocy;
    const mx = mouse.x - rb.left;
    const my = mouse.y - rb.top;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const ga = Math.min(1, T / 2.6) * (1 - p);
    if (ga > 0.01) {
      const gr = ctx.createRadialGradient(ocx, ocy, 0, ocx, ocy, GR);
      gr.addColorStop(0, `rgba(233,235,239,${0.085 * ga})`);
      gr.addColorStop(0.45, `rgba(233,235,239,${0.035 * ga})`);
      gr.addColorStop(1, 'rgba(233,235,239,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(ocx - GR, ocy - GR, GR * 2, GR * 2);
      ctx.fillStyle = COL;
    }
    for (let i = 0, n = P.length; i < n; i++) {
      const q = P[i];
      const st = p <= q.th * 0.45 ? 0 : Math.min(1, (p - q.th * 0.45) / 0.5);
      const se = st < 1 ? st * st * (3 - 2 * st) : 1;
      const it = T >= q.dl + 2 ? 1 : ease(Math.max(0, (T - q.dl) / 2));
      const a = (T < q.dl ? 0 : 1) * (1 - Math.max(0, se - 0.8) * 5);
      if (a <= 0.02) {
        BB[i] = 255;
        continue;
      }
      const x = q.hx, y = q.hy, z = q.hz;
      let x1 = x * cY - z * sY;
      let z1 = x * sY + z * cY;
      const y1 = y * cX - z1 * sX;
      z1 = y * sX + z1 * cX;
      const k = F / (F + z1);
      const hx2 = ox0 + x1 * k;
      const hy2 = oy0 + y1 * k;
      const ai = Math.sin(Math.PI * it);
      const as = Math.sin(Math.PI * se);
      let px2 = q.sx + (hx2 - q.sx) * it + q.ax * ai;
      let py2 = q.sy + (hy2 - q.sy) * it + q.ay * ai;
      if (se > 0) {
        px2 += (q.ex - px2) * se + q.ax * as;
        py2 += (q.ey - py2) * se + q.ay * as;
      }
      const dx = mx - px2, dy = my - py2;
      const d2 = dx * dx + dy * dy;
      let tx = 0, ty = 0;
      if (d2 < R2) {
        const u = 1 - Math.sqrt(d2) / R;
        const f = q.pull * u * Math.sqrt(u);
        tx = dx * f;
        ty = dy * f;
      }
      if (tx || ty || q.ox || q.oy) {
        const ex = tx - q.ox, ey = ty - q.oy;
        if (ex * ex + ey * ey < 0.01) {
          q.ox = tx;
          q.oy = ty;
        } else {
          q.ox += ex * q.spr;
          q.oy += ey * q.spr;
          moving = true;
        }
        px2 += q.ox;
        py2 += q.oy;
      }
      const l0 = Math.max(0.22, Math.min(1, 0.8 - z1 * iDep));
      const fr = se > 0 ? Math.min(it, 1 - se) : it;
      const light = l0 + (1 - l0) * (1 - fr) * (1 - fr);
      const s2 = q.sz * k;
      BX[i] = px2 - s2 / 2;
      BY[i] = py2 - s2 / 2;
      BS[i] = s2;
      BB[i] = Math.min(NB - 1, (a * light * NB) | 0);
    }
    for (let b = 0; b < NB; b++) {
      ctx.globalAlpha = (0.6 * (b + 0.5)) / NB;
      ctx.beginPath();
      for (let i = 0, n = P.length; i < n; i++)
        if (BB[i] === b) ctx.rect(BX[i], BY[i], BS[i], BS[i]);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (moving) wake();
  };

  const onMove = (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ny = (e.clientY / window.innerHeight - 0.5) * 2;
    wake();
  };
  const onLeave = () => {
    mouse.x = mouse.y = -1e4;
    wake();
  };
  on(window, 'mousemove', onMove as EventListener, { passive: true });
  on(document, 'mouseleave', onLeave);
  on(window, 'scroll', () => wake(), { passive: true });
  on(window, 'resize', build);
  (document.fonts ? document.fonts.load('800 100px Steelfish').then(() => document.fonts.ready) : Promise.resolve()).then(build);
}

/* ============================================================
   Анимация стрелок блока процесса
   ============================================================ */
function initArrows() {
  const sec = document.querySelector('#process');
  if (!sec) return;
  const seq: [HTMLElement, string, string, number][] = [];
  sec.querySelectorAll<HTMLElement>('[data-arw], [data-arw-a]').forEach((elx) => {
    if (elx.hasAttribute('data-arw')) seq.push([elx, 'inset(-6px 100% -6px 0)', 'inset(-6px -6px -6px 0)', 420]);
    else {
      seq.push([elx, 'inset(-6px 100% -6px 0)', 'inset(-6px -6px -6px 0)', 360]);
      const b = elx.parentElement?.querySelector<HTMLElement>('[data-arw-b]');
      if (b) seq.push([b, 'inset(-6px 0 -6px 100%)', 'inset(-6px -6px -6px -6px)', 360]);
    }
  });
  const c3 = sec.querySelector<HTMLElement>('[data-arw-c]');
  if (c3) seq.push([c3, 'inset(-6px 0 -20px 100%)', 'inset(-6px -6px -20px -6px)', 420]);
  if (!seq.length) return;
  seq.forEach(([el, from]) => (el.style.clipPath = from));
  const grid = seq[0][0].closest('[data-reveal]')?.parentElement ?? sec;
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
      requestAnimationFrame(() => (el.style.clipPath = to));
      t += d + 60;
    });
  };
  const chk = () => {
    const r = grid.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.75 && r.bottom > 0) run();
  };
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) run();
  }, { threshold: 0.35 });
  io.observe(grid);
  window.addEventListener('scroll', chk, { passive: true });
  window.addEventListener('resize', chk);
  chk();
}

/* ============================================================
   Старт
   ============================================================ */
function start() {
  initReveal();
  initLabelReveal();
  initCounters();
  initChips();
  initMenu();
  initForms();
  initFaq();
  initToTop();
  initHeaderFx();
  initArrows();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
