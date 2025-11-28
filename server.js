import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import checkoutRoutes from "./routes/checkout.js"; 

const app = express();
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON from requests
app.use(express.static("public")); // serve static files from /public

// create products table if not exists
async function ensureProductTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      price DECIMAL(10,2),
      image VARCHAR(255)
    )
  `);
  console.log("✅ Table 'products' ready");
}

// create users table if not exists
async function ensureUserTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user','admin') DEFAULT 'user'
    )
  `);
  console.log("✅ Table 'users' ready");
}

await ensureProductTable();
await ensureUserTable();

// connect routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", checkoutRoutes); 

// simple home route
app.get("/", (req, res) => {
  res.send("<h1>✅ Dice Spot backend is running</h1>");
});

// start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Dice Spot running on http://localhost:${PORT}`));
