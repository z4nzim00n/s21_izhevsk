(() => {
  'use strict';

  const keys = {
    people: 's21-izhevsk.people.v1',
    pending: 's21-izhevsk.people.pending.v1',
    pageSize: 's21-izhevsk.pageSize',
    theme: 's21-izhevsk.theme',
  };
  const supabaseUrl = window.S21_SUPABASE?.url?.trim() || '';
  const supabaseKey = window.S21_SUPABASE?.key?.trim() || '';
  const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
  const supabaseClient = supabaseConfigured && window.supabase
    ? window.supabase.createClient(supabaseUrl, supabaseKey)
    : null;
  const pageSizes = [10, 20, 50];
  const nickPattern = /^[a-z][a-z0-9_-]{1,23}$/i;
  const telegramPattern = /^[a-z][a-z0-9_]{4,31}$/i;
  const tokenPattern = /^[0-9a-f]{32}$/;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const warnings = [];
  if (supabaseConfigured && !window.supabase) warnings.push('Не загрузился Supabase. Анкеты сохранятся только в этом браузере.');
  const directions = {
    backend: 'Backend',
    frontend: 'Frontend',
    mobile: 'Мобильная разработка',
    gamedev: 'GameDev',
    devops: 'DevOps',
    data: 'Data Science',
    ai: 'ИИ-инженер',
    security: 'Кибербезопасность',
    qa: 'QA',
    analytics: 'Системный и бизнес-анализ',
    uxui: 'UX/UI',
    pm: 'Проджект-менеджмент',
    bioinf: 'Биоинформатика',
  };
  const interestLabels = {
    games: 'Игры',
    esports: 'Киберспорт',
    boardgames: 'Настольные игры',
    chess: 'Шахматы',
    films: 'Фильмы',
    series: 'Сериалы',
    anime: 'Аниме',
    manga: 'Манга',
    cosplay: 'Косплей',
    music: 'Музыка',
    musicmaking: 'Создание музыки',
    podcasts: 'Подкасты',
    books: 'Книги',
    art: 'Рисование',
    photography: 'Фотография',
    dance: 'Танцы',
    creativity: 'Творчество',
    languages: 'Иностранные языки',
    speaking: 'Публичные выступления',
    science: 'Наука',
    technology: 'Технологии',
    pc: 'Сборка ПК',
    electronics: 'Электроника',
    robotics: 'Робототехника',
    printing3d: '3D-печать',
    linux: 'Linux',
    ai: 'Нейросети',
    sport: 'Спорт',
    gym: 'Тренажёрный зал',
    running: 'Бег',
    swimming: 'Плавание',
    football: 'Футбол',
    tennis: 'Теннис',
    martialarts: 'Единоборства',
    cycling: 'Велосипеды',
    hiking: 'Походы',
    travel: 'Путешествия',
    cars: 'Автомобили',
    cooking: 'Кулинария',
    pets: 'Питомцы',
    investing: 'Инвестиции',
    startups: 'Стартапы',
  };
  const clubs = [
    { id: 'english', name: 'Английский клуб', interests: ['languages'], description: 'Разговорная практика для тех, кто учит английский.', organizers: [{ name: 'Катя', nick: 'rosalchi', telegram: 'Kate_hunterr' }] },
    { id: 'tennis', name: 'Теннисный клуб', interests: ['tennis', 'sport'], description: 'Теннис и активный отдых после учёбы.', organizersSoon: true },
    { id: 'speaking', name: 'Клуб публичных выступлений', interests: ['speaking'], description: 'Практика публичных выступлений и работы с голосом.', organizers: [{ name: 'Екатерина Анисимова', role: 'ADM IZH' }] },
    { id: 'gamers', name: 'Неофициальный клуб геймеров', interests: [], description: '', chatUrl: 'https://t.me/+UdbduQwFgAU4ZTZi' },
  ];
  const resourceGroups = [
    { id: 'practice', title: 'Тренажёры и практика' },
    { id: 'school', title: 'Школа и кампус' },
    { id: 'calls', title: 'Переговорки' },
    { id: 'knowledge', title: 'Базы знаний' },
    { id: 'tools', title: 'Инструменты и карта' },
  ];
  const resources = [
    { id: 'c-trainer', group: 'practice', title: 'Тренажёр по C', description: 'Сборник задач для практики перед экзаменом.', url: 'https://github.com/z4nzim00n/Exam_trainer' },
    { id: 'sql-trainer', group: 'practice', title: 'SQL-тренажёр', description: 'Задания по SQL с проверкой запросов.', url: 'https://z4nzim00n.github.io/SQL_trainer/' },
    { id: 'sql-theory', group: 'practice', title: 'SQL-тест к экзамену', description: 'Теоретические тесты для подготовки к экзамену по SQL.', url: 'https://z4nzim00n.github.io/sql_theory_trainer/' },
    { id: 'platform', group: 'school', title: 'Платформа Школы 21', description: 'Основной сайт школы: проекты, проверки и прогресс.', url: 'https://platform.21-school.ru/' },
    { id: 'deadlines', group: 'school', title: 'Дедлайны обучения', description: 'Сроки и этапы обучения на портале абитуриента.', url: 'https://applicant.21-school.ru/education/education' },
    { id: 'campus-qr', group: 'school', title: 'QR-код кампуса', description: 'QR-код кампуса Ижевска на портале абитуриента.', url: 'https://applicant.21-school.ru/campus-qr-code' },
    { id: 'rocketchat', group: 'school', title: 'Rocket.Chat', description: 'Основной рабочий чат Школы 21: каналы кампуса и проектов.', url: 'https://rocketchat-student.21-school.ru/home' },
    { id: 'salutejazz', group: 'calls', title: 'SaluteJazz', description: 'Видеопереговоры для сдачи заданий и проверок.', url: 'https://salutejazz.ru/' },
    { id: 'izh-knowledge', group: 'knowledge', title: 'Хранилище знаний Ижевска', description: 'Общий документ кампуса: заметки и материалы по учёбе.', url: 'https://docs.yandex.ru/edit/d/GDBAOOKz1vtQPndD9p8_7iPegnqahzm72s0qoIz-cKg6VENfa3QyRUNTZw?from_public=1' },
    { id: 'knowledge-base-nsk', group: 'knowledge', title: 'База знаний (Новосибирск)', description: 'Полезное по веткам, чаты проектов, поиск команды и ответы на вопросы по заданиям.', url: 'https://git.21-school.ru/gehnaeli/knowledge-base-nsk/-/tree/master' },
    { id: 'emap', group: 'tools', title: 'Интерактивная карта', description: 'Карта Школы 21 без скрытых узлов и ограничений: путь к цели и проекты, которые откроются после неё.', url: 'https://emap.tamelaos.fun/' },
    { id: 'linux-cheatsheet', group: 'tools', title: 'Шпаргалка по Linux', description: 'Команды Linux коротко: файлы, права, процессы и сеть.', url: 'https://github.com/justxor/Linux-/' },
    { id: 'starter-pack', group: 'tools', title: 'Настройка терминала разработчика', description: 'Руководство по настройке терминала для работы из дома: WSL и SSH.', url: 'https://github.com/z4nzim00n/S21-Starter-Pack' },
  ];
  const chatGroups = [
    { id: 'campus', title: 'Кампус Ижевск' },
    { id: 'dev', title: 'Разработка' },
    { id: 'branches', title: 'Ветки' },
    { id: 'other', title: 'Другие направления' },
    { id: 'bots', title: 'Боты' },
    { id: 'archive', title: 'Архив' },
  ];
  const chats = [
    { id: 'izh-backend', group: 'campus', title: 'Backend Ижевск', description: 'Чат направления Backend в Ижевске.', url: 'https://t.me/+JYuUe1n0cwkwYmUy' },
    { id: 'izh-qa', group: 'campus', title: 'QA Ижевск', description: 'Чат направления QA в Ижевске.', url: 'https://t.me/+2Bnrzy64xRk0Mzky' },
    { id: 'izh-devops', group: 'campus', title: 'DevOps Ижевск', description: 'Чат направления DevOps в Ижевске.', url: 'https://t.me/+IMXkLAMMwcoxZjRi' },
    { id: 'izh-ds', group: 'campus', title: 'Data Science Ижевск', description: 'Чат направления Data Science в Ижевске.', url: 'https://t.me/ds_school21_izhevsk' },
    { id: 'simplebashutils', group: 'dev', title: 'SimpleBashUtils', url: 'https://t.me/+C8pCQLUsSvNkNzcy' },
    { id: 's21-string', group: 'dev', title: 's21_string+', url: 'https://t.me/+LQpPWconGXViMzA6' },
    { id: 's21-decimal', group: 'dev', title: 's21_decimal', url: 'https://t.me/+KvtB8PKDB2xlM2Qy' },
    { id: 's21-matrix', group: 'dev', title: 's21_matrix / s21_matrix+', url: 'https://t.me/S21_matrix' },
    { id: 'brickgame', group: 'dev', title: 'BrickGame', tag: 'все части', url: 'https://t.me/+3YyNoe6dMDM3OGQy' },
    { id: 'devops-project', group: 'dev', title: 'DevOps', url: 'https://t.me/+MPogbcEDJ-JhZWE6' },
    { id: 'cpp', group: 'dev', title: 'C++', url: 'https://t.me/+wqh8GgT1dClmNmJi' },
    { id: 'sql', group: 'dev', title: 'SQL', url: 'https://t.me/+t1CH7q-bZNcxY2Qy' },
    { id: 'sber-java', group: 'dev', title: 'Sber_Java', url: 'https://t.me/+gUdaLC_tadNmYjJi' },
    { id: 'algo-branches', group: 'branches', title: 'Алгоритмические ветки', tag: 'общий чат', description: 'Общий чат алгоритмических веток.', url: 'https://t.me/+KgbLy4KXsVxiYTIy' },
    { id: 'lang-branches', group: 'branches', title: 'Языковые ветки', tag: 'общий чат', description: 'Java, Python, Kotlin, Go, C#.', url: 'https://t.me/+0QNpBkJDKQNhZjAy' },
    { id: 'ai-agent', group: 'other', title: 'AI Agent', url: 'https://t.me/+zFa1Humn1X9iNTZi' },
    { id: 'cbs-branch', group: 'other', title: 'Кибербезопасность / CbS', tag: 'чат ветки', url: 'https://t.me/+a85WycvCrtxiNjYy' },
    { id: 'cbs-club', group: 'other', title: 'Клуб кибербеза', tag: 'чат клуба', url: 'https://t.me/+r5wufz8L3mUzOGUy' },
    { id: 'backend', group: 'other', title: 'Backend', url: 'https://t.me/+3arMZbxPqtgxNWZi' },
    { id: 'ml-ds', group: 'other', title: 'ML / DS', url: 'https://t.me/+mAUDhBpSrvo0YzIy' },
    { id: 'bsa', group: 'other', title: 'BSA', url: 'https://t.me/+lUffgOle5M8yMTgy' },
    { id: 's21-math', group: 'other', title: 's21_math', url: 'https://t.me/+PYp_Z2nGW_FjYmJi' },
    { id: '3dviewer', group: 'other', title: '3DViewer', url: 'https://t.me/+D2sccrQhVL5hOWYy' },
    { id: 'qa', group: 'other', title: 'QA', url: 'https://t.me/+NVATSadWEcc1Njcy' },
    { id: 'pm', group: 'other', title: 'Project Manager', tag: 'межкампусный', description: 'Общий чат проджектов, не только Ижевск.', url: 'https://t.me/+yPBq8rDpXy02MmU6' },
    { id: 'product', group: 'other', title: 'Product Manager', url: 'https://t.me/+_16VEmzJtFQ0N2Zi' },
    { id: 'bioinf', group: 'other', title: 'Биоинформатика', url: 'https://t.me/+uvUmkuHuyAhhZGFi' },
    { id: 'uxui', group: 'other', title: 'UX / UI', url: 'https://t.me/+1NkIFYy7tiM2YmFi' },
    { id: 'morty-bot', group: 'bots', title: 'MortyS21bot', tag: 'поиск и верификация', description: 'Поиск пиров по нику, Telegram username или ID, верификация в чатах, статистика активности и база проверенных пользователей.', url: 'https://t.me/MortyS21bot' },
    { id: 'login-bot', group: 'bots', title: 'login_school21_bot', tag: 'поиск пиров', description: 'Бот для поиска пиров по нику в Telegram и школьному нику.', url: 'https://t.me/login_school21_bot' },
    { id: 'noem-bot', group: 'bots', title: 'NoemX21_bot', tag: 'бот-помощник', description: 'Переговорки, книги, клубы, личная статистика, PRR helper и управление группами.', url: 'https://t.me/NoemX21_bot' },
    { id: 'smartcalc', group: 'archive', title: 'SmartCalc', tag: 'архив', description: 'Проект больше недоступен для выполнения.', url: 'https://t.me/+kVtODVcII0k2MjU6' },
  ];

  function validText(value, max) {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
  }

  function safeUrl(value) {
    if (!validText(value, 500)) return null;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
    } catch {
      return null;
    }
  }

  function loadRecords(key, validate) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return [];
      const records = JSON.parse(raw);
      if (!Array.isArray(records) || !records.every(item => item && typeof item === 'object' && validate(item))) {
        throw new Error('Invalid stored records');
      }
      return records;
    } catch {
      warnings.push('Не удалось прочитать локальные данные. Возможно, хранилище недоступно или повреждено.');
      return [];
    }
  }

  function validInterests(value) {
    return Array.isArray(value) && value.length <= Object.keys(interestLabels).length && value.every(id => typeof id === 'string' && Object.hasOwn(interestLabels, id)) && new Set(value).size === value.length;
  }

  function validDirection(value) {
    return value === undefined || value === '' || (typeof value === 'string' && Object.hasOwn(directions, value));
  }

  function validPersonRecord(item) {
    return Boolean(item) && typeof item === 'object' && validText(item.id, 64) && typeof item.nick === 'string' && nickPattern.test(item.nick) && validText(item.name, 50) && typeof item.telegram === 'string' && telegramPattern.test(item.telegram) && validDirection(item.direction) && (item.bio === undefined || (typeof item.bio === 'string' && item.bio.length <= 600)) && (item.interests === undefined || validInterests(item.interests)) && (item.token === undefined || item.token === '' || tokenPattern.test(item.token));
  }

  let people = loadRecords(keys.people, validPersonRecord)
    .map(({ id, nick, name, telegram, bio = '', interests = [], direction = '' }) => ({ id, nick, name, telegram, bio, interests, direction }));
  let pendingPeople = loadRecords(keys.pending, validPersonRecord)
    .map(({ id, nick, name, telegram, bio = '', interests = [], direction = '', token = '', status }) => ({ id, nick, name, telegram, bio, interests, direction, token, status: status === 'rejected' ? 'rejected' : 'pending' }));
  let remotePeople = [];
  let editingId = null;
  let editingToken = null;
  let profileId = null;
  let pendingDelete = null;
  let currentPage = 1;
  let pageSize = loadPageSize();
  let toastTimer;

  function loadPageSize() {
    try {
      const value = Number(localStorage.getItem(keys.pageSize));
      return pageSizes.includes(value) ? value : 10;
    } catch {
      return 10;
    }
  }

  function hideToast(toast) {
    if (typeof toast.hidePopover === 'function' && toast.matches(':popover-open')) toast.hidePopover();
    toast.hidden = true;
  }

  function showToast(message, error = false) {
    clearTimeout(toastTimer);
    const toast = $('#toast');
    $('span', toast).textContent = message;
    $('use', toast).setAttribute('href', error ? '#i-info' : '#i-check');
    toast.classList.toggle('is-error', error);
    toast.hidden = false;
    if (typeof toast.showPopover === 'function') {
      if (!toast.matches(':popover-open')) toast.showPopover();
    }
    toastTimer = setTimeout(() => hideToast(toast), error ? 9000 : 4200);
  }

  function setError(id, message = '') {
    const element = $(id);
    element.textContent = message;
    element.hidden = !message;
  }

  function persist(key, records, errorId) {
    try {
      localStorage.setItem(key, JSON.stringify(records));
      return true;
    } catch {
      setError(errorId, 'Не удалось сохранить данные. Проверь, разрешено ли браузеру хранить данные сайта и есть ли свободное место.');
      return false;
    }
  }

  function withTimeout(promise, ms = 15000) {
    let timer;
    return Promise.race([
      promise,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), ms); }),
    ]).finally(() => clearTimeout(timer));
  }

  function legacyCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
    document.body.append(area);
    area.select();
    area.setSelectionRange(0, text.length);
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    area.remove();
    return copied;
  }

  async function copyText(text, message) {
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }
    if (!copied) copied = legacyCopy(text);
    showToast(copied ? message : 'Не удалось скопировать: браузер запретил доступ к буферу.', !copied);
  }

  function svgIcon(id) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${id}`);
    svg.append(use);
    return svg;
  }

  function route(focus = false) {
    const requested = location.hash.slice(1);
    const page = ['people', 'rules', 'chats', 'resources', 'clubs'].includes(requested) ? requested : 'people';
    $$('.page-section').forEach(section => { section.hidden = section.id !== `page-${page}`; });
    $$('.nav-link').forEach(link => {
      const selected = link.dataset.page === page;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const titles = { people: 'Студенты', rules: 'Правила и FAQ', chats: 'Чаты', resources: 'Полезные сайты', clubs: 'Клубы' };
    document.title = `${titles[page]} · Ижевский кампус`;
    if (focus) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      $('#main').focus({ preventScroll: true });
    }
  }

  window.addEventListener('hashchange', () => route(true));
  $('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    $('#main').focus();
  });

  function plural(count, forms) {
    const last = count % 10;
    const lastTwo = count % 100;
    return forms[last === 1 && lastTwo !== 11 ? 0 : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 1 : 2];
  }

  function renderInterestTags(container, interests, limit = interests.length) {
    const tags = interests.slice(0, limit).map(id => {
      const tag = document.createElement('span');
      tag.className = 'interest-tag';
      tag.textContent = interestLabels[id];
      return tag;
    });
    if (interests.length > limit) {
      const more = document.createElement('span');
      more.className = 'interest-tag interest-more';
      more.textContent = `+${interests.length - limit}`;
      more.title = interests.slice(limit).map(id => interestLabels[id]).join(', ');
      more.setAttribute('aria-label', `Ещё интересы: ${more.title}`);
      tags.push(more);
    }
    container.replaceChildren(...tags);
  }

  function renderInterestPicker() {
    const choices = Object.entries(interestLabels).map(([id, text]) => {
      const label = document.createElement('label');
      label.className = 'interest-choice';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'interests';
      checkbox.value = id;
      const caption = document.createElement('span');
      caption.textContent = text;
      label.append(checkbox, caption);
      return label;
    });
    $('#interest-picker').replaceChildren(...choices);
  }

  function renderDirectionPicker() {
    const options = [new Option('Не указано', '')];
    Object.entries(directions).forEach(([id, text]) => options.push(new Option(text, id)));
    $('#person-direction').replaceChildren(...options);
  }

  function allPeople() {
    if (!supabaseClient) return people;
    const remoteNicks = new Set(remotePeople.map(person => person.nick.toLowerCase()));
    const pending = pendingPeople
      .filter(person => !remoteNicks.has(person.nick.toLowerCase()))
      .map(person => ({ ...person, pending: true }));
    return [...pending, ...remotePeople.map(person => ({ ...person, remote: true }))];
  }

  function prunePending() {
    const remoteNicks = new Set(remotePeople.map(person => person.nick.toLowerCase()));
    const next = pendingPeople.filter(person => !remoteNicks.has(person.nick.toLowerCase()));
    if (next.length === pendingPeople.length) return;
    pendingPeople = next;
    persist(keys.pending, pendingPeople, '#person-error');
  }

  async function loadRemotePeople() {
    if (!supabaseClient) return;
    try {
      const { data, error } = await withTimeout(supabaseClient
        .from('people')
        .select('id, nick, name, telegram, direction, bio, interests')
        .eq('status', 'approved')
        .order('created_at', { ascending: false }));
      if (error) throw error;
      remotePeople = (data || [])
        .filter(validPersonRecord)
        .map(({ id, nick, name, telegram, bio = '', interests = [], direction = '' }) => ({ id, nick, name, telegram, bio, interests, direction }));
      prunePending();
      renderPeople();
    } catch (error) {
      console.error(error);
      $('#results-summary').textContent = 'Общий список недоступен';
      showToast('Не удалось загрузить общий список анкет.', true);
    }
  }

  function newCancelToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function ownHeaders(token) {
    return { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'x-s21-token': token };
  }

  async function fetchOwnStatus(nick, token) {
    const response = await withTimeout(fetch(`${supabaseUrl}/rest/v1/people?select=status&nick=eq.${encodeURIComponent(nick)}`, { headers: ownHeaders(token) }));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    return rows.length ? rows[0].status : null;
  }

  async function deleteOwnSubmission(nick, token) {
    const response = await withTimeout(fetch(`${supabaseUrl}/rest/v1/people?nick=eq.${encodeURIComponent(nick)}`, {
      method: 'DELETE',
      headers: { ...ownHeaders(token), Prefer: 'return=representation' },
    }));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const deleted = await response.json();
    if (!deleted.length) throw new Error('nothing deleted');
  }

  async function updateOwnSubmission(person) {
    const button = $('#person-submit');
    button.disabled = true;
    try {
      const response = await withTimeout(fetch(`${supabaseUrl}/rest/v1/people?nick=eq.${encodeURIComponent(person.nick)}`, {
        method: 'PATCH',
        headers: { ...ownHeaders(person.token), 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({
          name: person.name,
          telegram: person.telegram,
          direction: person.direction,
          bio: person.bio,
          interests: person.interests,
          status: 'pending',
        }),
      }));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const updated = await response.json();
      if (!updated.length) throw new Error('nothing updated');
    } catch (error) {
      console.error(error);
      setError('#person-error', 'Не удалось сохранить правки в базе. Проверь подключение к интернету. Если ошибка повторяется, обратись к администратору.');
      return;
    } finally {
      button.disabled = false;
    }
    const next = pendingPeople.map(item => item.id === person.id
      ? { ...item, name: person.name, telegram: person.telegram, direction: person.direction, bio: person.bio, interests: person.interests, status: 'pending' }
      : item);
    if (!persist(keys.pending, next, '#person-error')) return;
    pendingPeople = next;
    renderPeople();
    $('#person-dialog').close();
    showToast('Заявка обновлена и снова ждёт проверки.');
  }

  async function syncPendingStatus() {
    const withToken = pendingPeople.filter(person => person.token);
    if (!withToken.length) return;
    const statuses = await Promise.all(withToken.map(async person => {
      try {
        return { id: person.id, status: await fetchOwnStatus(person.nick, person.token) };
      } catch (error) {
        console.error(error);
        return { id: person.id, status: undefined };
      }
    }));
    const removed = [];
    const next = [];
    let changed = false;
    pendingPeople.forEach(person => {
      const found = statuses.find(item => item.id === person.id);
      if (!found || found.status === undefined || found.status === 'approved') {
        next.push(person);
        return;
      }
      if (found.status === null) {
        removed.push(person.nick);
        changed = true;
        return;
      }
      const status = found.status === 'rejected' ? 'rejected' : 'pending';
      if (person.status !== status) changed = true;
      next.push(person.status === status ? person : { ...person, status });
    });
    if (!changed) return;
    pendingPeople = next;
    persist(keys.pending, pendingPeople, '#person-error');
    renderPeople();
    if (removed.length) showToast(`Модератор удалил заявку: ${removed.join(', ')}.`, true);
  }

  function pageSequence(total, current) {
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
    const pages = new Set([1, total, current - 1, current, current + 1]);
    if (current <= 3) [2, 3, 4].forEach(page => pages.add(page));
    if (current >= total - 2) [total - 1, total - 2, total - 3].forEach(page => pages.add(page));
    const sorted = [...pages].filter(page => page >= 1 && page <= total).sort((a, b) => a - b);
    const sequence = [];
    sorted.forEach((page, index) => {
      if (index > 0 && page - sorted[index - 1] > 1) sequence.push(null);
      sequence.push(page);
    });
    return sequence;
  }

  function stepButton(target, label, icon, disabled, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `page-button page-step ${className}`;
    button.dataset.page = String(target);
    button.setAttribute('aria-label', label);
    button.disabled = disabled;
    button.append(svgIcon(icon));
    return button;
  }

  function renderPagination(totalPages, totalCount) {
    const nav = $('#pagination');
    $('#list-footer').hidden = totalCount === 0;
    $('#page-size').value = String(pageSize);
    if (totalPages <= 1) {
      nav.hidden = true;
      nav.replaceChildren();
      return;
    }
    nav.hidden = false;
    const fragment = document.createDocumentFragment();
    fragment.append(stepButton(currentPage - 1, 'Предыдущая страница', 'i-chevron', currentPage === 1, 'is-prev'));
    pageSequence(totalPages, currentPage).forEach(page => {
      if (page === null) {
        const gap = document.createElement('span');
        gap.className = 'page-ellipsis';
        gap.textContent = '…';
        gap.setAttribute('aria-hidden', 'true');
        fragment.append(gap);
        return;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'page-button';
      button.dataset.page = String(page);
      button.textContent = String(page);
      button.setAttribute('aria-label', `Страница ${page}`);
      if (page === currentPage) button.setAttribute('aria-current', 'page');
      button.classList.toggle('is-current', page === currentPage);
      fragment.append(button);
    });
    fragment.append(stepButton(currentPage + 1, 'Следующая страница', 'i-chevron', currentPage === totalPages, 'is-next'));
    nav.replaceChildren(fragment);
  }

  function renderPeople() {
    const everyone = allPeople();
    const query = $('#people-search').value.trim().toLocaleLowerCase('ru').replace(/^@/, '');
    const visible = everyone.filter(person => [person.nick, person.name, person.telegram || '', directions[person.direction] || '', ...person.interests.map(id => interestLabels[id])].some(value => value.toLocaleLowerCase('ru').includes(query)));
    const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    const start = (currentPage - 1) * pageSize;
    const pageItems = visible.slice(start, start + pageSize);
    const fragment = document.createDocumentFragment();
    pageItems.forEach(person => {
      const row = $('#person-template').content.firstElementChild.cloneNode(true);
      row.dataset.id = person.id;
      $('.nick-text', row).textContent = person.nick;
      const nickButton = $('.copy-nick', row);
      nickButton.setAttribute('aria-label', `Скопировать ник ${person.nick}`);
      nickButton.title = `Скопировать ник ${person.nick}`;
      const direction = $('.direction-badge', row);
      direction.textContent = directions[person.direction] || '';
      direction.hidden = !person.direction;
      $('.person-name', row).textContent = person.name;
      $('.person-bio-preview', row).textContent = person.bio || 'О себе пока ничего не указано.';
      renderInterestTags($('.person-interests', row), person.interests, 4);
      const telegram = $('.copy-telegram', row);
      $('span', telegram).textContent = `@${person.telegram}`;
      telegram.setAttribute('aria-label', `Скопировать тег @${person.telegram}`);
      telegram.title = `Скопировать тег @${person.telegram}`;
      $('.profile-open', row).setAttribute('aria-label', `Открыть профиль ${person.nick}`);
      const editButton = $('.edit-person', row);
      editButton.setAttribute('aria-label', person.pending ? `Изменить заявку ${person.nick}` : `Редактировать анкету ${person.nick}`);
      editButton.title = person.pending ? 'Изменить заявку' : 'Редактировать анкету';
      editButton.hidden = Boolean(person.remote || (person.pending && !person.token));
      const cancellable = Boolean(person.pending && person.token);
      const deleteButton = $('.delete-person', row);
      deleteButton.setAttribute('aria-label', cancellable ? `Отменить заявку ${person.nick}` : `Удалить анкету ${person.nick}`);
      deleteButton.title = cancellable ? 'Отменить заявку' : 'Удалить анкету';
      $('.card-actions', row).hidden = Boolean(person.remote || (person.pending && !cancellable));
      const badge = $('.person-pending', row);
      badge.textContent = person.status === 'rejected' ? 'отклонена' : 'на проверке';
      badge.classList.toggle('is-rejected', person.status === 'rejected');
      badge.hidden = !person.pending;
      fragment.append(row);
    });
    $('#people-list').replaceChildren(fragment);
    renderPagination(totalPages, visible.length);
    const end = Math.min(start + pageSize, visible.length);
    $('#results-summary').textContent = visible.length
      ? visible.length > pageSize ? `Показано ${start + 1}–${end} из ${visible.length}` : `${visible.length} ${plural(visible.length, ['студент', 'студента', 'студентов'])}`
      : query ? 'Ничего не найдено' : 'Пока никого';
    $('#people-empty').hidden = visible.length > 0;
    if (!visible.length) {
      $('#empty-title').textContent = query ? 'Ничего не найдено' : 'Пока никого';
      $('#empty-description').textContent = query ? 'Измени запрос или сбрось поиск, чтобы увидеть весь список.' : supabaseClient ? 'Добавь первую анкету — после проверки она появится в общем каталоге.' : 'Добавь первую анкету — она сохранится в этом браузере.';
      $('#empty-action').textContent = query ? 'Сбросить поиск' : 'Добавить анкету';
    }
  }

  $('#people-search').addEventListener('input', () => {
    currentPage = 1;
    renderPeople();
  });
  $('#empty-action').addEventListener('click', () => {
    if ($('#people-search').value.trim()) {
      $('#people-search').value = '';
      currentPage = 1;
      renderPeople();
      $('#people-search').focus();
    } else {
      openPerson();
    }
  });

  $('#pagination').addEventListener('click', event => {
    const button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;
    const target = Number(button.dataset.page);
    if (!Number.isInteger(target) || target === currentPage) return;
    currentPage = target;
    renderPeople();
    $('#people-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#page-size').addEventListener('change', event => {
    const value = Number(event.target.value);
    if (!pageSizes.includes(value)) return;
    pageSize = value;
    currentPage = 1;
    try {
      localStorage.setItem(keys.pageSize, String(value));
    } catch {
      showToast('Размер страницы изменён, но браузер не разрешил сохранить выбор.', true);
    }
    renderPeople();
  });

  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, select, [contenteditable="true"]') && !document.querySelector('dialog[open]') && !$('#page-people').hidden) {
      event.preventDefault();
      $('#people-search').focus();
    }
  });

  function showDialog(dialog) {
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
  }

  $$('dialog').forEach(dialog => {
    $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]')));
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  function openProfile(person) {
    profileId = person.id;
    $('#profile-title').textContent = person.nick;
    $('#profile-name').textContent = person.name;
    $('#profile-badge').textContent = person.pending ? (person.status === 'rejected' ? 'отклонена' : 'на проверке') : person.remote ? '' : 'локальная запись';
    $('#profile-badge').hidden = Boolean(person.remote);
    $('#profile-edit').hidden = Boolean(person.remote || (person.pending && !person.token));
    const direction = $('#profile-direction');
    direction.textContent = directions[person.direction] || '';
    direction.hidden = !person.direction;
    $('#profile-bio').textContent = person.bio || 'О себе пока ничего не указано.';
    renderInterestTags($('#profile-interests'), person.interests);
    $('#profile-no-interests').hidden = person.interests.length > 0;
    showDialog($('#profile-dialog'));
  }

  $('#profile-edit').addEventListener('click', () => {
    const person = allPeople().find(item => item.id === profileId);
    if (!person || person.remote || (person.pending && !person.token)) return;
    $('#profile-dialog').close();
    openPerson(person);
  });

  $('#profile-telegram').addEventListener('click', () => {
    const person = allPeople().find(item => item.id === profileId);
    if (!person) return;
    copyText(`@${person.telegram}`, `Тег скопирован: @${person.telegram}`);
  });

  function makeClubCard(club) {
    const card = $('#club-template').content.firstElementChild.cloneNode(true);
    card.dataset.club = club.id;
    $('.club-name', card).textContent = club.name;
    $('.club-description', card).textContent = club.description;
    $('.club-description', card).hidden = !club.description;
    renderInterestTags($('.club-interests', card), club.interests);
    $('.club-interests', card).hidden = club.interests.length === 0;
    const organizers = (club.organizers || []).filter(item => item && validText(item.name, 50));
    const organizersBox = $('.club-organizers', card);
    organizersBox.hidden = organizers.length === 0 && !club.organizersSoon;
    const organizerRows = organizers.map(item => {
      const row = document.createElement('div');
      row.className = 'club-organizer-row';
      const name = document.createElement('span');
      name.className = 'club-organizer-name';
      name.textContent = item.nick ? `${item.name} · ник ${item.nick}` : item.role ? `${item.name} · ${item.role}` : item.name;
      row.append(name);
      if (item.telegram && telegramPattern.test(item.telegram)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'telegram-link club-organizer';
        button.dataset.telegram = item.telegram;
        button.setAttribute('aria-label', `Скопировать тег @${item.telegram}`);
        button.title = `Скопировать тег @${item.telegram}`;
        const copyIcon = svgIcon('i-copy');
        copyIcon.classList.add('copy-mini');
        button.append(svgIcon('i-telegram'), document.createTextNode(`@${item.telegram}`), copyIcon);
        row.append(button);
      }
      return row;
    });
    if (club.organizersSoon && organizers.length === 0) {
      const soon = document.createElement('span');
      soon.className = 'club-organizer-name';
      soon.textContent = 'Организатор скоро появится';
      organizerRows.push(soon);
    }
    organizersBox.replaceChildren(...organizerRows);
    const chatUrl = safeUrl(club.chatUrl);
    if (chatUrl) {
      const link = document.createElement('a');
      link.className = 'telegram-link';
      link.href = chatUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.append(svgIcon('i-telegram'), document.createTextNode('Чат клуба'));
      card.append(link);
    }
    return card;
  }

  $('#clubs-grid').addEventListener('click', event => {
    const organizer = event.target.closest('.club-organizer');
    if (!organizer) return;
    copyText(`@${organizer.dataset.telegram}`, `Тег скопирован: @${organizer.dataset.telegram}`);
  });

  function openPerson(person = null) {
    editingId = person?.id ?? null;
    editingToken = person?.pending && person.token ? person.token : null;
    $('#person-form').reset();
    setError('#person-error');
    $('#person-dialog-title').textContent = person ? (person.pending ? 'Изменить заявку' : 'Изменить анкету') : 'Новая анкета';
    $('#person-dialog-description').textContent = person
      ? (person.pending
        ? (person.status === 'rejected'
          ? 'После исправления и сохранения отклонённая заявка будет отправлена на повторную проверку. Ник изменить нельзя.'
          : 'Заявка ещё на проверке: данные можно исправить до решения модератора. Ник изменить нельзя.')
        : 'Изменения сохранятся в этом браузере.')
      : supabaseClient
        ? 'Ник, имя и Telegram. После проверки анкета появится в общем каталоге.'
        : 'Ник, имя и Telegram. Направление, интересы и описание можно добавить по желанию.';
    $('#person-submit').replaceChildren(document.createTextNode(person ? 'Сохранить' : 'Добавить'), svgIcon('i-arrow'));
    $('#person-nick').disabled = Boolean(person?.pending);
    if (person) {
      $('#person-nick').value = person.nick;
      $('#person-name').value = person.name;
      $('#person-telegram').value = person.telegram;
      $('#person-direction').value = person.direction || '';
      $('#person-bio').value = person.bio;
      $$('#interest-picker input').forEach(input => { input.checked = person.interests.includes(input.value); });
      $('#person-consent').checked = true;
    }
    showDialog($('#person-dialog'));
    $('#person-nick').focus();
  }

  $$('[data-add-person]').forEach(button => button.addEventListener('click', () => openPerson()));

  $('#person-telegram').addEventListener('input', event => {
    const field = event.target;
    const cleaned = field.value.replace(/^@+/, '');
    if (cleaned !== field.value) field.value = cleaned;
  });

  function parseTelegram(value) {
    let username = value.trim();
    if (/^(?:https?:\/\/)?(?:www\.)?t\.me\//i.test(username)) {
      try {
        const url = new URL(/^https?:\/\//i.test(username) ? username : `https://${username}`);
        if (!['t.me', 'www.t.me'].includes(url.hostname) || url.username || url.password || url.port || url.search || url.hash) return null;
        username = url.pathname.replace(/^\//, '').replace(/\/$/, '');
      } catch {
        return null;
      }
    } else {
      username = username.replace(/^@/, '');
    }
    return telegramPattern.test(username) ? username.toLowerCase() : null;
  }

  async function submitPerson(person) {
    const button = $('#person-submit');
    button.disabled = true;
    try {
      const { error } = await withTimeout(supabaseClient.from('people').insert({
        nick: person.nick,
        name: person.name,
        telegram: person.telegram,
        direction: person.direction,
        bio: person.bio,
        interests: person.interests,
        cancel_token: person.token,
      }));
      if (error) {
        console.error(error);
        setError('#person-error', error.code === '23505'
          ? 'Этот ник уже занят. Если анкета уже отправлена — дождись проверки.'
          : 'Не удалось отправить анкету. Проверь интернет и попробуй ещё раз.');
        return;
      }
    } catch (requestError) {
      console.error(requestError);
      setError('#person-error', 'Не удалось отправить анкету. Проверь интернет и попробуй ещё раз.');
      return;
    } finally {
      button.disabled = false;
    }
    const next = [person, ...pendingPeople];
    if (persist(keys.pending, next, '#person-error')) pendingPeople = next;
    $('#people-search').value = '';
    currentPage = 1;
    renderPeople();
    $('#person-dialog').close();
    showToast('Анкета отправлена на проверку.');
  }

  $('#person-form').addEventListener('submit', async event => {
    event.preventDefault();
    setError('#person-error');
    const nick = $('#person-nick').value.trim().toLowerCase();
    const name = $('#person-name').value.trim();
    const telegram = parseTelegram($('#person-telegram').value);
    const direction = $('#person-direction').value;
    const bio = $('#person-bio').value.trim();
    const interests = $$('#interest-picker input:checked').map(input => input.value);
    if (!nickPattern.test(nick)) {
      setError('#person-error', 'Проверь ник: 2–24 символа, первая — латинская буква.');
      $('#person-nick').focus();
      return;
    }
    if (!validText(name, 50)) {
      setError('#person-error', 'Укажи имя, а не только пробелы.');
      $('#person-name').focus();
      return;
    }
    if (!telegram) {
      setError('#person-error', 'Проверь Telegram: username из 5–32 латинских букв, цифр или _, начинается с буквы. Можно вставить ссылку https://t.me/username.');
      $('#person-telegram').focus();
      return;
    }
    if (!validDirection(direction)) {
      setError('#person-error', 'Выбери направление из списка.');
      $('#person-direction').focus();
      return;
    }
    const taken = supabaseClient
      ? remotePeople.some(item => item.nick.toLowerCase() === nick) || pendingPeople.some(item => item.id !== editingId && item.nick.toLowerCase() === nick)
      : people.some(item => item.id !== editingId && item.nick.toLowerCase() === nick);
    if (taken) {
      setError('#person-error', supabaseClient
        ? 'Этот ник уже есть в общем каталоге или отправлен на проверку.'
        : 'Этот ник уже есть в твоих записях. Можно отредактировать существующую анкету.');
      $('#person-nick').focus();
      return;
    }
    if (bio.length > 600 || !validInterests(interests)) {
      setError('#person-error', 'Описание должно быть не длиннее 600 символов, а интересы — из предложенного списка.');
      return;
    }
    const person = { id: editingId || crypto.randomUUID(), nick, name, telegram, direction, bio, interests };
    if (supabaseClient) {
      if (editingToken) await updateOwnSubmission({ ...person, token: editingToken });
      else await submitPerson({ ...person, token: newCancelToken() });
      return;
    }
    const next = editingId ? people.map(item => item.id === editingId ? person : item) : [person, ...people];
    if (!persist(keys.people, next, '#person-error')) return;
    people = next;
    $('#people-search').value = '';
    currentPage = 1;
    renderPeople();
    $('#person-dialog').close();
    showToast(editingId ? 'Анкета обновлена.' : 'Анкета добавлена и сохранена в этом браузере.');
  });

  $('#people-list').addEventListener('click', event => {
    const row = event.target.closest('.person-row');
    if (!row) return;
    const id = row.dataset.id;
    const person = allPeople().find(item => item.id === id);
    if (!person) return;
    if (event.target.closest('.copy-nick')) {
      copyText(person.nick, `Ник скопирован: ${person.nick}`);
      return;
    }
    if (event.target.closest('.copy-telegram')) {
      copyText(`@${person.telegram}`, `Тег скопирован: @${person.telegram}`);
      return;
    }
    if (event.target.closest('.profile-open')) {
      openProfile(person);
      return;
    }
    if (event.target.closest('.edit-person')) openPerson(person);
    if (event.target.closest('.delete-person')) {
      if (person.pending) {
        requestDelete('pending', person.id, person.status === 'rejected'
          ? `Заявка ${person.nick} отклонена модератором. Убрать её? Ник освободится, и анкету можно будет отправить заново.`
          : `Заявка ${person.nick} ещё на проверке. Отменить её? Она исчезнет из списка и из базы модератора.`);
        return;
      }
      requestDelete('person', person.id, `Анкета ${person.nick} исчезнет из этого браузера. Это действие нельзя отменить.`);
    }
  });

  function renderResources() {
    const fragment = document.createDocumentFragment();
    resourceGroups.forEach(group => {
      const items = resources.filter(resource => resource.group === group.id);
      if (!items.length) return;
      const heading = document.createElement('h3');
      heading.className = 'resources-group-title';
      heading.textContent = group.title;
      fragment.append(heading);
      items.forEach(resource => {
        const card = $('#resource-template').content.firstElementChild.cloneNode(true);
        card.dataset.id = resource.id;
        $('h3', card).textContent = resource.title;
        $('.resource-description', card).textContent = resource.description || '';
        $('.resource-link', card).href = safeUrl(resource.url);
        $('.resource-link', card).setAttribute('aria-label', `Открыть: ${resource.title}`);
        $('.resource-domain', card).textContent = new URL(resource.url).hostname;
        fragment.append(card);
      });
    });
    $('#resources-grid').replaceChildren(fragment);
  }

  let chatFilter = 'all';

  function renderChatFilter() {
    const chips = [{ id: 'all', title: 'Все чаты' }, ...chatGroups].map(group => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chat-chip';
      chip.dataset.filter = group.id;
      chip.textContent = group.title;
      chip.setAttribute('aria-pressed', String(group.id === chatFilter));
      chip.classList.toggle('is-active', group.id === chatFilter);
      return chip;
    });
    $('#chat-filter').replaceChildren(...chips);
  }

  function renderChats() {
    const fragment = document.createDocumentFragment();
    let visible = 0;
    chatGroups.forEach(group => {
      if (chatFilter !== 'all' && chatFilter !== group.id) return;
      const items = chats.filter(chat => chat.group === group.id);
      if (!items.length) return;
      const heading = document.createElement('h3');
      heading.className = 'chats-group-title';
      heading.textContent = group.title;
      fragment.append(heading);
      items.forEach(chat => {
        const card = $('#chat-template').content.firstElementChild.cloneNode(true);
        card.dataset.id = chat.id;
        const badge = $('.chat-direction', card);
        badge.textContent = chat.tag || '';
        badge.hidden = !chat.tag;
        $('h3', card).textContent = chat.title;
        const description = $('.resource-description', card);
        description.textContent = chat.description || '';
        description.hidden = !chat.description;
        const link = $('.chat-link', card);
        const url = safeUrl(chat.url);
        if (url) {
          const anchor = document.createElement('a');
          anchor.className = 'resource-link';
          anchor.href = url;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          const label = chat.group === 'bots' ? 'Открыть бота' : 'Открыть чат';
          anchor.setAttribute('aria-label', `${label}: ${chat.title}`);
          anchor.append(document.createTextNode(label), svgIcon('i-external'));
          link.replaceChildren(anchor);
        } else {
          const soon = document.createElement('span');
          soon.className = 'chat-soon';
          soon.textContent = 'Ссылку добавим позже';
          link.replaceChildren(soon);
        }
        fragment.append(card);
        visible += 1;
      });
    });
    $('#chats-grid').replaceChildren(fragment);
    $('#chats-empty').hidden = visible > 0;
    $$('#chat-filter .chat-chip').forEach(chip => {
      const active = chip.dataset.filter === chatFilter;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  $('#chat-filter').addEventListener('click', event => {
    const chip = event.target.closest('.chat-chip');
    if (!chip) return;
    chatFilter = chip.dataset.filter;
    renderChats();
  });

  function requestDelete(type, id, description) {
    pendingDelete = { type, id };
    $('#delete-title').textContent = type === 'pending' ? 'Отменить заявку?' : 'Удалить запись?';
    $('#confirm-delete').textContent = type === 'pending' ? 'Отменить заявку' : 'Удалить';
    $('#delete-description').textContent = description;
    setError('#delete-error');
    showDialog($('#delete-dialog'));
  }

  $('#confirm-delete').addEventListener('click', async () => {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;
    if (type === 'pending') {
      const person = pendingPeople.find(item => item.id === id);
      if (!person) return;
      const button = $('#confirm-delete');
      button.disabled = true;
      try {
        await deleteOwnSubmission(person.nick, person.token);
      } catch (error) {
        console.error(error);
        setError('#delete-error', 'Не удалось отменить заявку в базе. Проверь подключение к интернету. Если ошибка повторяется, обратись к администратору.');
        return;
      } finally {
        button.disabled = false;
      }
      const next = pendingPeople.filter(item => item.id !== id);
      if (!persist(keys.pending, next, '#delete-error')) return;
      pendingPeople = next;
      renderPeople();
      pendingDelete = null;
      $('#delete-dialog').close();
      showToast('Заявка отменена.');
      return;
    }
    if (type === 'person') {
      const next = people.filter(person => person.id !== id);
      if (!persist(keys.people, next, '#delete-error')) return;
      people = next;
      renderPeople();
    }
    pendingDelete = null;
    $('#delete-dialog').close();
    showToast('Запись удалена из этого браузера.');
  });

  const themeMeta = $('meta[name="theme-color"]');
  function applyTheme(theme) {
    if (theme === 'dark') document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#16130e' : '#ece0c8';
  }
  function storedTheme() {
    try {
      return localStorage.getItem(keys.theme) === 'dark' ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  }
  applyTheme(storedTheme());
  $('#theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(keys.theme, next);
    } catch (error) {}
  });

  window.addEventListener('storage', event => {
    if (event.key === keys.theme) {
      applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
      return;
    }
    if (event.key === keys.people || event.key === keys.pending || event.key === keys.pageSize || event.key === null) {
      location.reload();
    }
  });

  if (supabaseClient) {
    $('.consent-label span').textContent = 'Публикую свои данные в общем каталоге. Их увидят все посетители сайта.';
  }
  renderDirectionPicker();
  renderInterestPicker();
  renderChatFilter();
  renderChats();
  $('#clubs-grid').replaceChildren(...clubs.map(club => makeClubCard(club)));
  route();
  renderPeople();
  if (supabaseClient) {
    $('#results-summary').textContent = 'Загружаем анкеты…';
    loadRemotePeople().then(syncPendingStatus);
  }
  renderResources();
  if (warnings.length) showToast(warnings[0], true);
})();
