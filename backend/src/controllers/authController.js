import User from "../models/user.js";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered. Please login instead." });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already registered. Please login instead." });
    } else {
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email. Please register first." });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};