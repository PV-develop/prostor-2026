# Библиотека блоков

Блоки — `src/components/blocks/` (секции страницы), UI — `src/components/ui/` (мелкие повторяющиеся элементы).
Контент передаётся пропсами из `src/content/home.ts`; блоки не привязаны к одному контенту.

## UI-компоненты (`src/components/ui/`)

| Компонент | Назначение | Основные пропсы |
|---|---|---|
| `Container.astro` | боковые поля контента (48/20px) | `as`, `class` |
| `SectionLabel.astro` | метка «⣿ Название»; `variant: h \| v`; проявление классом `.in` (нить) | `text`, `variant` |
| `SectionHeading.astro` | заголовок Steelfish; размеры `hero/section/process/side/contacts/footer`; содержимое — slot (HTML — через `Fragment set:html`) | `as`, `size` |
| `Button.astro` | кнопка/ссылка с градиентной заливкой; `variant: red/paper-o/paper-red/red-ink/ink-o` | `variant`, `href`, `type`, `arrow` |
| `NumberedCard.astro` | атом нумерованной карточки (этапы, каналы, составляющие стоимости): крупный номер, заголовок, описание, нижняя зона с разделителем; стрелки-декорации — слотом `decor` | `num`, `title`, `description`, `meta`, `footerLabel`, `footerText`, `accent` |
| `NotePlate.astro` | плашка-выноска: тёмная подложка, белый текст, тонкая красная линия слева; `offset` — прижать вправо | `text`, `offset` |
| `TextField.astro` | input с плавающей подписью; `theme: dark (#1A1A1A) \| darker (#0F0F0F)` | `name`, `label`, `type`, `required` |
| `TextArea.astro` | textarea с плавающей подписью | `name`, `label`, `rows` |
| `FileField.astro` | прикрепление файла (имя подставляет main.ts) | `name`, `defaultLabel`, `hint`, `accept` |
| `SelectField.astro` | select с плавающей подписью (стилистика TextField); пустая скрытая опция = placeholder; состояния переключает main.ts | `name`, `label`, `options`, `theme`, `wide` |
| `ToggleGroup.astro` | группа радио-переключателей сегментами; выбор — CSS `:checked`, без JS; по умолчанию ничего не выбрано | `name`, `label`, `options` |
| `InfoRows.astro` | универсальные строки «термин → описание»: 2 колонки на desktop, стек на mobile; флаги `numbering` (красные номера), `arrows` (красная стрелка →), `divider` (вертикальная линия между колонками); hover усиливает номер/стрелку | `rows`, `termLabel`, `descriptionLabel`, `numbering`, `arrows`, `divider` |
| `CaseCard.astro` | карточка кейса: фото + grayscale-оверлей + счётчик | поля `CaseItem`, `index` |
| `TeamCard.astro` | карточка члена команды (фото 3/4, номер) | поля `TeamMember`, `index` |

## Блоки (`src/components/blocks/`)

