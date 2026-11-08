/**
 * Контент главной страницы «Простор».
 * Единственный источник текстов; блоки остаются переиспользуемыми.
 */

export interface NavLink { label: string; href: string; num?: string }
export interface ServiceGroup { title: string; items: string[] }
export interface SocialLink { label: string; href: string; icon: 'telegram' | 'whatsapp' | 'vk' | 'youtube' | 'dzen' }
export interface Direction {
  num: string;
  title: string;
  titleAccent?: string;
  description: string;
  tags?: string;
  badge?: string;
  highlight?: boolean;
  ctaText?: string;
}
export interface Industry { label: string; chip?: string }
export interface CaseItem {
  image: string;
  imageAlt: string;
  tag: string;
  meta: string;
  value: number;
  valueSuffix: string;
  valueLabel: string;
  title: string;
  description: string;
}
export interface ProcessStep {
  num: string;
  duration?: string;
  title: string;
  description: string;
  resultLabel: string;
  result: string;
  accent?: boolean;
  arrow?: 'straight' | 'corner' | 'return' | 'none';
}
export interface TeamMember {
  photo: string;
  name: string;
  role: string;
  since?: string;
  number: string;
}
export interface FooterColumnLink { label: string; href: string; strong?: boolean }

export const site = {
  name: 'Простор',
  phoneMain: { label: '8 800 555-50-70', href: 'tel:88005555070' },
  phoneSpb: { label: '8 812 640-07-09', href: 'tel:88126400709' },
  email: 'ork@prosto-r.ru',
  address: '197183, Санкт-Петербург,<br>Липовая аллея, 9, БЦ «Приморский»',
};

export const header = {
  phone: '8 800 555-50-70',
  ctaFull: 'Обсудить задачу',
  ctaShort: 'Обсудить',
};

/** Меню: разделы с якорями на существующие секции главной. */
export const menu = {
  sections: [
    { num: '01', label: 'Направления', href: '#directions' },
    { num: '02', label: 'Кейсы и отрасли', href: '#cases' },
    { num: '03', label: 'Процесс и команда', href: '#process' },
    { num: '04', label: 'Отзывы', href: '#reviews' },
    { num: '05', label: 'Контакты', href: '#contacts' },
  ] as NavLink[],
  // Страницы ещё не созданы — пункты скрыты с сохранением разметки (TODO: вернуть после создания страниц)
  hiddenSections: [
    { label: 'Цены', href: '#' },
    { label: 'О компании', href: '#' },
    { label: 'Блог', href: '#' },
  ] as NavLink[],
  services: [
    {
      title: 'Продвижение',
      items: ['Контекстная реклама', 'SEO-продвижение', 'AI-оптимизация', 'Реклама ВКонтакте', 'Реклама в Telegram', 'Продвижение на Авито'],
    },
    {
      title: 'Разработка',
      items: ['Разработка сайтов', 'Разработка', 'Создание лендингов', 'Корпоративный сайт на ИИ-платформе'],
    },
    {
      title: 'Репутация и геосервисы',
      items: ['Управление репутацией', 'Геомаркетинг', 'Ведение и оформление Яндекс Бизнес'],
    },
    {
      title: 'Стратегия и поддержка',
      items: ['Стратегия Digital-маркетинга', 'Техническая поддержка'],
    },
  ] as ServiceGroup[],
  // TODO: страницы цен нет — выпадающий список цен скрыт вместе с разделом
  prices: {
    title: 'Цены',
    items: ['SEO-продвижение ↗', 'Контекстная реклама ↗', 'Разработка сайтов ↗'],
  },
  // TODO: страницы «О компании» и «Блога» нет — крупные ссылки скрыты
  bigLinks: [
    { label: 'О компании', href: '#' },
    { label: 'Блог', href: '#' },
  ] as NavLink[],
  socials: [
    { label: 'Telegram', href: 'https://telegram.me/agency_prostor', icon: 'telegram' },
    { label: 'WhatsApp', href: 'https://wa.me/79118270369', icon: 'whatsapp' },
    { label: 'ВКонтакте', href: 'https://vk.com/prostor_24', icon: 'vk' },
    { label: 'YouTube', href: 'https://www.youtube.com/@ProstorDigitalAgency/videos', icon: 'youtube' },
    { label: 'Дзен', href: 'https://dzen.ru/prostor_digital_agency', icon: 'dzen' },
  ] as SocialLink[],
  cta: 'Обсудить задачу',
};

