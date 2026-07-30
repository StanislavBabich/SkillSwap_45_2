SkillSwap — это современное одностраничное приложение (SPA) для обмена навыками между пользователями. Платформа позволяет публиковать навыки двух типов: "Я научу" и "Хочу научиться", находить взаимные интересы, отправлять заявки на обмен и эффективно управлять процессом обучения.

🔗 Демо: https://github.com/PM-YandexPracticum/SkillSwap_45_3
📅 Дата релиза: Февраль 2025
👥 Команда: "О проекте" /about


🎯 О ПРОЕКТЕ
SkillSwap решает проблему поиска единомышленников для взаимного обучения. Платформа объединяет людей, готовых делиться знаниями, и тех, кто хочет освоить новые навыки.

Основные возможности:
📌 Публикация навыков — создавайте карточки с описанием того, чему можете научить или что хотите изучить
🔍 Умный поиск и фильтрация — находите нужные навыки по категориям, городам и другим параметрам
🤝 Обмен навыками — отправляйте заявки на обмен и управляйте ими
❤️ Избранное — сохраняйте интересные навыки в личную коллекцию
🌓 Тёмная тема — комфортное использование в любое время суток


✨ КЛЮЧЕВЫЕ ОСОБЕННОСТИ

🏗️ Feature-Sliced Design (FSD)
Проект построен на современной методологии организации React-приложений, что обеспечивает:
Чёткое разделение ответственности между слоями
Масштабируемость и лёгкость поддержки
Переиспользование кода между фичами

🎨 Собственный UI-кит
Разработана библиотека компонентов с единой дизайн-системой:
17 переиспользуемых компонентов
Единые дизайн-токены (CSS-переменные)
Полная поддержка тёмной темы

⚡ Производительность
Мемоизированные селекторы Redux
Debounce для поиска (400ms)
Бесконечный скролл с подгрузкой по 21 карточке
Lazy-loading компонентов
Lighthouse Performance ≥ 80

🔐 Работа с данными
JSON-данные на хостинге mocki.io — имитация серверного API
localStorage для постоянных состояний (избранное, заявки, настройки темы)
Supabase для хранения изображений навыков
DiceBear для генерации аватаров

🧪 Качество кода
TypeScript (strict mode)
ESLint + Prettier + Stylelint
Conventional Commits
CI/CD через GitHub Actions
Покрытие тестами ≥ 65%

🏗️ АРХИТЕКТУРА FSD

src/
├── app/          # Инициализация приложения (store, router, providers, стили)
├── entities/     # Бизнес-сущности (User, Skill, Category, City, Request)
├── features/     # Бизнес-логика (auth, filters, users, skills, requests)
├── widgets/      # Сложные композитные блоки (Header, FiltersBar, Sidebar)
├── pages/        # Страницы приложения (Home, About, Profile, Skill...)
└── shared/       # Переиспользуемый код (UI-kit, хуки, утилиты, API)

🔄 Поток данных
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Действие   │────▶│   Redux     │────▶│  Селектор   │────▶│  Компонент  │
│ (dispatch)  │     │   (slice)   │     │(мемоизация) │     │ (рендер)    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │                   │
       │                    ▼                    │                   │
       └───────────▶ localStorage ◄──────────────┘                  │
                    (избранное, заявки)                              │
                                                                      ▼
                                                              ┌─────────────┐
                                                              │   mocki.io  │
                                                           │  (JSON API)  │
                                                              └─────────────┘

💻 ТЕХНИЧЕСКИЙ СТЕК
Frontend
React	19.2	Библиотека UI
TypeScript	5.9	Типизация
Redux Toolkit	2.11	Управление состоянием
React Router	7.13	Навигация
Vite	7.2	Сборка и dev-сервер
CSS Modules	-	Стилизация компонентов

Инструменты разработки
ESLint	Линтинг JavaScript/TypeScript
Prettier	Форматирование кода
Stylelint	Линтинг CSS
Husky	Git-хуки
Jest + RTL	Тестирование
Storybook	Документирование компонентов

Хостинг и API
mocki.io	Хостинг JSON-файлов (skills, users, categories, cities)
Supabase	Хранение изображений навыков
DiceBear	Генерация аватаров пользователей

⚙️ ФУНКЦИОНАЛЬНОСТЬ
✅ Реализовано (MVP + доп. фичи)
Каталог	Бесконечный скролл (21 карточка), сетка 3/2/1 колонки	✅
Поиск	Debounce (400ms), очистка Escape, Enter-применение	✅
Фильтры	По категориям (дерево с подкатегориями), городам, полу, типу навыка (AND-логика)	✅
Активные фильтры	Отображение выбранных фильтров над результатами, снятие по клику	✅
Сортировка	"Сначала новые / сначала старые" для всех режимов	✅
Карточка навыка	Like, просмотр, переход на страницу навыка	✅
Страница навыка	Детальная информация, похожие навыки (4 шт.), кнопка обмена	✅
Аутентификация	Регистрация/вход, защищённые маршруты, редирект после логина	✅
Регистрация	Многошаговая форма (3 шага), валидация, загрузка аватара	✅
Профиль	Личные данные, мои навыки, вкладки заявок (входящие/исходящие)	✅
Заявки на обмен	Создание, toast-уведомления	✅
Избранное	Добавление/удаление, отдельная страница /favorites	✅
Создание навыка	Форма с валидацией, загрузка изображений в Supabase	✅
Тёмная тема	Переключатель, CSS-переменные, сохранение в localStorage	✅
Страница "О проекте"	Информация о команде и проекте	✅
404 / 500	Кастомные страницы ошибок	✅

