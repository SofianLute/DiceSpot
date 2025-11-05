import express from "express";
import { pool } from "../db.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, total } = req.body;
  await pool.query("INSERT INTO orders (user_id, total) VALUES (?, ?)", [userId, total]);
  res.json({ message: "Order created successfully" });
});

export default router;
