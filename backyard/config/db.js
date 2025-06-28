import { neon } from "@neondatabase/serverless";
import "dotenv/config";

//create the sql connection to neon prosgresql
export const sql = neon(process.env.DATABASE_URL);