📁 СТРУКТУРА ПРОЕКТА (ДЕТАЛЬНО)
🎯 app/ — Инициализация приложения
app/
├── store/
│   ├── index.ts        # Конфигурация Redux store
│   └── hooks.ts        # Типизированные хуки (useAppDispatch, useAppSelector)
├── router/
│   └── index.tsx       # Маршруты (ленивая загрузка страниц)
│   └── PrivateRoute.tsx # защита маршрутов
├── providers/
│   ├── StoreProvider.tsx
│   ├── RouterProvider.tsx
└── styles/
    ├── design-tokens.css          # CSS-переменные (цвета, отступы, тени)
    ├── design-tokens-typography.css # CSS-переменные шрифтов
    ├── globals.css                # Сброс стилей
    └── theme.css                  # Светлая/тёмная тема

🧩 entities/ — Бизнес-сущности
entities/
├── base.ts                        # Базовые типы (EntityId, Gender, AsyncStatus)
├── user/
│   ├── types.ts                   # User, CreateUserDto, UpdateUserDto
│   └── api.ts                     # Загрузка users.json с mocki.io
├── skill/
│   ├── types.ts                   # Skill, SkillType, CreateSkillDto
│   └── api.ts                     # Загрузка skills.json
├── category/
│   ├── types.ts                   # Category, Subcategory
│   └── api.ts                     # Загрузка categories.json с mocki.io
├── city/
│   ├── types.ts                   # City
│   └── api.ts                     # Загрузка cities.json с mocki.io
└── request/
    └── types.ts                   # SkillShareRequest, статусы (pending/accepted...)

⚙️ features/ — Бизнес-логика
features/
├── users/
│   ├── slice.ts                   # CRUD операции, загрузка пользователей
│   ├── selectors.ts               # Фильтрация, сортировка, рекомендации
│   └── thunks.ts                  # createUserWithSkill (пользователь + навык)
├── skills/
│   ├── slice.ts                   # CRUD навыков, лайки
│   └── selectors.ts               # Фильтрация по автору, категории, популярные/новые
├── filters/
│   ├── slice.ts                   # Состояние фильтров (search, skillType, categoryIds...)
│   └── selectors.ts               # selectActiveFiltersCount, selectHasAnyFilters
├── categories/
│   └── slice.ts                   # Загрузка категорий/подкатегорий
├── cities/
│   └── slice.ts                   # Загрузка городов
├── auth/
│   ├── hooks/useAuth.ts           # Кастомный хук авторизации
│   └── services/AuthService.ts    # Работа с localStorage, сессия
├── requests/                      # Заявки на обмен 
└── exchanges/                     # Обмены 
└── notifications/                 # Уведомления

🧱 widgets/ — Сложные блоки UI
widgets/
├── Header/
│   ├── Header.tsx
│   ├── components/
│   │   ├── SearchInput/           # Поиск с debounce
│   │   ├── UserMenu/              # Меню пользователя (аватар, уведомления)
│   │   └── SkillsDropdownMenu/    # Меню "Все навыки" 
│   └── index.ts
├── Footer/
│   └── Footer.tsx
├── FiltersBar/
│   ├── FiltersBar.tsx
│   ├── components/
│   │   ├── SkillTypeFilter/       # Радиокнопки (Все/Учусь/Учу)
│   │   ├── CategoryFilter/        # Дерево категорий с чекбоксами
│   │   ├── CityFilter/            # Множественный выбор городов
│   │   └── GenderFilter/          # Радиокнопки пола
│   └── index.ts
├── MainContent/                   # Основной контент
│   ├── MainContent.tsx
│   ├── components/
│   │   ├── SectionHeader/         # Заголовок с кнопкой "Смотреть все"
│   │   ├── SectionGrid/           # Сетка карточек (preview/full)
│   │   ├── EmptyState/            # Пустое состояние
│   │   └── ActiveFilters/         # Активные фильтры над результатами
│   └── index.ts
├── SkillCard/                     # Карточка навыка
│   ├── SkillCard.tsx
│   ├── components/
│   │   ├── LikeButton/            # Кнопка лайка
│   │   └── ActionButtons/         # Кнопки "Поделиться", "Ещё"
│   └── index.ts
└── Notifications/
    ├── NotificationModal.tsx      # Модальное окно уведомлений
    └── NotificationToast.tsx      # Всплывающий тост

