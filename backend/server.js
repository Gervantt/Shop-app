const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ==================== Helpers ====================

const DB_PATH = path.join(__dirname, "db.json");

// Читаем БД из файла
function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

// Записываем БД в файл
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Генерируем следующий ID для массива
function nextId(arr) {
  if (arr.length === 0) return 1;
  return Math.max(...arr.map((item) => item.id)) + 1;
}

// ==================== AUTH ====================

// Регистрация — пароль хешируется через bcrypt
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  // Проверяем, не занят ли email
  if (db.users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Хешируем пароль (10 раундов)
  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: nextId(db.users),
    name,
    email,
    password: hashed,
    role: "user",
  };

  db.users.push(newUser);
  writeDB(db);

  // Возвращаем пользователя без пароля
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});

// Логин — сравниваем пароль с хешом
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // bcrypt.compare сравнивает plain-text с хешом
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const { password: _, ...safe } = user;
  res.json(safe);
});

// ==================== USERS CRUD ====================

// Read all
app.get("/api/users", (req, res) => {
  const db = readDB();
  // Не отправляем пароли на фронт
  const safe = db.users.map(({ password, ...rest }) => rest);
  res.json(safe);
});

// Read one by ID
app.get("/api/users/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password, ...safe } = user;
  res.json(safe);
});

// Update
app.put("/api/users/:id", async (req, res) => {
  const db = readDB();
  const idx = db.users.findIndex((u) => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "User not found" });

  const { name, email, password, role } = req.body;
  if (name) db.users[idx].name = name;
  if (email) db.users[idx].email = email;
  if (role) db.users[idx].role = role;
  if (password) db.users[idx].password = await bcrypt.hash(password, 10);

  writeDB(db);
  const { password: _, ...safe } = db.users[idx];
  res.json(safe);
});

// Delete
app.delete("/api/users/:id", (req, res) => {
  const db = readDB();
  db.users = db.users.filter((u) => u.id !== Number(req.params.id));
  writeDB(db);
  res.json({ message: "User deleted" });
});

// ==================== CATEGORIES CRUD ====================

// Read all
app.get("/api/categories", (req, res) => {
  const db = readDB();
  res.json(db.categories);
});

// Read one by ID
app.get("/api/categories/:id", (req, res) => {
  const db = readDB();
  const cat = db.categories.find((c) => c.id === Number(req.params.id));
  if (!cat) return res.status(404).json({ error: "Category not found" });
  res.json(cat);
});

// Create
app.post("/api/categories", (req, res) => {
  const db = readDB();
  const newCat = {
    id: nextId(db.categories),
    name: req.body.name,
    description: req.body.description || "",
  };
  db.categories.push(newCat);
  writeDB(db);
  res.status(201).json(newCat);
});

// Update
app.put("/api/categories/:id", (req, res) => {
  const db = readDB();
  const idx = db.categories.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Category not found" });

  if (req.body.name) db.categories[idx].name = req.body.name;
  if (req.body.description !== undefined)
    db.categories[idx].description = req.body.description;

  writeDB(db);
  res.json(db.categories[idx]);
});

// Delete
app.delete("/api/categories/:id", (req, res) => {
  const db = readDB();
  db.categories = db.categories.filter(
    (c) => c.id !== Number(req.params.id)
  );
  // Удаляем продукты этой категории (каскадное удаление)
  db.products = db.products.filter(
    (p) => p.categoryId !== Number(req.params.id)
  );
  writeDB(db);
  res.json({ message: "Category deleted" });
});

// ==================== PRODUCTS CRUD ====================

// Read all (можно фильтровать по categoryId через query)
app.get("/api/products", (req, res) => {
  const db = readDB();
  let products = db.products;
  if (req.query.categoryId) {
    products = products.filter(
      (p) => p.categoryId === Number(req.query.categoryId)
    );
  }
  res.json(products);
});

// Read one by ID
app.get("/api/products/:id", (req, res) => {
  const db = readDB();
  const prod = db.products.find((p) => p.id === Number(req.params.id));
  if (!prod) return res.status(404).json({ error: "Product not found" });
  res.json(prod);
});

// Create
app.post("/api/products", (req, res) => {
  const db = readDB();
  const newProd = {
    id: nextId(db.products),
    name: req.body.name,
    price: Number(req.body.price),
    categoryId: Number(req.body.categoryId),
    description: req.body.description || "",
  };
  db.products.push(newProd);
  writeDB(db);
  res.status(201).json(newProd);
});

// Update
app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  if (req.body.name) db.products[idx].name = req.body.name;
  if (req.body.price !== undefined)
    db.products[idx].price = Number(req.body.price);
  if (req.body.categoryId)
    db.products[idx].categoryId = Number(req.body.categoryId);
  if (req.body.description !== undefined)
    db.products[idx].description = req.body.description;

  writeDB(db);
  res.json(db.products[idx]);
});

// Delete
app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  db.products = db.products.filter((p) => p.id !== Number(req.params.id));
  writeDB(db);
  res.json({ message: "Product deleted" });
});

// ==================== START ====================

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
