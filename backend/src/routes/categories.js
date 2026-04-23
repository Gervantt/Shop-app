const express = require("express");
const { readDB, writeDB } = require("../../db");
const { requireAuth, requireAdmin } = require("../middlewares");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await readDB();
    const category = db.categories.find(c => c.id === Number(req.params.id));
    if (!category) return res.status(404).json({ error: "Category not found" });
    
    const products = db.products.filter(p => p.categoryId === category.id);
    res.json({ ...category, products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const db = await readDB();
    const id = db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1;
    
    const newCategory = { id, name, description };
    db.categories.push(newCategory);
    await writeDB(db);
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const db = await readDB();
    const index = db.categories.findIndex(c => c.id === Number(req.params.id));
    
    if (index === -1) return res.status(404).json({ error: "Category not found" });
    
    if (name) db.categories[index].name = name;
    if (description !== undefined) db.categories[index].description = description;
    
    await writeDB(db);
    res.json(db.categories[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.categories = db.categories.filter(c => c.id !== Number(req.params.id));
    await writeDB(db);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;