| Блок | Назначение | Ключевые пропсы |
|---|---|---|
| `SiteHeader` | фиксированная шапка: лого (анимация букв при скролле), телефон, CTA, кнопка меню | `phone`, `ctaFull`, `ctaShort`, `ctaHref` (default `#contacts`; на внутренних — якорь их формы) |
| `MobileMenu` | раскрывающееся меню: разделы, группы услуг, соцсети; `data-open` — main.ts | `sections`, `services`, `socials`, `ctaHref`, `serviceLinkBase` ('/' на внутренних → `/#directions`), `activeService` (активная группа услуг), … |
| `HeroMain` | первый экран **главной**: H1, выносной лид, блок «20» (canvas-частицы), CTA, в slot — марка доверия. Внутренние страницы — `ServiceHero` | `sideLabel`, `titleLines`, `lead`, `capLines`, `ctaPrimary`, `ctaSecondary` |
| `ServiceHero` | первый экран **внутренней страницы направления**: тёмный фон, заголовок слева (контурные/красные фрагменты через HTML), описание справа, пара CTA, генеративная графика из пресета (`visualPreset`, реестр `src/scripts/visuals/presets`); mobile — вертикальный стек, графика отдельной областью, частиц меньше, курсор откл. | `eyebrow`, `title` (HTML), `description`, `additionalLabel`, `primaryCta`, `secondaryCta`, `visualPreset` |
| `TrustMarquee` | бегущая строка клиентов (CSS `marq`) | `label`, `items` |
| `AnchorNav` | якорная навигация под hero: `sticky` — прилипает под шапкой (токен `--header-h`), scroll-spy подсвечивает активный раздел красным (линия — не ниже `--anchor-scroll-offset`, чтобы раздел после клика сразу активировался), на mobile активный пункт автопрокручивается внутри списка (без скролла страницы); скрипт — в компоненте | `items: {label, href}[]`, `sticky`, `spy` |
| `ServiceList` | направления 01–06 (последний — акцентная красная строка) + чипы отраслей с фото-hover | поля `directions` |
| `ScenarioGrid` | сценарии «когда бизнесу нужна работа с …»: `layout: 'cards'` — сетка 2×2 (mobile стек); `layout: 'rows'` — редакционная композиция 35/65: слева маркер/заголовок/пояснение, справа нумерованные строки со стрелками и разделителями; карточки/строки некликабельны | `id`, `label`, `heading` (HTML), `intro`, `layout`, `cards`, `note`, `cta` |
| `ChannelsSection` | панель рекламных инструментов: карточки `NumberedCard` (01–05, нижняя зона «Задача канала»); desktop — в один ряд, ≤1100 — 3 колонки, ≤768 — вертикально; деликатный hover; без ссылок | `id`, `label`, `heading` (HTML), `items` (`title/description/purpose`), `purposeLabel`, `footnote` |
| `CasesSection` | тёмная секция кейсов, сетка 3 колонки; `allLink` не передан — кнопка архива не выводится | `label`, `title` (3 части: начало/обводка/окончание), `allLink?`, `items` |
| `ApproachSection` | редакционная таблица «что выясняем → какое решение» (InfoRows: номера, стрелки, вертикальная линия) + плашка-выноска NotePlate со смещением вправо | `id`, `label`, `heading` (HTML), `rows`, `termLabel`, `descriptionLabel`, `note` |
| `KpiSection` | таблица уровней метрик (InfoRows без флагов) + пояснение про аналитику | `id`, `label`, `heading` (HTML), `rows`, `termLabel`, `descriptionLabel`, `note` |
| `ProcessSection` | `variant: cards \| table` (default `cards`). cards — 5 карточек `NumberedCard` со стрелками (main.ts `initArrows` по `[data-process-arrows]`), ≤1024px — горизонтальный скролл; table — адаптивная таблица «этап / что делаем / что получаете», на mobile строки стекаются, без стрелок. Заголовок обоих вариантов — HTML | cards: `label`, `heading` (HTML), `intro`, `hint`, `steps`, `notes`; table: `label`, `heading`, `rows`, `columns`, `notes`; общие: `screenLabel` |
| `PricingSection` | три уровня: две равные карточки-составляющие (`NumberedCard`, метка `badge`, опциональный `accent`) + знак «+» + широкая область доп. работ (2 колонки, красные маркеры, разделители) + CTA (на всю ширину, стрелка из контента); без конкретных сумм | `id`, `label`, `heading` (HTML), `parts`, `extrasTitle`, `extras`, `plus`, `cta` |
| `FaqSection` | FAQ-аккордеон (кнопка + hidden-панель, aria, анимация по токенам; скрипт внутри компонента); пункты без `answer` — TODO-контент | `id`, `label`, `heading` (HTML), `items: {question, answer?}[]` |
| `CtaForm` | тёмная плашка с краткой формой (имя/телефон), mock-отправка | поля `ctaForm` |
| `TeamSection` | сетка TeamCard (авто-fit) | `label`, `title`, `members` |
| `ReviewsSection` | марка логотипов-заглушек + цитата | поля `reviews` |
| `ContactSection` | форма заявки + бриф + контакты; внутри — `ContactForm` | поля `contacts`, `form` |
| `ContactForm` | основная форма; набор полей — типизированным конфигом (default = набор главной: имя/почта/телефон/задача/файл). `config.required` — обязательные поля: блокируют отправку, состояние ошибки (красная рамка + текст), сбрасываются при вводе, фокус на первом ошибочном (main.ts). mock-отправка — прежний `data-form` | `title`, `titleAccent`, `note`, `submit(Label)`, `sent`, `policy`, `ariaLabel`, `fields` (подписи), `config: {name, contact: 'split'\|'single', email, phone, company, scenario, message, file, statusToggle, required}` |
| `SiteFooter` | контакты, колонки услуг/агентства, большая анимированная марка, нижняя панель | поля `footer` + `serviceLinkBase` ('/' на внутренних → `/#directions`) |

## Поведение из `src/scripts/main.ts`

`initMenu` (открытие, Escape/outside, якоря), `initReveal`, `initCounters`, `initChips` (фото при hover),
`initArrows` (стрелки процесса; секция с карточками помечена `[data-process-arrows]`; таймерный fallback на случай приостановленного в окружении rAF),
`initForms` (подписи input/textarea/select, файл, валидация `required`-полей, mock-отправка),
`initToTop`, `initThread` (красная нить, состояние шапки, анимация логотипа и марки футера),
`initParticles` («20» главной; без `[data-parallax]` — корректно пропускается).

## Генеративная графика (`src/scripts/visuals/`)

Движок hero внутренних страниц (`ServiceHero`): Canvas 2D без зависимостей — сборка частиц
из рассеяния в форму пресета, медленный дрейф, реакция на курсор (только `pointer: fine`),
пауза вне вьюпорта, бюджет частиц по устройству, `prefers-reduced-motion` — статичный кадр,
таймерная страховка при приостановленном rAF.

- `engine.ts` — жизненный цикл и отрисовка; `types.ts` — контракт пресета;
- `presets/registry.ts` — реестр имён; новый пресет направления — файл в `presets/`
  плюс строка в реестре, компоненты не меняются;
- `presets/network.ts` — `performance-network` (сеть рекламных каналов и потоков).

## Правила пополнения библиотеки

1. Новая страница собирается из существующих блоков и UI; новый блок — только если ничего не подходит.
2. Контент — в `src/content/*.ts`, не в разметке.
3. Скрытие ссылок на несозданные страницы — инлайн `style="display:none"` + комментарий `TODO:` в разметке и в контенте.
4. Стили блока — scoped, значения — из `design-tokens.css`.
5. Строковые паттерны не дублируются: ссылки-строки с заливкой — `ServiceList` (srow);
   «термин → описание» — `InfoRows`; нумерованные сценарии — `ScenarioGrid layout='rows'`;
   3-колоночная таблица этапов — `ProcessSection variant='table'`.
6. Одна нумерованная карточка — `NumberedCard` (потребители: `ProcessSection`, `ChannelsSection`, `PricingSection`);
   тёмная плашка-выноска — `NotePlate`; один hero на тип страницы — `HeroMain` (главная) / `ServiceHero` (внутренние).
