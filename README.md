# Shop App — React + Express + Prisma + PostgreSQL

## Описание

Полнофункциональный веб-магазин с аутентификацией, управлением товарами и категориями.

- **Frontend** — React с контекстом авторизации
- **Backend** — Express API с Prisma ORM
- **База данных** — PostgreSQL (Supabase)
- **Аутентификация** — bcrypt + хеширование паролей

## Структура проекта

```
project/
├── backend/                    ← REST API (Express + Prisma)
│   ├── src/
│   │   ├── index.js            ← Главный файл сервера (все эндпоинты)
│   │   ├── seed.js             ← Инициализация БД с данными
│   │   └── routes/             ← Будущее расширение маршрутов
│   ├── prisma/
│   │   ├── schema.prisma       ← Схема БД (User, Category, Product)
│   │   └── migrations/         ← История изменений БД
│   ├── .env                    ← Переменные окружения
│   ├── package.json
│   ├── README.md               ← Документация бэкенда
│   └── prisma.config.ts        ← Конфиг Prisma
│
├── frontend/                   ← React приложение
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── context/
│   │   │   └── AuthContext.js  ← Контекст авторизации
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── pages/              ← Страницы приложения
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── CategoriesPage.js
│   │   │   ├── UsersPage.js
│   │   │   └── *PageName.css
│   │   ├── styles/
│   │   │   └── global.css
│   │   └── ... другие компоненты
│   └── package.json
└── README.md
```

## Быстрый старт

### 1. Backend (важно выполнить первым!)

```bash
cd backend
npm install

# Сгенерировать Prisma Client
npx prisma generate

# Запустить сервер
npm start
```

Сервер запустится на **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm start
```
Приложение откроется на http://localhost:3000

## Тестовый аккаунт
- **Email:** admin@mail.com
- **Password:** admin123

---

## API Endpoints

Документация всех эндпоинтов в [backend/README.md](backend/README.md)

Основные группы:
- `/api/register`, `/api/login` — Аутентификация
- `/api/users` — CRUD пользователей  
- `/api/categories` — CRUD категорий
- `/api/products` — CRUD товаров

---

## Что реализовано

### ✅ 1. Регистрация и аутентификация с хешированием пароля
- `POST /api/register` — bcrypt.hash(password, 10) хеширует пароль
- `POST /api/login` — bcrypt.compare() сравнивает пароль с хешом
- AuthContext хранит залогиненного пользователя через React Context

### ✅ 2. Минимум 3 таблицы на бэкенде
- `users` — пользователи
- `categories` — категории товаров
- `products` — товары

### ✅ 3. One-to-many связь
- **Category → Products** (categoryId в products ссылается на categories)
- На странице Categories кнопка "Products" показывает товары категории

### ✅ 4. Полный CRUD для каждой таблицы
| Операция      | Users | Categories | Products |
|---------------|-------|------------|----------|
| Create        | Register | ✅ | ✅ |
| Read All      | ✅ | ✅ | ✅ |
| Read One (ID) | ✅ (View btn) | ✅ | ✅ |
| Update        | ✅ | ✅ | ✅ |
| Delete        | ✅ | ✅ (cascade) | ✅ |

### ✅ 5. Routing (react-router-dom)
- `/login`, `/register` — публичные
- `/products`, `/categories`, `/users` — защищённые (редирект если не залогинен)

### ✅ 6. Context (React Context API)
- `AuthContext` — хранит user, login(), register(), logout()
- Оборачивает всё приложение через AuthProvider

### ✅ 7. Отдельные CSS файлы на каждую страницу
- LoginPage.css, RegisterPage.css, ProductsPage.css, CategoriesPage.css, UsersPage.css, Navbar.css

---

## Технологии

### Backend
- **Express.js** — Web-фреймворк
- **Prisma** — ORM для работы с БД (v7.6.0)
- **PostgreSQL** — БД через Supabase
- **bcryptjs** — Хеширование паролей
- **CORS** — Кросс-доменные запросы
- **dotenv** — Переменные окружения

### Frontend
- **React 18** — UI фреймворк
- **React Router 6** — Навигация между страницами
- **Context API** — Управление состоянием авторизации
- **CSS3** — Стили (отдельный файл на каждую компоненту)