📄 pages/ — Страницы
pages/
├── HomePage/                        # Главная (/)
├── AboutPage/                       # О проекте и команде (/about)
├── LoginPage/                       # Вход (/login)
├── RegisterPage/                    # Регистрация (/register)
│   └── components/
│       ├── Step1Account/            # Шаг 1: Email/пароль
│       ├── Step2Profile/            # Шаг 2: Личные данные
│       ├── Step3Skill/              # Шаг 3: Навык
│       ├── StepIndicator/           # Индикатор шагов
│       └── Modals/                  # ConfirmModal, SuccessModal
├── ProfilePage/                     # Профиль (/profile)
│   └── components/
│       ├── ProfileMenu/             # Навигация по профилю
│       ├── ProfileForm/             # Редактирование данных
│       └── AvatarUpload/            # Загрузка аватара
├── SkillPage/                       # Страница навыка (/skill/:id)
├── FavoritesPage/                   # Избранное (/favorites)
├── NotFoundPage/                    # 404
└── ServerErrorPage/                 # 500

🔧 shared/ — Переиспользуемый код
shared/
├── ui/                                   # UI-кит
│   ├── Button/                           # Кнопки (primary/secondary/text, размеры, иконки)
│   ├── Input/                            # Поле ввода (иконки, ошибки, лоадер)
│   ├── Checkbox/                         # Чекбокс
│   ├── Radio/                            # Радиокнопка
│   ├── RadioGroup/                       # Группа радиокнопок
│   ├── CheckboxGroup/                    # Группа чекбоксов
│   ├── Select/                           # Селект (одиночный)
│   ├── Dropdown/                         # Дропдаун (множественный)
│   ├── DropDownCity/                     # Поиск города
│   ├── DatePicker/                       # Выбор даты
│   ├── Tag/                              # Цветной тег
│   ├── Headline/                         # Заголовки h1-h6
│   ├── Link/                             # Ссылки
│   ├── UserInfo/                         # Блок информации о пользователе
│   ├── Modal/                            # Модальное окно
│   └── Icon/                             # Система иконок (35+ иконок)
├── hooks/
│   ├── useDebounce.ts                    # Debounce для поиска
│   ├── useAvatar.ts                      # Генерация DiceBear аватара
│   └── useLocalStorage.ts                # Работа с localStorage
├── lib/
│   ├── storage.ts                        # Утилиты localStorage
└── api/
    ├── fetchJson.ts                      # Обёртка над fetch
    ├── memoizeRequest.ts                 # Кэширование запросов
    └── db.ts                             # Работа с JSON-файлами
    └── storage.ts                        # Работа с supabase


🚀 ЗАПУСК И СБОРКА
Предварительные требования
Node.js 18+

npm 9+ или yarn 1.22+

Установка
# Клонирование репозитория
git clone https://github.com/PM-YandexPracticum/SkillSwap_45_3.git
cd skillswap

# Установка зависимостей
npm install

Разработка
# Запуск dev-сервера
npm run dev

# Линтинг (автоисправление)
npm run lint

# Форматирование кода
npm run format

# Запуск тестов
npm test

# Запуск Storybook
npm run storybook

Сборка и деплой
# Сборка для production
npm run build

# Предпросмотр собранного проекта
npm run preview


Переменные окружения
Создайте файл .env в корне проекта:

# Supabase 
VITE_SUPABASE_URL=https://gxnockenqjnuyldrrcox.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bm9ja2VucWpudXlsZHJyY294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzYyNzUsImV4cCI6MjA4NzE1MjI3NX0.1c4LhIK2BYMqx8Z1OPLoGII-1R4X0wvglfM1UeYFSEY

# Remote DB JSON 
VITE_DB_CATEGORIES_URL=https://mocki.io/v1/7fe221dc-9496-455c-8240-ffe80befe8e0
VITE_DB_CITIES_URL=https://mocki.io/v1/c5f0912b-8341-4887-80b9-58924e3fc425
VITE_DB_SKILLS_URL=https://mocki.io/v1/aecb5b06-8b9f-4a7d-9947-c41069028f99
VITE_DB_USERS_URL=https://mocki.io/v1/ebd22dc8-4416-48c9-a133-67c224bbcb9a

🧪 ТЕСТИРОВАНИЕ
Юнит-тесты (Jest + React Testing Library)

# Запуск всех тестов
npm test

# Запуск в watch-режиме
npm test -- --watch

# Покрытие кода
npm test -- --coverage


📝 ЗАКЛЮЧЕНИЕ
SkillSwap — это полнофункциональная платформа для обмена навыками, реализованная как современное React-приложение с соблюдением лучших практик разработки:
✅ Feature-Sliced Design — масштабируемая архитектура
✅ Redux Toolkit — предсказуемое управление состоянием
✅ TypeScript — типобезопасность
✅ UI-кит с дизайн-токенами — консистентный интерфейс
✅ Полная поддержка тёмной темы
✅ Адаптивный дизайн
✅ Тестирование ≥ 65% покрытия
✅ CI/CD через GitHub Actions

Проект полностью соответствует требованиям технического задания и готов к демонстрации.

📅 Последнее обновление: Февраль 2025
🔖 Версия: 1.0.0 (релиз)
📧 Контакты: valentina@rudometova.ru
🔗 Демо: https://github.com/PM-YandexPracticum/SkillSwap_45_3