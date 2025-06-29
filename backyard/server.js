import dotenv from "dotenv";
import express from "express";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("database initialization: success");
  } catch (error) {
    console.log("error initializing neon database", error);
    process.exit(1); //1=failure, 0=success
  }
}

app.get("/", (req, res) => {
  res.send("sucess!");
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transaction = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transaction);
    console.log("requested user:", userId);
  } catch (error) {
    console.log("error getting transactions by ID", error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.post("/api/transactions", async (req, res) => {
  // title, amount, category, user_id
  try {
    const { user_id, title, amount, category } = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields required" });
    }
    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *`;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("error creating transaction", error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(typeof id);

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "invalid transaction id" });
    }

    const result = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    console.log("error creating transaction", error);
    res.status(500).json({ message: "internal server error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("server is running on port:", PORT);
  });
});
