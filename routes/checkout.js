import express from "express";
import { pool } from "../db.js";
import crypto from "crypto";

const router = express.Router();

// --- Créer les tables si besoin ---
async function ensureCheckoutTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      customer_name VARCHAR(120) NULL,
      customer_email VARCHAR(255) NULL,
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      tax DECIMAL(10,2) NOT NULL DEFAULT 0,
      shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      status ENUM('pending','paid','canceled') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      quantity INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      session_token VARCHAR(64) UNIQUE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('created','paid','canceled') NOT NULL DEFAULT 'created',
      card_last4 VARCHAR(4) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
  console.log("✅ Checkout tables ready");
}
ensureCheckoutTables();

// --- Utilitaires taxes + shipping ---
const VAT_RATE = 0.20;
function calcTax(subtotal) { return +(subtotal * VAT_RATE).toFixed(2); }
function calcShipping(subtotal) {
  // Ex: livraison offerte à partir de 60€
  return subtotal >= 60 ? 0 : 4.99;
}

// --- Crée une session de paiement ---
router.post("/create-session", async (req, res) => {
  try {
    const { items = [], customer = {} } = req.body; // items: [{id, qty}], customer:{name,email}
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Empty cart" });
    }

    // Récupère les produits en base pour éviter fraude côté client
    const ids = items.map(it => parseInt(it.id, 10)).filter(Number.isInteger);
    if (ids.length === 0) return res.status(400).json({ success: false, message: "Invalid items" });

    const [rows] = await pool.query(
      `SELECT id, name, price FROM products WHERE id IN (${ids.map(()=>"?").join(",")})`,
      ids
    );

    // Map quantité
    const qtyById = new Map(items.map(it => [parseInt(it.id,10), Math.max(1, parseInt(it.qty||1,10))]));

    // Calcule le subtotal à partir des prix serveur
    let subtotal = 0;
    rows.forEach(p => {
      const q = qtyById.get(p.id) || 1;
      subtotal += Number(p.price) * q;
    });
    subtotal = +subtotal.toFixed(2);
    const tax = calcTax(subtotal);
    const shipping = calcShipping(subtotal);
    const total = +(subtotal + tax + shipping).toFixed(2);

    // Crée la commande
    const [orderRes] = await pool.query(
      "INSERT INTO orders (customer_name, customer_email, subtotal, tax, shipping, total, status) VALUES (?,?,?,?,?,?, 'pending')",
      [customer.name || null, customer.email || null, subtotal, tax, shipping, total]
    );
    const orderId = orderRes.insertId;

    // Ajoute les items
    const values = rows.map(p => {
      const q = qtyById.get(p.id) || 1;
      return [orderId, p.id, p.name, p.price, q];
    });
    if (values.length) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, name, unit_price, quantity) VALUES ?",
        [values]
      );
    }

    // Crée la session de paiement (token)
    const sessionToken = crypto.randomBytes(16).toString("hex");
    await pool.query(
      "INSERT INTO payments (order_id, session_token, amount, status) VALUES (?,?,?, 'created')",
      [orderId, sessionToken, total]
    );

    // URL de la passerelle factice
    const redirectUrl = `/mock-pay.html?session=${sessionToken}`;
    res.json({ success: true, redirectUrl });
  } catch (err) {
    console.error("create-session error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- Récupère l'état de la session pour l'écran de paiement ---
router.get("/session/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const [rows] = await pool.query(
      `SELECT p.session_token, p.status AS payment_status, p.amount,
              o.id AS order_id, o.subtotal, o.tax, o.shipping, o.total, o.status AS order_status,
              o.customer_name, o.customer_email
       FROM payments p
       JOIN orders o ON o.id = p.order_id
       WHERE p.session_token = ?`,
      [token]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Session not found" });
    res.json({ success: true, session: rows[0] });
  } catch (err) {
    console.error("get session error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- “Paiement” simulé ---
router.post("/pay", async (req, res) => {
  try {
    const { session, cardLast4 } = req.body;
    if (!session) return res.status(400).json({ success: false, message: "Missing session" });

    const [rows] = await pool.query(
      `SELECT p.id, p.order_id, p.status FROM payments p WHERE p.session_token=?`,
      [session]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Session not found" });
    const payment = rows[0];
    if (payment.status !== "created") {
      return res.status(400).json({ success: false, message: "Payment already processed" });
    }

    await pool.query("UPDATE payments SET status='paid', card_last4=? WHERE id=?", [cardLast4 || null, payment.id]);
    await pool.query("UPDATE orders SET status='paid' WHERE id=?", [payment.order_id]);

    res.json({ success: true, orderId: payment.order_id });
  } catch (err) {
    console.error("pay error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- Annuler la session ---
router.post("/cancel", async (req, res) => {
  try {
    const { session } = req.body;
    const [rows] = await pool.query("SELECT id, order_id FROM payments WHERE session_token=?", [session]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Session not found" });

    await pool.query("UPDATE payments SET status='canceled' WHERE id=?", [rows[0].id]);
    await pool.query("UPDATE orders SET status='canceled' WHERE id=?", [rows[0].order_id]);

    res.json({ success: true });
  } catch (err) {
    console.error("cancel error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
