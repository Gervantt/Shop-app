# Shop App — React + Express

## Структура проекта

```
project/
├── backend/            ← Express сервер (API + JSON база)
│   ├── server.js       ← Все эндпоинты (Auth + CRUD)
│   ├── db.json         ← Файл-база данных
│   └── package.json
├── frontend/           ← React приложение
│   ├── public/
│   ├── src/
│   │   ├── context/    ← AuthContext (React Context)
│   │   ├── components/ ← Navbar
│   │   ├── pages/      ← Login, Register, Products, Categories, Users
│   │   └── styles/     ← Глобальные стили
│   └── package.json
└── README.md
```

## Как запустить

### 1. Backend
```bash
cd backend
npm install
npm start
```
Сервер запустится на http://localhost:5000

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

## Что реализовано (по требованиям)

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
- **Frontend:** React 18, React Router 6, Context API
- **Backend:** Express.js, bcryptjs, JSON file as database
- **Без TypeScript, без Redux** — максимально просто для защиты
