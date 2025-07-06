import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

//create the sql connection to neon prosgresql
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
      due_date DATE NOT NULL DEFAULT CURRENT_DATE
      )`;
    console.log("database initialization: success");
  } catch (error) {
    console.log("error initializing neon database", error);
    process.exit(1); //1=failure, 0=success
  }
}
