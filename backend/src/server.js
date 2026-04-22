import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

// Debug
console.log("Mongo URI:", process.env.MONGO_URI);

// ✅ TEST ROUTE (PUT THIS BEFORE LISTEN)
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});