const express = require("express");
const fs = require("fs");
const path = require("path");
const { readDB, writeDB } = require("../../db");
const { requireAuth, requireAdmin } = require("../middlewares");
const upload = require("../upload");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await readDB();
    const productsWithCategory = db.products.map(p => ({
      ...p,
      category: db.categories.find(c => c.id === p.categoryId)
    }));
    res.json(productsWithCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await readDB();
    const product = db.products.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    product.category = db.categories.find(c => c.id === product.categoryId);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/", requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, categoryId, stock } = req.body;
    const db = await readDB();
    const id = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newProduct = {
      id,
      name,
      price: Number(price),
      description,
      categoryId: Number(categoryId),
      stock: Number(stock) || 0,
      image: imageUrl
    };
    
    db.products.push(newProduct);
    await writeDB(db);
    
    newProduct.category = db.categories.find(c => c.id === newProduct.categoryId);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/:id", requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, categoryId, stock } = req.body;
    const db = await readDB();
    const index = db.products.findIndex(p => p.id === Number(req.params.id));
    
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    
    if (name) db.products[index].name = name;
    if (price) db.products[index].price = Number(price);
    if (description !== undefined) db.products[index].description = description;
    if (categoryId) db.products[index].categoryId = Number(categoryId);
    if (stock !== undefined) db.products[index].stock = Number(stock);
    
    if (req.file) {
      // Delete old image if it exists and is a local file
      if (db.products[index].image && db.products[index].image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../..', db.products[index].image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      db.products[index].image = `/uploads/${req.file.filename}`;
    }
    
    await writeDB(db);
    const updated = { ...db.products[index], category: db.categories.find(c => c.id === db.products[index].categoryId) };
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.products = db.products.filter(p => p.id !== Number(req.params.id));
    await writeDB(db);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
