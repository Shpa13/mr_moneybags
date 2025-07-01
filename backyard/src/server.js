import dotenv from "dotenv";
import express from "express";
//import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

// checks for deplyment, pings server to keep alive
if (process.env.NODE_ENV === "production") job.start();

app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/api/healthcheck", (req, res) => {
  res.send("lub-dub...lub-dub...sucess!");
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("server is running on port:", PORT);
  });
});
