import express from "express";
import { pool } from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// create user table if not exists
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
ensureUserTable();

// register new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // check if all fields are filled
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "⚠️ All fields required" });
  }

  try {
    // hash the password before saving
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    res.json({ success: true, message: "✅ Account created successfully!" });
  } catch (err) {
    // check if username already exists
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ success: false, message: "⚠️ Username already exists" });
    } else {
      console.error("Register error:", err);
      res.status(500).json({ success: false, message: "❌ Server error" });
    }
  }
});

// login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // find user in database
    const [rows] = await pool.query("SELECT * FROM users WHERE username=?", [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "❌ Invalid username or password" });
    }

    const user = rows[0];

    // compare password (hashed or plain if old account)
    const match =
      user.password.length < 60
        ? user.password === password
        : await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: "❌ Invalid username or password" });
    }

    // return basic user info (no password)
    res.json({
      success: true,
      message: "✅ Login successful",
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "❌ Server error" });
  }
});

// update password (from profile page)
router.post("/update", async (req, res) => {
  const { username, newPassword } = req.body;

  // check inputs
  if (!username || !newPassword) {
    return res.status(400).json({ success: false, message: "⚠️ Missing username or new password" });
  }

  try {
    // hash new password and update in db
    const hashed = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query("UPDATE users SET password=? WHERE username=?", [hashed, username]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "❌ User not found" });
    }

    res.json({ success: true, message: "✅ Password updated successfully!" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "❌ Database error" });
  }
});

export default router;
