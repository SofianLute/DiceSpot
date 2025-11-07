import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import checkoutRoutes from "./routes/checkout.js"; 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


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


app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", checkoutRoutes); 


app.get("/", (req, res) => {
  res.send("<h1>✅ Dice Spot backend is running</h1>");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Dice Spot running on http://localhost:${PORT}`));
