/**
 * Контент главной страницы «Простор».
 * Блоки получают данные только отсюда или через пропсы.
 */

export interface NavLink {
  num: string;
  label: string;
  href: string | null;
}

export interface ServiceGroup {
  title: string;
  items: string[];
}

export interface ServiceRow {
  num: string;
  title: string;
  description: string;
  channels: string;
  badge?: string;
}

export interface CaseItem {
  photo: string;
  photoAlt: string;
  tag: string;
  industry: string;
  value: number;
  suffix: string;
  metric: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  num: string;
  duration: string;
  title: string;
  description: string;
  result: string;
  accent?: boolean;
}

export interface TeamMember {
  photo: string;
  name: string;
  role: string;
  since?: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: { label: string; href: string | null }[];
}

export const contacts = {
  phone800: '8 800 555-50-70',
  phone800Href: 'tel:88005555070',
  phone812: '8 812 640-07-09',
  phone812Href: 'tel:88126400709',
  email: 'ork@prosto-r.ru',
  emailHref: 'mailto:ork@prosto-r.ru',
  address: '197183, Санкт-Петербург,\nЛиповая аллея, 9, БЦ «Приморский»',
  socials: [
    { label: 'Telegram', href: 'https://telegram.me/agency_prostor' },
    { label: 'WhatsApp', href: 'https://wa.me/79118270369' },
    { label: 'ВКонтакте', href: 'https://vk.com/prostor_24' },
    { label: 'YouTube', href: 'https://www.youtube.com/@ProstorDigitalAgency/videos' },
    { label: 'Дзен', href: 'https://dzen.ru/prostor_digital_agency' },
  ],
};

export const menuNav: NavLink[] = [
  { num: '01', label: 'Направления', href: '#directions' },
  { num: '02', label: 'Кейсы и отрасли', href: '#cases' },
  { num: '03', label: 'Процесс и команда', href: '#process' },
  { num: '04', label: 'Отзывы', href: '#reviews' },
  { num: '05', label: 'Контакты', href: '#contacts' },
];

/* TODO: показывать в меню, когда появятся страницы */
export const menuNavExtra: NavLink[] = [
  { num: '', label: 'Цены', href: null },
  { num: '', label: 'О компании', href: null },
  { num: '', label: 'Блог', href: null },
];

export const menuServiceGroups: ServiceGroup[] = [
  {
    title: 'Продвижение',
    items: [
      'Контекстная реклама',
      'SEO-продвижение',
      'AI-оптимизация',
      'Реклама ВКонтакте',
      'Реклама в Telegram',
      'Продвижение на Авито',
    ],
  },
  {
    title: 'Разработка',
    items: [
      'Разработка сайтов',
      'Разработка',
      'Создание лендингов',
      'Корпоративный сайт на ИИ-платформе',
    ],
  },
  {
    title: 'Репутация и геосервисы',
    items: [
      'Управление репутацией',
      'Геомаркетинг',
      'Ведение и оформление Яндекс Бизнес',
    ],
  },
  {
    title: 'Стратегия и поддержка',
    items: ['Стратегия Digital-маркетинга', 'Техническая поддержка'],
  },
];

export const hero = {
  verticalLabel: 'Digital-маркетинг с 2006 года · Простор',
  titleTop: 'Разгоняем',
  titleAccent: 'вникаем',
  titleBottom: 'в бизнес',
  lead: 'Объединяем стратегию, продвижение, разработку и аналитику в единую систему, чтобы привлекать целевые обращения, повышать конверсию и понимать, какие вложения приносят результат',
  captionLines: ['Лет в чужом бизнесе', 'как в своём'],
  number: 20,
  ctaPrimary: { label: 'Обсудить задачу', href: '#contacts' },
  ctaSecondary: { label: 'Кейсы', href: '#cases' },
};

export const trustMarquee = [
  'Клиент один',
  'Застройщик',
  'Сеть клиник',
  'Отели Сочи',
  'Электротехника',
  'Юридическая группа',
  'Девелопер',
  'Интернет-магазин',
];

