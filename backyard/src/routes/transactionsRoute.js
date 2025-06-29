import express from "express";
import {
  deleteTransaction,
  getTransactionsByUserId,
  getTransactionSummary,
  postTransactions,
} from "../controllers/transactionsController.js";

const router = express.Router();

// fetch transactions by user_id
router.get("/:userId", getTransactionsByUserId);

// create a transaction api
router.post("/", postTransactions);

// delete a transaction
router.delete("/:id", deleteTransaction);

// get transactions summary
router.get("/summary/:userId", getTransactionSummary);

export default router;
