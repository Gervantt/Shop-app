# API Backend

Простой REST API сервер с использованием Express, Prisma и PostgreSQL (Supabase).

## Установка и запуск

### 1. Настройка переменных окружения

Скопируй `.env.example` в `.env` и заполни переменные:

```bash
cp .env.example .env
```

В `.env` должны быть:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=5000
```

Для Supabase DATABASE_URL предоставляется в настройках проекта.

### 2. Инициализация базы данных

Примени миграции:
```bash
npm run migrate
```

Заполни базу тестовыми данными (категории, продукты, пользователей):
```bash
npm run seed
```

### 3. Запуск сервера

```bash
npm start
```

Сервер запустится на `http://localhost:5000`

## Endpoints API

### Аутентификация
- `POST /api/register` - Регистрация нового пользователя
- `POST /api/login` - Вход в систему

### Пользователи
- `GET /api/users` - Все пользователи
- `GET /api/users/:id` - Один пользователь
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Категории
- `GET /api/categories` - Все категории
- `GET /api/categories/:id` - Одна категория (с продуктами)
- `POST /api/categories` - Создать категорию
- `PUT /api/categories/:id` - Обновить категорию
- `DELETE /api/categories/:id` - Удалить категорию

### Продукты
- `GET /api/products` - Все продукты
- `GET /api/products/:id` - Один продукт
- `POST /api/products` - Создать продукт
- `PUT /api/products/:id` - Обновить продукт
- `DELETE /api/products/:id` - Удалить продукт

## Структура проекта

```
backend/
├── src/
│   ├── index.js          # Главный файл сервера
│   └── seed.js           # Инициализация БД
├── prisma/
│   ├── schema.prisma     # Схема БД
│   └── migrations/       # Файлы миграций
├── .env                  # Переменные окружения (не коммитить!)
├── .env.example          # Шаблон .env
└── package.json          # Зависимости
```

## Примеры запросов

### Регистрация
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@mail.com","password":"123456"}'
```

### Логин
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@mail.com","password":"123456"}'
```

### Получить все продукты
```bash
curl http://localhost:5000/api/products
```

### Создать категорию
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Books","description":"All kinds of books"}'
```

## Зависимости

- **express** - Web-framework
- **cors** - Разрешение кросс-доменных запросов
- **bcryptjs** - Хеширование паролей
- **@prisma/client** - ORM для работы с БД
- **prisma** - CLI для миграций
- **dotenv** - Загрузка переменных окружения
