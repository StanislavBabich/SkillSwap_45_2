# SkillSwap — Платформа обмена навыками

Полнофункциональное приложение для обмена навыками между пользователями. Позволяет публиковать навыки двух типов: «Я научу» и «Хочу научиться», находить взаимные интересы, отправлять заявки на обмен.

## 🏗️ Архитектура

Проект состоит из двух частей:
SkillSwap/
├── backend/ # NestJS API (TypeORM + PostgreSQL)
├── frontend/ # React SPA (Redux Toolkit + TypeScript)
└── README.md


## 🚀 Быстрый старт

### Требования
- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Бекенд
cd backend
npm install
cp .env.example .env   # заполнить настройки БД и JWT
npm run seed:categories
npm run seed:admin
npm run seed:users
npm run seed:skills
npm run start:dev       # http://localhost:3000
Swagger: http://localhost:3000/api/docs

### Фронтенд
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api
npm run dev             # http://localhost:5173

💻 Технологический стек
Backend	
NestJS, TypeORM, PostgreSQL, JWT, Swagger, Winston

Frontend	
React 19, TypeScript, Redux Toolkit, React Router, Vite

UI	
Собственный UI-кит (17+ компонентов), CSS Modules, DiceBear

Качество	
ESLint, Prettier, Jest, Supertest, Conventional Commits

CI/CD	GitHub Actions

✨ Основные возможности
🔐 Регистрация и авторизация (JWT access + refresh токены)
📝 Создание навыков с загрузкой изображений
🔍 Поиск и фильтрация по категориям, городу, полу, типу навыка
👤 Профиль пользователя с редактированием данных
🎨 Категории с древовидной структурой и цветными тегами
❤️ Избранное — сохранение интересных навыков
🌓 Тёмная тема — переключатель, CSS-переменные
📱 Адаптивный дизайн — сетка 3/2/1 колонки

📁 Структура бекенда
text
backend/src/
├── auth/             # Аутентификация (JWT, гарды, стратегии)
├── users/            # Пользователи (CRUD, профиль, избранное)
├── skills/           # Навыки (CRUD, поиск, пагинация)
├── categories/       # Категории (дерево, CRUD для админа)
├── requests/         # Заявки на обмен
├── files/            # Загрузка изображений
├── notifications/    # WebSocket-уведомления
├── seeding/          # Сидирование начальных данных
├── common/           # Фильтры ошибок, middleware, утилиты
└── config/           # Конфигурация приложения

📁 Структура фронтенда (FSD)
text
frontend/src/
├── app/              # Store, Router, Providers, стили
├── entities/         # Бизнес-сущности (User, Skill, Category)
├── features/         # Бизнес-логика (auth, filters, users, skills)
├── widgets/          # Композитные блоки (Header, FiltersBar, SkillCard)
├── pages/            # Страницы (Home, Profile, Skill, Login, Register)
└── shared/           # Переиспользуемый код (UI-kit, хуки, утилиты)

🧪 Тестирование
# Бекенд
cd backend
npm run test           # unit-тесты
npm run test:e2e       # e2e-тесты
npm run test:cov       # покрытие

# Фронтенд
cd frontend
npm test               # unit-тесты

🔗 Полезные ссылки
API: http://localhost:3000/api
Swagger: http://localhost:3000/api/docs
Фронтенд: http://localhost:5173

👥 Команда
Проект выполнен в рамках обучения в Яндекс.Практикуме.

📅 Статус
В активной разработке. Текущая версия: MVP.