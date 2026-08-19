const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/users", userRoutes);
app.use(
cors({origin: "http://localhost:5173", credentials: true,}));
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
console.log("✅ MongoDB connected");})
  .catch((error) => {
console.error("❌ MongoDB connection failed:", error.message);});
app.get("/", (req, res) => {
res.json({
    success: true,
    message:"Game backend is running!",});});
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
console.log(`🚀 Backend running on http://localhost:${PORT}`);
console.log(`🔌 Socket.IO running on http://localhost:${PORT}`);});