export const services = {
  label: '02 — Направления',
  titleLines: ['С какой задачей', 'требуется помощь?'],
  lead: 'Нужно усилить отдельное направление? Выстроить маркетинг с нуля? Начнём с задачи вашего бизнеса.',
  rows: [
    {
      num: '01',
      title: 'Performance-маркетинг',
      description: 'Привлекать целевые обращения с помощью рекламы и управлять стоимостью привлечения',
      channels: 'Контекст · Таргет · Авито',
    },
    {
      num: '02',
      title: 'SEO-продвижение',
      description: 'Развивать видимость сайта в поиске и привлекать тех, кто уже ищет ваши товары и услуги',
      channels: 'Яндекс · Google · Зарубеж',
    },
    {
      num: '03',
      title: 'AI-продвижение',
      badge: 'NEW',
      description: 'Повышать видимость компании и сайта в ответах нейросетей и ИИ-поиске',
      channels: 'GEO / AEO · Нейросети',
    },
    {
      num: '04',
      title: 'Управление репутацией',
      description: 'Работать с отзывами и информацией о компании, которые влияют на доверие и выбор клиента',
      channels: 'SERM · ORM · Аудит',
    },
    {
      num: '05',
      title: 'Разработка и дизайн',
      description: 'Создать или улучшить сайт на любой CMS: структура, дизайн, функциональность и удобство',
      channels: 'Сайты · UX/UI · Поддержка',
    },
    {
      num: '06',
      title: 'Комплексный маркетинг',
      badge: 'Всё вместе',
      description:
        'Если нужно связать несколько направлений, соберём общий план: цели, каналы привлечения, задачи по сайту, аналитику и зоны ответственности. Определим, что запускать сначала и по каким показателям оценивать результат.',
      channels: 'Обсудить комплексный маркетинг',
      featured: true,
    },
  ] as (ServiceRow & { featured?: boolean })[],
};

export const industries = {
  label: 'Отраслевые решения',
  headingAccent: 'Решаем задачи для',
  items: [
    { label: 'Недвижимости', photo: '/images/chips/photo-1560518883-ce09059eeffa.jpg' },
    { label: 'Строительства', photo: '/images/chips/photo-1504307651254-35680f356dfd.jpg' },
    { label: 'Девелопмента', photo: '/images/chips/photo-1486406146926-c627a92ad1ab.jpg' },
    { label: 'Медицины', photo: '/images/chips/photo-1519494026892-80bbd2d6fd0d.jpg' },
    { label: 'Интернет-магазинов', photo: '/images/chips/photo-1441986300917-64674bd600d8.jpg' },
    { label: 'B2B', photo: '/images/chips/photo-1497366216548-37526070297c.jpg' },
  ],
  note: 'Здесь самые популярные направления. Работаем и с другими отраслями — расскажите о своей.',
  cta: 'Подобрать отраслевое решение',
};

export const cases = {
  label: '03 — Кейсы',
  titleLines: ['Задачи бизнеса,', 'которые уже решили'],
  items: [
    {
      photo: '/images/cases/case-1.webp',
      photoAlt: 'Юридическая компания',
      tag: 'PERFORMANCE',
      industry: 'B2B · Юристы',
      value: 400,
      suffix: '%',
      metric: 'Обращений за 6 месяцев',
      title: 'Юридическая компания',
      description: 'С 40 до 200 обращений в месяц: новая семантика, посадочные, коллтрекинг и CRM',
    },
    {
      photo: '/images/cases/case-2.webp',
      photoAlt: 'Интернет-магазин электротехники',
      tag: 'SEO + таргет',
      industry: 'E-commerce',
      value: 110,
      suffix: '%',
      metric: 'Органики за 12 месяцев',
      title: 'Магазин электротехники',
      description: 'Снизили зависимость от платной рекламы: техническое SEO, структура каталога, +18% в корзину',
    },
    {
      photo: '/images/cases/case-3.webp',
      photoAlt: 'Сеть отелей в Сочи',
      tag: 'Комплекс',
      industry: 'Гостиницы',
      value: 56,
      suffix: '%',
      metric: 'Бронирований за сезон',
      title: 'Сеть отелей в Сочи',
      description: 'Прямые бронирования без агрегаторов: геосервисы, SEO и отзывы одной командой',
    },
  ] as CaseItem[],
};

export const process = {
  label: '04 — Процесс',
  titleLines: ['Как мы', 'выстраиваем работу'],
  lead: 'Пять этапов — от диагностики до масштабирования. На каждом вы заранее знаете, что делаем, сколько это занимает и что получаете в итоге.',
  steps: [
    {
      num: '01',
      duration: '1–2 недели',
      title: 'Разбираем ситуацию',
      description: 'Аудит текущего продвижения, сайта, воронки, аналитики и конкурентов',
      result: 'Карта ограничений и точек роста',
    },
    {
      num: '02',
      duration: '1 неделя',
      title: 'Формируем приоритеты',
      description: 'Определяем задачи, точки роста, гипотезы и ожидаемый эффект',
      result: 'План с очерёдностью и прогнозом',
    },
    {
      num: '03',
      duration: '2–4 недели',
      title: 'Запускаем работу',
      description: 'Реализуем выбранные направления: performance, SEO, AI, репутация, сайт',
      result: 'Работающие каналы и ответственные',
    },
    {
      num: '04',
      duration: 'Каждый месяц',
      title: 'Измеряем и корректируем',
      description: 'Отслеживаем показатели, проверяем гипотезы, пересматриваем план',
      result: 'Отчёт и обновлённый план',
    },
    {
      num: '05',
      duration: 'Постоянно',
      title: 'Масштабируем то, что работает',
      description: 'Усиливаем эффективные каналы и решения',
      result: 'Рост на проверенных каналах',
      accent: true,
    },
  ] as ProcessStep[],
  notes: ['Первые каналы запускаем через 4–7 недель', 'Отчёт и обновлённый план — ежемесячно'],
};

