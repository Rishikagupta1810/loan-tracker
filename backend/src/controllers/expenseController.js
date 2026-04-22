import Expense from "../models/Expense.js";
import Loan from "../models/loan.js";

// Add expense
export const addExpense = async (req, res) => {
  try {
    const { loan, amount, description, latitude, longitude } = req.body;

    const loanExists = await Loan.findById(loan);

    if (!loanExists) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const expense = await Expense.create({
      user: req.user._id,
      loan,
      amount,
      description,
      image,
      location: {
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      },
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).populate(
      "loan",
      "amount reason status"
    );

    res.json(expenses);
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get expenses by loan
export const getExpensesByLoan = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
      loan: req.params.loanId,
    }).populate("loan", "amount reason status");

    res.json(expenses);
  } catch (error) {
    console.error("GET EXPENSES BY LOAN ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Update expense status
export const updateExpenseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.status = status;
    await expense.save();

    res.json({
      message: "Status updated",
      expense
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: get all expenses
export const getAllExpensesAdmin = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("user", "name email")
      .populate("loan", "amount reason");

    res.json(expenses);
  } catch (error) {
    console.error("ADMIN GET EXPENSES ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

