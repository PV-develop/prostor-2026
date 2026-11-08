# Библиотека блоков и компонентов

Структура:

- `src/components/ui/` — мелкие переиспользуемые элементы
- `src/components/blocks/` — секции страницы
- `src/components/layouts/` — шаблоны страниц
- Контент главной — `src/content/home.ts` (типизированные данные)

## UI-компоненты

| Компонент | Параметры | Назначение |
| --- | --- | --- |
| `Container.astro` | `as?` | обёртка с полями страницы |
| `SectionLabel.astro` | `text`, `variant: h\|v`, `tone: light\|dark`, `class?` | подпись секции с красным квадратом; `v` — вертикальная (раскрывается скролл-нитью), `h` — горизонтальная |
| `SectionHeading.astro` | `html`, `as?`, `size: xl\|lg\|md\|sm` | дисплейный заголовок Steelfish (HTML-строки поддерживают `<br>`, stroke-спаны) |
| `Button.astro` | `href`, `label`, `variant: fill-accent\|outline-light\|outline-dark\|fill-light-to-accent`, `arrow?`, `class?` | кнопка/ссылка с hover-свайпом |
| `TextField.astro` | `name`, `label`, `type?`, `placeholderOnFocus?`, `autocomplete?`, `tone: ink\|dark`, `required?`, `errorText?`, `class?` | поле с плавающей подписью (состояние `.is-filled` вешает `main.ts`); `required` — обязательное поле: валидация в `main.ts` (пустое значение блокирует отправку, `.is-error` + текст ошибки), ошибки сбрасываются при вводе |
| `TextArea.astro` | `name`, `label`, `rows?`, `class?` | многострочное поле |
| `FileField.astro` | `name?`, `label?`, `hint?`, `class?` | поле вложения с подписью выбранного файла |
| `SelectField.astro` | `name`, `label`, `options: string[]`, `placeholder?`, `class?` | стилизованный `<select>` для тёмных форм: подпись над полем, нейтральный пункт по умолчанию |
| `ToggleGroup.astro` | `name`, `legend`, `options: string[]`, `class?` | группа радио-пилюль (2–3 опции) для тёмных форм; выбранная опция — акцентная заливка, значение уходит с формой |
| `CaseCard.astro` | `photo`, `photoAlt`, `tag`, `industry`, `value`, `suffix`, `metric`, `title`, `description`, `href?` | карточка кейса: счётчик `data-count`, hover-съём серой вуали |
| `TeamCard.astro` | `photo`, `name`, `role`, `since?`, `num` | карточка члена команды |

## Блоки

