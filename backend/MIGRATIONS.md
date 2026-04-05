# Миграции Prisma

## Текущий статус

✅ Схема БД создана в `prisma/schema.prisma`

✅ Файл миграции подготовлен в `prisma/migrations/init/migration.sql`

⏳ Миграция еще не применена к Supabase (нужен доступ к БД)

## Как применить миграцию

Когда Supabase будет доступна:

```bash
# Применить миграцию
npm run migrate

# Или вручную
npx prisma migrate dev --name init
```

## Структура БД

### Users
```
id: Integer (Primary Key, Auto Increment)
email: String (Unique)
name: String
password: String (bcrypt hash)
role: String (default: "user")
createdAt: DateTime (default: now)
updatedAt: DateTime
```

### Categories
```
id: Integer (Primary Key, Auto Increment)
name: String
description: String (nullable)
products: Product[] (One-to-Many relation)
createdAt: DateTime
updatedAt: DateTime
```

### Products
```
id: Integer (Primary Key, Auto Increment)
name: String
price: Float
description: String (nullable)
categoryId: Integer (Foreign Key → Category)
category: Category (Relation)
createdAt: DateTime
updatedAt: DateTime
```

## Тестирование

После применения миграции можно заполнить БД тестовыми данными:

```bash
npm run seed
```

Это создаст:
- 2 пользователей (admin и user)
- 2 категории (Electronics, Clothing)
- 3 товара

## Откат миграции

Если нужно откатить миграцию:

```bash
npx prisma migrate resolve --rolled-back init
```

Затем скорректировать схему и создать новую миграцию:

```bash
npx prisma migrate dev --name correction
```
