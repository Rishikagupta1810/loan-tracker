import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  amount: {
    type: Number,
    required: true
  },

  interest: {
    type: Number,
    required: true
  },

  duration: {
    type: Number,
    required: true
  },

  reason: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Loan", loanSchema);