| Блок | Данные | Примечания |
| --- | --- | --- |
| `SiteHeader` | `contacts` | фиксированная шапка: телефон, CTA, кнопка меню; состояние скролла и морф логотипа — `main.ts` (`data-hdr`, `data-hconn`, `data-hsp`) |
| `MobileMenu` | `contacts`, `menuNav`, `menuNavExtra`, `menuServiceGroups`, `activeSection?: 'services'` | выпадающая панель; пункты без страниц скрыты `hidden` + TODO (разметка сохранена); `activeSection` помечает блок «Услуги» как текущий (`aria-current`) |
| `HeroMain` | `variant?: 'home'\|'page'`, `showMarquee?`, `hero?` | герой: шум, вертикальная подпись, заголовок, лид, подписи «20», CTA; включает `TrustMarquee`; частицы/параллакс — `main.ts`. `variant: 'page'` — внутренняя страница: заголовок/лид/note/CTA через `hero`, без «20», marquee отключается `showMarquee={false}` |
| `TrustMarquee` | `trustMarquee` | бегущая строка «Нам доверяют» |
| `ServiceList` | `services`, `industries` | заголовок, 6 строк направлений (06 — featured), отраслевые чипы с фото-подложкой по hover |
| `CasesSection` | `label?`, `titleHtml?`, `items?`, `showAllLink?` | сетка `CaseCard`; по умолчанию — контент главной, `showAllLink: false` скрывает «Все кейсы» (для страниц без архива) |
| `ProcessSection` | `variant?: 'cards'\|'table'`, `heading?`, `label?`, `lead?`, `steps?`, `notes?` | 5 карточек этапов (`cards`, по умолчанию — главная; на ≤1024 — горизонтальный скролл-снап, стрелки анимирует `main.ts`); `table` — адаптивная таблица «этап/что делаем/что получаете», на mobile строка стекается в карточку, стрелки не анимируются |
| `AnchorNav` | `items: {label, href}[]` | компактная тёмная якорная навигация, визуально связанная с hero; на mobile — скролл-снап без видимого скроллбара; только внутристраничные якоря |
| `ScenarioGrid` | `id?`, `label?`, `heading` (HTML), `intro?`, `cards: {title, description}[]`, `note?`, `cta?` | нумерованные карточки сценариев 2×2 desktop / стек mobile и интегрированная тёмная панель с пояснением и CTA; карточки некликабельны |
| `ChannelsSection` | `id?`, `label?`, `heading` (HTML), `items: {title, description}[]`, `footnote?` | нумерованная система направлений с отдельной колонкой индекса и разделителями; на mobile описание остаётся в колонке названия; без ссылок (разметка под будущие страницы услуг сохранена с TODO) |
| `ApproachSection` | `id?`, `label?`, `heading` (HTML), `rows: {question, decision}[]`, `note?` | матрица «что выясняем → какое решение» с усиленной первой колонкой и итоговым выводом; строки — приватный компонент `TwoColRows` |
| `KpiSection` | `id?`, `label?`, `heading` (HTML), `rows: {level, metrics}[]`, `note?` | тёмная секция с четырьмя нумерованными уровнями метрик и пояснением; раскладка — `TwoColRows` в варианте `levels` |
| `TwoColRows` | `rows`, `headLeft`, `headRight`, `mobileLeftLabel?`, `mobileRightLabel?`, `variant?: 'matrix'\|'levels'`, `tone?: 'light'\|'dark'` | приватный паттерн для `ApproachSection`/`KpiSection`: двухколоночная матрица или самостоятельные уровни метрик (не использовать напрямую на страницах) |
| `PricingSection` | `id?`, `label?`, `heading` (HTML), `parts: {title, description}[]`, `extrasTitle?`, `extras: string[]`, `cta?` | две равнозначные нумерованные карточки бюджета, панель дополнительных работ и интегрированный CTA; без конкретных цен |
| `FaqSection` | `id?`, `label?`, `heading` (HTML), `items: {question, answer?}[]` | FAQ-аккордеон на чистом TS (`main.ts`, `data-faq-*`, aria-атрибуты); пункт без ответа — TODO-заглушка; секцию публиковать только когда ответы готовы |
| `CtaForm` | `titleHtml?`, `lead?`, `submitLabel?`, `stacked?`, слот `form` | тёмная панель с формой (mock-отправка); по умолчанию — контент главной; слот `form` заменяет встроенную форму (внутренние страницы), `stacked` — заголовок строкой сверху, форма на всю ширину ниже |
| `TeamSection` | `team` | сетка `TeamCard` |
| `ReviewsSection` | `reviews` | marquee логотипов-заглушек + цитата; живёт внутри тёмной обёртки вместе с командой |
| `ContactSection` | `contacts` | форма + бриф-карточка + контакты; внутри тёмной обёртки вместе с футером |
| `ContactForm` | `title?`, `lead?`, `submitLabel?`, `fields?`, `messageLabel?`, `requiredFields?`, `showHead?` | сама форма заявки (используется в `ContactSection` и `CtaForm`); `fields` — типизированный набор полей (`name`, `contact: 'split'\|'single'`, `email`, `phone`, `company`, `scenario: {enabled, options}`, `message`, `file`, `statusToggle: {enabled, options}`); по умолчанию — набор главной; `requiredFields` включает валидацию имени и контакта |
| `SiteFooter` | `contacts`, `footer` | футер с колонками ссылок; незаполненные `href: null` рендерятся как `<span>` с TODO; кнопка «Наверх», анимированная марка логотипа |

## Шаблоны

- `BaseLayout.astro` — `title`, `description`, `pageUrl?`; lang=ru, OG/Twitter,
  preload критических шрифтов, favicon, подключение `src/scripts/main.ts`, noscript-фолбэки.

## Пример сборки страницы

```astro
<BaseLayout title="…" description="…">
  <SiteHeader />
  <MobileMenu />
  <main>
    <HeroMain />
    <ServiceList />
    …
  </main>
</BaseLayout>
```

Тёмные секции (команда+отзывы, контакты+футер) объединяются обёрткой
`<div class="dark-section">` (определена в `src/pages/index.astro`).

## Правила пополнения

1. Новая страница собирается из существующих блоков; новый блок — только если
   существующие не подходят, и сразу сюда в документацию.
2. Контент — в `src/content/`, не в разметке.
3. Пункты навигации на ещё не созданные страницы скрываем (`hidden`/не рендерим),
   разметку сохраняем с комментарием TODO и возвращаем при появлении страницы.
4. Каждый блок проверяем на 1440px и 375px: нет горизонтального скролла,
   нет ошибок консоли, ресурсы локальные.
