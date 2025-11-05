import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE username=? AND password=?", [username, password]);
  if (rows.length > 0) {
    res.json({ success: true, role: rows[0].role });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: "Username already exists" });
  }
});

export default router;
