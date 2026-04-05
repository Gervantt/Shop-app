require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// Reads X-User-Id header, fetches the user from DB, attaches to req.caller
async function requireAuth(req, res, next) {
  const userId = Number(req.headers["x-user-id"]);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  const caller = await prisma.user.findUnique({ where: { id: userId } });
  if (!caller) return res.status(401).json({ error: "User not found" });
  req.caller = caller;
  next();
}

function requireAdmin(req, res, next) {
  if (req.caller.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: admin only" });
  }
  next();
}

app.use(cors());
app.use(express.json());

// ==================== AUTH ROUTES ====================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверяем, не существует ли уже пользователь
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Хешируем пароль
    const hashed = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "user",
      },
    });

    // Возвращаем без пароля
    const { password: _, ...safe } = user;
    res.status(201).json(safe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...safe } = user;
    res.json(safe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ==================== USERS ROUTES ====================

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.put("/api/users/:id", requireAuth, async (req, res) => {
  const targetId = Number(req.params.id);
  // Users can only edit their own account; admins can edit anyone
  if (req.caller.role !== "admin" && req.caller.id !== targetId) {
    return res.status(403).json({ error: "Forbidden: cannot edit other users" });
  }
  try {
    const { name, email, role } = req.body;
    // Non-admins cannot change roles
    const data = req.caller.role === "admin"
      ? { name, email, role }
      : { name, email };

    const user = await prisma.user.update({
      where: { id: targetId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ==================== CATEGORIES ROUTES ====================

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/categories/:id", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
      include: { products: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

app.post("/api/categories", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.put("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ==================== PRODUCTS ROUTES ====================

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        categoryId: Number(categoryId),
      },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        price: Number(price),
        description,
        categoryId: Number(categoryId),
      },
      include: { category: true },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
