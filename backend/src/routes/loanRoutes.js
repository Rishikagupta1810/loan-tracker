import express from "express";
import {
  createLoan,
  getLoans,
  deleteLoan,
  updateLoan
} from "../controllers/loanController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE + GET
router.route("/")
  .post(protect, createLoan)
  .get(protect, getLoans);

// DELETE + UPDATE  ✅ IMPORTANT
router.route("/:id")
  .delete(protect, deleteLoan)
  .put(protect, updateLoan);

export default router;