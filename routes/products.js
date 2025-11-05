import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products");
  res.json(rows);
});

// POST new product (admin)
router.post("/", async (req, res) => {
  const { name, category, price, description, image } = req.body;
  await pool.query("INSERT INTO products (name, category, price, description, image) VALUES (?, ?, ?, ?, ?)",
    [name, category, price, description, image]);
  res.json({ message: "Product added" });
});

// DELETE product by ID (admin)
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=?", [req.params.id]);
  res.json({ message: "Product deleted" });
});

export default router;
