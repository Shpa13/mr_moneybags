import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
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
}
console.log("✅ Controller module loaded");
export async function postTransactions(req, res) {
  console.error("test");
  process.stdout.write("🪵 postTransactions running\n");

  // title, amount, category, user_id, transaction_date, due_date(for upcoming expenses)
  try {
    const { user_id, title, amount, category, transaction_date, due_date } =
      req.body;
    console.error("request body:", req.body);
    if (
      !title ||
      !user_id ||
      !category ||
      !transaction_date ||
      !due_date ||
      amount === undefined
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    // type fix transaction and due dates
    const parsedTransactionDate = new Date(transaction_date);
    const parsedDueDate = new Date(due_date);

    if (
      isNaN(parsedTransactionDate.getTime()) ||
      isNaN(parsedDueDate.getTime())
    ) {
      console.log(parsedTransactionDate);
      return res.status(400).json({ message: "Invalid date format" });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category, transaction_date, due_date)
        VALUES (${user_id},${title},${amount},${category},${transaction_date}::date,${parsedDueDate}::date)
        RETURNING *`;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("error creating transaction", error);
    res.status(500).json({ message: "internal server error" });
  } finally {
    console.log(req.body);
  }
}

export async function deleteTransaction(req, res) {
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
    console.log("error deleteing transaction", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getTransactionSummary(req, res) {
  try {
    const { userId } = req.params;
    const [{ balance }] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
      `;

    const [{ income }] = await sql`
      SELECT COALESCE(SUM(amount), 0 ) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
       `;

    const [{ expenses }] = await sql`
      SELECT COALESCE(SUM(amount), 0 ) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
       `;
    // add logic to select nearest due_date to list into summary info "next due date"
    res.status(200).json({
      balance,
      income,
      expenses,
    });
  } catch (error) {
    console.log("error creating transaction", error);
    res.status(500).json({ message: "internal server error" });
  }
}
