const express = require("express");
const { readDB, writeDB } = require("../../db");
const { requireAuth, requireAdmin } = require("../middlewares");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await readDB();
    const safeUsers = db.users.map(({ password, ...rest }) => rest);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await readDB();
    const user = db.users.find(u => u.id === Number(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    const { password, ...safe } = user;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const targetId = Number(req.params.id);
  if (req.caller.role !== "admin" && req.caller.id !== targetId) {
    return res.status(403).json({ error: "Forbidden: cannot edit other users" });
  }
  try {
    const { name, email, role } = req.body;
    const db = await readDB();
    const index = db.users.findIndex(u => u.id === targetId);
    
    if (index === -1) return res.status(404).json({ error: "User not found" });

    if (name) db.users[index].name = name;
    if (email) db.users[index].email = email;
    if (req.caller.role === "admin" && role) db.users[index].role = role;

    await writeDB(db);
    const { password, ...safe } = db.users[index];
    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.users = db.users.filter(u => u.id !== Number(req.params.id));
    await writeDB(db);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
