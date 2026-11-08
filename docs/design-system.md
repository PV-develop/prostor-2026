# Дизайн-система «Простор»

Единый источник значений — `src/styles/design-tokens.css` (CSS Custom Properties).
`src/styles/global.css` содержит базовые стили и общие классы, построенные только на токенах.

## Принципы

1. **Никакого хардкода в компонентах.** Цвета, отступы, шрифты, длительности и z-index — только через `var(--...)`.
2. **Значение повторилось дважды — станет токеном.** Уникальное значение блока — токен с осмысленным префиксом (например, `--fs-case-number`).
3. **Breakpoints** — `1100px` (упрощение меню), `1024px` (скролл этапов), `768px` (мобильная вёрстка). В media query пишутся значением, не через `var()`.
4. **Без CSS-фреймворков.** Astro-scoped стили компонентов + общие классы.

## Палитра

| Токен | Значение | Назначение |
|---|---|---|
| `--color-ink` | `#0F0F0F` | тёмные секции, текст на светлом |
| `--color-paper` | `#E9EBEF` | светлый фон, текст на тёмном |
| `--color-red` / `--color-red-dark` | `#FA001E` / `#BD0000` | акцент и второй стоп градиентов |
| `--color-card-dark` / `--color-card-light` | `#1A1A1A` / `#F4F5F7` | карточки на тёмном/светлом |
| `--color-card-hover` | `#FFFFFF` | hover светлой карточки (каналы, стоимость) |
| `--line-paper-*`, `--line-ink-*` | rgba | линии/рамки с альфой |
| `--paper-*`, `--ink-*` | rgba | текст с альфой |

## Типографика

- **Steelfish** (`--font-display`, 700/800, font-stretch 25%) — заголовки и крупные числа: шкала `--fs-*` от `--fs-hero` (clamp 84–168px) до `--fs-team-name`; заголовок `ServiceHero` — `--fs-shero-title` (clamp 56–118px).
- **Onest** (`--font-sans`, 400–600) — текст: `--fs-body` 15px, `--fs-lead` 20px, `--fs-note` 13px.
- **JetBrains Mono** (`--font-mono`) — кнопки, метки, телефоны, номера.
- Класс `.h-display` задаёт семейство/регистр; модификаторы `--hero/--section/--process/--side/--contacts/--footer` — размер и интерлиньяж.
- `.h-stroke` — контурный текст (`-webkit-text-stroke`, `color: transparent`).

Все шрифты лежат в `public/fonts/`, критические — с `preload` в `BaseLayout.astro`.

## Сетка и отступы

- Боковые поля контента: `--pad-page` 48px → `--pad-page-mobile` 20px (класс `.container` и медиа-правила блоков).
- Основная сетка секций: `minmax(72px,168px) minmax(0,3fr) minmax(0,2fr) 56px` (токен `--grid-content`), 12-колоночная сетка hero — `--cols-main`/`--gap-grid`.
- Вертикальные ритмы: `--section-pad-y` 140px, `--section-gap` 96px, `--row-padding` 36px.
- Каркас внутренней страницы: `--header-h` (92/68px) — sticky-точка in-page меню под шапкой;
  `--anchor-scroll-offset` (164/128px) — scroll-margin целей якорей и линия активного раздела;
  `--shero-visual-h` (280/240px) — область генеративной графики hero на mobile.

## Кнопки

Базовый класс `.btn` + вариант заливки (`--red`, `--paper-o`, `--paper-red`, `--red-ink`, `--ink-o`).
Эффект — сдвиг `background-position` двухцветного градиента 201% (без перерисовки layout).
Тот же приём у `.row-link` (строки услуг) и чипов отраслей.

## Анимации

- Easing: `--ease-strong` (.7,0,.2,1), `--ease-smooth` (.2,.7,.2,1), `--ease-slide`, `--ease-bounce`.
- Длительности: `--dur-sweep` 550ms (заливки), `--dur-color` 350ms, `--dur-reveal` 1s.
- Всё на `transform`/`opacity`/`clip-path`/`background-position`; при `prefers-reduced-motion` длительности обнуляются, reveal и marque показываются сразу.

## z-index

`--z-thread` 6 (красная нить) < `--z-content` 3…5 < `--z-header` 50 < `--z-menu` 60.

## Состояния

- Focus: `:focus-visible` — обводка 2px `--color-red` (на тёмном — `--color-paper`).
- Hover: у всех интерактивных элементов описан в стилях блока.
- Disabled: `.btn[disabled] { opacity: .6; pointer-events: none; }`.
