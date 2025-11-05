import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./db.js";
import productsRoutes from "./routes/products.js";
import usersRoutes from "./routes/users.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Dice Spot running on http://localhost:${PORT}`));
