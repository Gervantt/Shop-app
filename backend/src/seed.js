const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Инициализация базы данных...");

  // Очищаем существующие данные
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Создаем категории
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Phones, laptops, gadgets",
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing",
      description: "Shirts, pants, shoes",
    },
  });

  console.log("Категории созданы", { electronics, clothing });

  // Создаем продукты
  await prisma.product.create({
    data: {
      name: "iPhone 15",
      price: 999,
      description: "Latest Apple phone",
      categoryId: electronics.id,
    },
  });

  await prisma.product.create({
    data: {
      name: "MacBook Pro",
      price: 1999,
      description: "Apple laptop",
      categoryId: electronics.id,
    },
  });

  await prisma.product.create({
    data: {
      name: "Nike T-Shirt",
      price: 35,
      description: "Cotton t-shirt",
      categoryId: clothing.id,
    },
  });

  console.log("Продукты созданы");

  // Создаем пользователей
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@mail.com",
      password: adminPassword,
      role: "admin",
    },
  });

  await prisma.user.create({
    data: {
      name: "Gervant",
      email: "Gervanttr@gmail.com",
      password: userPassword,
      role: "user",
    },
  });

  console.log("Пользователи созданы");
  console.log("База данных инициализирована!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