export const hero = {
  sideLabel: 'Digital-маркетинг с 2006 года · Простор',
  titleLines: ['Разгоняем', 'маркетинг,', 'вникаем в бизнес.'],
  lead: 'Объединяем стратегию, продвижение, разработку и аналитику в единую систему, чтобы привлекать целевые обращения, повышать конверсию и понимать, какие вложения приносят результат',
  capLines: ['Лет в чужом бизнесе', 'как в своём'],
  ctaPrimary: { label: 'Обсудить задачу', href: '#contacts' },
  ctaSecondary: { label: 'Кейсы', href: '#cases' },
};

export const trust = {
  label: 'Нам доверяют',
  items: ['Клиент один', 'Застройщик', 'Сеть клиник', 'Отели Сочи', 'Электротехника', 'Юридическая группа', 'Девелопер', 'Интернет-магазин'],
};

export const directions = {
  label: '02 — Направления',
  title: ['С какой задачей', 'требуется помощь?'],
  intro: 'Нужно усилить отдельное направление? Выстроить маркетинг с нуля? Начнём с задачи вашего бизнеса.',
  items: [
    {
      num: '01',
      title: 'Performance-маркетинг',
      description: 'Привлекать целевые обращения с помощью рекламы и управлять стоимостью привлечения',
      tags: 'Контекст · Таргет · Авито',
    },
    {
      num: '02',
      title: 'SEO-продвижение',
      description: 'Развивать видимость сайта в поиске и привлекать тех, кто уже ищет ваши товары и услуги',
      tags: 'Яндекс · Google · Зарубеж',
    },
    {
      num: '03',
      title: 'AI-продвижение',
      description: 'Повышать видимость компании и сайта в ответах нейросетей и ИИ-поиске',
      tags: 'GEO / AEO · Нейросети',
      badge: 'NEW',
    },
    {
      num: '04',
      title: 'Управление репутацией',
      description: 'Работать с отзывами и информацией о компании, которые влияют на доверие и выбор клиента',
      tags: 'SERM · ORM · Аудит',
    },
    {
      num: '05',
      title: 'Разработка и дизайн',
      description: 'Создать или улучшить сайт на любой CMS: структура, дизайн, функциональность и удобство',
      tags: 'Сайты · UX/UI · Поддержка',
    },
    {
      num: '06',
      title: 'Комплексный маркетинг',
      titleAccent: 'Комплексный',
      description: 'Если нужно связать несколько направлений, соберём общий план: цели, каналы привлечения, задачи по сайту, аналитику и зоны ответственности. Определим, что запускать сначала и по каким показателям оценивать результат.',
      ctaText: 'Обсудить комплексный маркетинг',
      badge: 'Всё вместе',
      highlight: true,
    },
  ] as Direction[],
  industriesTitle: 'Решаем задачи для',
  industries: [
    { label: 'Недвижимости', chip: '/images/chips/photo-1560518883-ce09059eeffa.jpg' },
    { label: 'Строительства', chip: '/images/chips/photo-1504307651254-35680f356dfd.jpg' },
    { label: 'Девелопмента', chip: '/images/chips/photo-1486406146926-c627a92ad1ab.jpg' },
    { label: 'Медицины', chip: '/images/chips/photo-1519494026892-80bbd2d6fd0d.jpg' },
    { label: 'Интернет-магазинов', chip: '/images/chips/photo-1441986300917-64674bd600d8.jpg' },
    { label: 'B2B', chip: '/images/chips/photo-1497366216548-37526070297c.jpg' },
  ] as Industry[],
  industriesLabel: 'Отраслевые решения',
  industriesNote: 'Здесь самые популярные направления. Работаем и с другими отраслями — расскажите о своей.',
  industriesCta: { label: 'Подобрать отраслевое решение', href: '#contacts' },
};

