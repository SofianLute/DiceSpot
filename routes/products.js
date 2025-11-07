import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// get all products
router.get("/", async (req, res) => {
  // fetch everything from products table
  const [rows] = await pool.query("SELECT * FROM products");
  res.json(rows);
});

// add a new product (admin only)
router.post("/", async (req, res) => {
  const { name, category, price, description, image } = req.body;
  // insert new product into database
  await pool.query(
    "INSERT INTO products (name, category, price, description, image) VALUES (?, ?, ?, ?, ?)",
    [name, category, price, description, image]
  );
  res.json({ message: "Product added" });
});

// delete product by id (admin only)
router.delete("/:id", async (req, res) => {
  // remove the product with given id
  await pool.query("DELETE FROM products WHERE id=?", [req.params.id]);
  res.json({ message: "Product deleted" });
});

export default router;
