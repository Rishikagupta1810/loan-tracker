import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  addExpense,
  getExpenses,
  getExpensesByLoan,
  deleteExpense,
  getAllExpensesAdmin,
  updateExpenseStatus
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), addExpense);
router.get("/", protect, getExpenses);
router.get("/loan/:loanId", protect, getExpensesByLoan);
router.delete("/:id", protect, deleteExpense);

router.get("/admin/all", protect, adminMiddleware, getAllExpensesAdmin);
router.put("/:id/status", protect, adminMiddleware, updateExpenseStatus);

export default router;