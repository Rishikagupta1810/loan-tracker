import Loan from "../models/loan.js";
import Expense from "../models/Expense.js";

// CREATE LOAN
export const createLoan = async (req, res) => {
  try {
    const { amount, interest, duration, reason } = req.body;

    const loan = new Loan({
      user: req.user._id,
      amount,
      interest,
      duration,
      reason,
      status: "pending",
    });

    const savedLoan = await loan.save();

    res.status(201).json({
      message: "Loan created successfully",
      loan: savedLoan,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL LOANS
export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id });
    res.json(loans);
  } catch (error) {
    console.error("GET ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE LOAN + RELATED EXPENSES
export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    await Expense.deleteMany({ loan: req.params.id });
    await loan.deleteOne();

    res.json({ message: "Loan and related expenses deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE LOAN
export const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.amount = req.body.amount || loan.amount;
    loan.interest = req.body.interest || loan.interest;
    loan.duration = req.body.duration || loan.duration;
    loan.reason = req.body.reason || loan.reason;

    const updatedLoan = await loan.save();

    res.json({
      message: "Loan updated successfully",
      loan: updatedLoan,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};