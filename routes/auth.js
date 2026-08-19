const express = require("express");
const { register, login,} = require("../controllers/authController");
const { protect,} = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();
router.post( "/register", register);
router.post( "/login", login);
router.get( "/me", protect, async (req, res) => { try {
const user = await User.findById( req.user.userId).select( "-password"); if (!user) {
return res.status(404).json({ success: false, message:"User not found.",});}
return res.status(200).json({ success: true,
user: { id: user._id, username: user.username,
email: user.email, },});} catch (error) { console.error("Get current user error:", error);
return res.status(500).json({ success: false, message: "Server error.",});}});
router.post("/logout", protect, (req, res) => {
return res.status(200).json({ success: true, message:"Logout successful.",});});
module.exports = router;