export const cases = {
  label: '03 — Кейсы',
  // Три части заголовка: начало / строка с обводкой / окончание
  title: ['Задачи бизнеса,', 'которые уже', ' решили'] as [string, string, string],
  // TODO: страницы кейсов нет — кнопка «Все кейсы» скрыта с сохранением разметки
  allLink: { label: 'Все кейсы', href: '#' },
  items: [
    {
      image: '/images/cases/case-1.webp',
      imageAlt: 'Здание юридической компании',
      tag: 'PERFORMANCE',
      meta: 'B2B · Юристы',
      value: 400,
      valueSuffix: '%',
      valueLabel: 'Обращений за 6 месяцев',
      title: 'Юридическая компания',
      description: 'С 40 до 200 обращений в месяц: новая семантика, посадочные, коллтрекинг и CRM',
    },
    {
      image: '/images/cases/case-2.webp',
      imageAlt: 'Современное офисное здание интернет-магазина',
      tag: 'SEO + таргет',
      meta: 'E-commerce',
      value: 110,
      valueSuffix: '%',
      valueLabel: 'Органики за 12 месяцев',
      title: 'Магазин электротехники',
      description: 'Снизили зависимость от платной рекламы: техническое SEO, структура каталога, +18% в корзину',
    },
    {
      image: '/images/cases/case-3.webp',
      imageAlt: 'Отели Сочи у моря',
      tag: 'Комплекс',
      meta: 'Гостиницы',
      value: 56,
      valueSuffix: '%',
      valueLabel: 'Бронирований за сезон',
      title: 'Сеть отелей в Сочи',
      description: 'Прямые бронирования без агрегаторов: геосервисы, SEO и отзывы одной командой',
    },
  ] as CaseItem[],
};

export const process = {
  label: '04 — Процесс',
  heading: 'Как мы<br />выстраиваем <span class="h-stroke">работу</span>',
  intro: 'Пять этапов — от диагностики до масштабирования. На каждом вы заранее знаете, что делаем, сколько это занимает и что получаете в итоге.',
  hint: '5 этапов · листайте',
  steps: [
    {
      num: '01', duration: '1–2 недели', title: 'Разбираем ситуацию',
      description: 'Аудит текущего продвижения, сайта, воронки, аналитики и конкурентов',
      resultLabel: 'Вы получаете', result: 'Карта ограничений и точек роста', arrow: 'straight',
    },
    {
      num: '02', duration: '1 неделя', title: 'Формируем приоритеты',
      description: 'Определяем задачи, точки роста, гипотезы и ожидаемый эффект',
      resultLabel: 'Вы получаете', result: 'План с очерёдностью и прогнозом', arrow: 'straight',
    },
    {
      num: '03', duration: '2–4 недели', title: 'Запускаем работу',
      description: 'Реализуем выбранные направления: performance, SEO, AI, репутация, сайт',
      resultLabel: 'Вы получаете', result: 'Работающие каналы и ответственные', arrow: 'corner',
    },
    {
      num: '04', duration: 'Каждый месяц', title: 'Измеряем и корректируем',
      description: 'Отслеживаем показатели, проверяем гипотезы, пересматриваем план',
      resultLabel: 'Вы получаете', result: 'Отчёт и обновлённый план', arrow: 'return',
    },
    {
      num: '05', duration: 'Постоянно', title: 'Масштабируем то, что работает',
      description: 'Усиливаем эффективные каналы и решения',
      resultLabel: 'Вы получаете', result: 'Рост на проверенных каналах', arrow: 'none', accent: true,
    },
  ] as ProcessStep[],
  notes: ['Первые каналы запускаем через 4–7 недель', 'Отчёт и обновлённый план — ежемесячно'],
};

export const ctaForm = {
  title: ['Хотите понять,', 'с чего начать', 'в вашем случае?'],
  note: 'Оставьте контакты — свяжемся в течение часа и проконсультируем по вашему вопросу.',
  fields: { name: 'Имя', phone: 'Телефон' },
  submit: 'Обсудить задачу',
};

export const team = {
  label: '05 — Команда',
  title: ['Кто ведёт', 'ваш проект'],
  // TODO: страницы команды нет — кнопка «Вся команда» скрыта с сохранением разметки
  allLink: { label: 'Вся команда', href: '#' },
  members: [
    { photo: '/images/team/i_chugaevsky.webp', name: 'Илья Чугаевский', role: 'Founder', since: 'С 2006', number: '01' },
    { photo: '/images/team/a_spiridonov.webp', name: 'Андрей Спиридонов', role: 'Founder', number: '02' },
    { photo: '/images/team/n_osipov.webp', name: 'Никита Осипов', role: 'COO', number: '03' },
    { photo: '/images/team/s_kozhurkin.webp', name: 'Сергей Кожуркин', role: 'CIO', number: '04' },
  ] as TeamMember[],
};