export const ctaForm = {
  titleLines: ['Хотите понять,', 'с чего начать', 'в вашем случае?'],
  lead: 'Оставьте контакты — свяжемся в течение часа и проконсультируем по вашему вопросу.',
  submit: 'Обсудить задачу',
};

export const team = {
  label: '05 — Команда',
  titleLines: ['Кто ведёт', 'ваш проект'],
  members: [
    { photo: '/images/team/i_chugaevsky.webp', name: 'Илья Чугаевский', role: 'Founder', since: 'С 2006' },
    { photo: '/images/team/a_spiridonov.webp', name: 'Андрей Спиридонов', role: 'Founder' },
    { photo: '/images/team/n_osipov.webp', name: 'Никита Осипов', role: 'COO' },
    { photo: '/images/team/s_kozhurkin.webp', name: 'Сергей Кожуркин', role: 'CIO' },
  ] as TeamMember[],
};

export const reviews = {
  logos: ['Логотип 01', 'Логотип 02', 'Логотип 03', 'Логотип 04', 'Логотип 05', 'Логотип 06', 'Логотип 07', 'Логотип 08'],
  quote:
    'Первый подрядчик, у которого отчёт сходится с нашей CRM. Перестали спорить про цифры и начали говорить про продажи.',
  author: 'Имя Фамилия',
  authorRole: 'Коммерческий директор, застройщик',
};

export const footer = {
  titleLines: ['Остались вопросы?', 'Свяжитесь с нами'],
  actions: [
    { label: 'Обсудить проект', href: '#contacts' },
    /* TODO: страницы пока нет — временно скрыто
    { label: 'Присоединиться к команде', href: null },
    { label: 'Стать партнёром', href: null },
    */
  ],
  servicesTitle: 'Услуги',
  serviceGroups: [
    {
      heading: 'Performance-маркетинг',
      links: [
        { label: 'Performance-маркетинг', href: null },
        { label: 'Контекстная реклама', href: null },
        { label: 'Таргетированная реклама', href: null },
        { label: 'Реклама в Промостраницах', href: null },
        { label: 'Продвижение на Авито', href: null },
        { label: 'Продвижение в ГЕО-сервисах', href: null },
      ],
    },
    {
      heading: 'SEO-продвижение',
      links: [
        { label: 'SEO-продвижение', href: null },
        { label: 'Продвижение в Яндекс', href: null },
        { label: 'Продвижение в Google', href: null },
        { label: 'Зарубежное SEO', href: null },
        { label: 'SEO при редизайне и переезде', href: null },
        { label: 'Бесплатный SEO-аудит', href: null },
      ],
    },
    {
      heading: 'AI-оптимизация',
      links: [
        { label: 'AI-оптимизация', href: null },
        { label: 'Продвижение в нейросетях', href: null },
        { label: 'GEO / AEO продвижение', href: null },
        { label: 'Аудит видимости в ИИ-поиске', href: null },
      ],
    },
    {
      heading: 'Управление репутацией',
      links: [
        { label: 'Управление репутацией', href: null },
        { label: 'SERM', href: null },
        { label: 'ORM', href: null },
        { label: 'Репутационный аудит', href: null },
      ],
    },
    {
      heading: 'Разработка и дизайн',
      links: [
        { label: 'Разработка и дизайн', href: null },
        { label: 'Разработка сайтов', href: null },
        { label: 'Системы управления', href: null },
        { label: 'Дизайн сайтов', href: null },
        { label: 'Техническая поддержка', href: null },
      ],
    },
  ] as FooterLinkGroup[],
  agencyTitle: 'Агентство',
  agencyLinks: [
    { label: 'О компании', href: null },
    { label: 'Преимущества', href: null },
    { label: 'Награды и сертификаты', href: null },
    { label: 'Команда', href: '#reviews' },
    { label: 'Отзывы', href: '#reviews' },
    { label: 'Партнёрам', href: null },
    { label: 'Вакансии', href: null },
    { label: 'Новости', href: null },
    { label: 'Блог', href: null },
  ],
  solutionsTitle: 'Отраслевые решения',
  solutionsLinks: [
    { label: 'Недвижимость', href: null },
    { label: 'Строительство', href: null },
    { label: 'Девелопмент', href: null },
    { label: 'Медицина', href: null },
    { label: 'Интернет-магазины', href: null },
    { label: 'B2B', href: null },
  ],
  quickLinks: [
    { label: 'Кейсы', href: '#cases' },
    { label: 'Цены', href: null },
    { label: 'Контакты', href: '#contacts' },
    { label: 'FAQ', href: null },
  ],
  legal: [
    { label: 'Политика обработки персональных данных', href: null },
    { label: 'Согласие на обработку данных', href: null },
    { label: 'Политика cookies', href: null },
    { label: 'Карта сайта', href: null },
  ],
  copyright: '© 2006–2026 Простор',
};
