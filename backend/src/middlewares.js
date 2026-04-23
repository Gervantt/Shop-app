const jwt = require("jsonwebtoken");
const { readDB } = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = await readDB();
    const caller = db.users.find(u => u.id === decoded.id);
    if (!caller) return res.status(401).json({ error: "User not found" });
    req.caller = caller;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.caller.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: admin only" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