export const reviews = {
  label: 'Отзывы',
  logoMarquee: ['Логотип 01', 'Логотип 02', 'Логотип 03', 'Логотип 04', 'Логотип 05', 'Логотип 06', 'Логотип 07', 'Логотип 08'],
  quoteMark: '«',
  quote: 'Первый подрядчик, у которого отчёт сходится с нашей CRM. Перестали спорить про цифры и начали говорить про продажи.',
  quoteAccent: 'про продажи.',
  author: 'Имя Фамилия<br>Коммерческий директор, застройщик',
  // TODO: страницы отзывов нет — ссылка «Все отзывы» скрыта с сохранением разметки
  allLink: { label: 'Все отзывы', href: '#' },
};

export const contactForm = {
  title: 'Оставьте заявку, чтобы обсудить проект',
  titleAccent: 'обсудить проект',
  note: 'Свяжемся в течение часа и проконсультируем по вашему вопросу.',
  fields: { name: 'Имя', email: 'Почта', phone: 'Телефон', message: 'Опишите задачу' },
  fileDefault: 'Приложить бриф или документ',
  fileHint: 'PDF, DOC, XLS, PPT — до 20 МБ',
  submit: 'Отправить заявку',
  sent: 'Заявка отправлена',
  policy: 'Отправляя заявку, вы соглашаетесь с <a href="#">политикой обработки персональных данных</a>',
};

export const contacts = {
  label: 'Контакты',
  briefTitle: 'Или сразу заполните бриф из 5 вопросов',
  briefNote: 'Чем раньше мы поймём задачу, тем точнее подготовим предложение.',
  // TODO: страницы брифа нет — кнопка скрыта с сохранением разметки
  briefCta: { label: 'Заполнить бриф', href: '#' },
  channels: [
    { label: '8 800 555-50-70', href: 'tel:88005555070', note: 'Бесплатно по России' },
    { label: '8 812 640-07-09', href: 'tel:88126400709', note: 'Санкт-Петербург, Липовая аллея, 9' },
    { label: 'ork@prosto-r.ru', href: 'mailto:ork@prosto-r.ru', note: 'Почта для заявок' },
  ],
  messengersLabel: 'Написать в мессенджер',
  messengers: [
    { label: 'Telegram', href: 'https://telegram.me/agency_prostor' },
    { label: 'WhatsApp', href: 'https://wa.me/79118270369' },
  ],
};

export const footer = {
  title: ['Остались вопросы?', 'Свяжитесь с нами'],
  actions: [
    { label: 'Обсудить проект', href: '#contacts' },
    { label: 'Присоединиться к команде', href: '#' },
    { label: 'Стать партнёром', href: '#' },
  ],
  servicesTitle: 'Услуги',
  serviceGroups: [
    {
      title: 'Performance-маркетинг',
      links: ['Контекстная реклама', 'Таргетированная реклама', 'Реклама в Промостраницах', 'Продвижение на Авито', 'Продвижение в ГЕО-сервисах'],
    },
    {
      title: 'SEO-продвижение',
      links: ['Продвижение в Яндекс', 'Продвижение в Google', 'Зарубежное SEO', 'SEO при редизайне и переезде', 'Бесплатный SEO-аудит'],
    },
    {
      title: 'AI-оптимизация',
      links: ['Продвижение в нейросетях', 'GEO / AEO продвижение', 'Аудит видимости в ИИ-поиске'],
    },
    {
      title: 'Управление репутацией',
      links: ['SERM', 'ORM', 'Репутационный аудит'],
    },
    {
      title: 'Разработка и дизайн',
      links: ['Разработка сайтов', 'Системы управления', 'Дизайн сайтов', 'Техническая поддержка'],
    },
  ],
  agencyTitle: 'Агентство',
  agencyLinks: ['О компании', 'Преимущества', 'Награды и сертификаты', 'Команда', 'Отзывы', 'Партнёрам', 'Вакансии', 'Новости', 'Блог'],
  industriesTitle: 'Отраслевые решения',
  industryLinks: ['Недвижимость', 'Строительство', 'Девелопмент', 'Медицина', 'Интернет-магазины', 'B2B'],
  bigLinks: [
    { label: 'Кейсы', href: '#cases' },
    { label: 'Контакты', href: '#contacts' },
  ],
  // TODO: страницы цен и FAQ нет — скрыты с сохранением разметки
  bigLinksHidden: [{ label: 'Цены', href: '#' }, { label: 'FAQ', href: '#' }],
  copyright: '© 2006–2026 Простор',
  legal: ['Политика обработки персональных данных', 'Согласие на обработку данных', 'Политика cookies', 'Карта сайта'],
  toTop: 'Наверх',
};
