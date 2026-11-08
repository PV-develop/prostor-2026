# Дизайн-система «Простор»

Единый источник значений — `src/styles/design-tokens.css`. В компонентах запрещены
хардкодные цвета, отступы, размеры шрифтов и breakpoints: только `var(--...)`.
Если значение используется дважды и более — оно обязано быть токеном. Уникальное
значение блока выносится в токен этого блока в `design-tokens.css`.

## Принципы

- Токены описывают **намерение** (`--color-text-accent`, `--space-page`), а не внешний вид.
- Базовая палитра + семантические алиасы: компоненты используют семантические токены.
- Типографика — только три семейства: Onest (текст), JetBrains Mono (кнопки/подписи),
  Steelfish (дисплейный набор, `font-stretch: 25%`).
- Анимации — в основном `transform` и `opacity`; всё уважает `prefers-reduced-motion`.
- Стили блоков — scoped-стили Astro-компонентов на токенах; общие паттерны — в `global.css`.

## Цвета

| Токен | Значение | Назначение |
| --- | --- | --- |
| `--color-black` | `#0F0F0F` | тёмный фон, основной текст на светлом |
| `--color-ink` | `#1A1A1A` | карточки кейсов, панели форм (CTA) |
| `--color-white` | `#E9EBEF` | светлый фон, основной текст на тёмном |
| `--color-accent` | `#FA001E` | красный акцент |
| `--color-accent-dark` | `#BD0000` | тёмно-красный (градиенты кнопок) |
| `--color-gray-100/200/300/500` | `#F4F5F7` `#D6D8DC` `#D4D7DC` `#9A9CA1` | карточки процесса, фото-заглушки, частицы, стрелки |

Семантика: `--color-bg-page`, `--color-bg-dark`, `--color-bg-card-dark`,
`--color-bg-card-light`, `--color-text-primary(-inverse)`, `--color-text-accent(-dark)`,
линии `--color-line-dark/light(-soft)`, `--color-line-accent`.

Полупрозрачные тексты собраны группами `--color-text-on-dark-*` и `--color-text-on-light-*`
(значение суффикса = альфа в процентах). Градиенты hover-свайпов — `--fill-*`.

## Типографика

Шкала (токены `--fs-*`, интервалы `--lh-*`, `--ls-*`):

- `--fs-hero-title` clamp(84px,11.7vw,168px)/.88 — заголовок героя
- `--fs-hero-number` clamp(220px,30vw,440px)/.72 — цифра «20»
- `--fs-h2` clamp(64px,8.3vw,120px)/.9; `--fs-h2-md` — процесс
- `--fs-h3` clamp(40px,5vw,72px); `--fs-h3-sm`; `--fs-h4`; `--fs-h5`
- `--fs-case-num` clamp(96px,11vw,170px)/.78 — цифры кейсов
- `--fs-service-title`, `--fs-industry`, `--fs-quote`, `--fs-menu-item`, `--fs-phone`
- Текст: `--fs-lead` (18), `--fs-lead-section` (20), `--fs-body` (16), `--fs-body-sm` (15),
  `--fs-body-xs` (14), `--fs-label` (13), `--fs-tag` (12), `--fs-btn` (12 mono uppercase)

Кнопки и mono-подписи: `--ls-btn` .14em / `--ls-btn-md` .12em / `--ls-btn-sm` .1em.

## Сетка и отступы

- Поля страницы: `--space-page` 48px → 20px на мобильном
- Колонки героя/секций: 12-колоночная сетка `--grid-12`, gutter `--space-col-gap` 24px
- Боковая колонка подписей/номеров: `--col-side` minmax(72px,168px)
- Шкала отступов `--space-xs…--space-8xl` (8–96), вертикали секций
  `--space-section-y` 140px / `--space-section-b` 160px
- Для плотных внутренних страниц: `--space-section-page-y` 112px,
  `--space-section-page-y-mobile` 72px, карточки — `--space-page-card`;
  нумерованные колонки — `--page-index-col` / `--page-index-col-mobile`
- Breakpoints: 1100 / 1024 / 768 (только в медиазапросах; `--bp-*` — справочно)

## Анимации

- Длительности: `--dur-instant` .2s … `--dur-swipe` .55s … `--dur-reveal` 1s
- easing: `--ease-out` cubic-bezier(.2,.7,.2,1), `--ease-swipe` (.7,0,.2,1),
  `--ease-io` (.6,0,.2,1), `--ease-arrow` (.6,0,.3,1)
- z-index: `--z-noise` 1, `--z-thread` 6, `--z-hero-content` 3,
  `--z-header` 50, `--z-menu` 60

## Состояния

- Фокус: `--focus-outline` 2px solid accent (глобально `:focus-visible`)
- Hover-кнопки: паттерн `.btn-fill` — свайп заливки через `--fill-*` градиенты
- `prefers-reduced-motion`: глобально обнуляет анимации, reveal/подписи/цифра
  показываются без JS-эффектов (см. `global.css`)

## Правила

1. Новый цвет/отступ/размер → сначала токен в `design-tokens.css`.
2. Классы, проброшенные дочерним Astro-компонентам, стилизуются через `:global(...)`.
3. Не подключать внешние шрифты/CDN: всё локально в `public/`.
4. Изображения — lazy loading, кроме критических; шрифты — `font-display: swap` + preload.
