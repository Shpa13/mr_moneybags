import dotenv from "dotenv";
import express from "express";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql;
  } catch (error) {}
}

app.get("/", (req, res) => {
  res.send("app test; success");
});

app.listen(PORT, () => {
  console.log("server is running on port:", PORT);
});
