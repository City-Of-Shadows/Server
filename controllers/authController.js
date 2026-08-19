const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
function createToken(user) { return jwt.sign({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,},
process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "7d",});}
async function register(req, res) { try {
const { username, email, password } = req.body;
const cleanUsername = username?.trim();
const cleanEmail = email?.trim().toLowerCase();
if (!cleanUsername || !cleanEmail || !password) {
return res.status(400).json({ success: false, message: "Please fill in all fields.",});}
if (cleanUsername.length < 3) {
return res.status(400).json({ success: false, message: "Username must be at least 3 characters.",});}
if (cleanUsername.length > 20) {
return res.status(400).json({ success: false, message: "Username cannot exceed 20 characters.",});}
if (password.length < 6) {
return res.status(400).json({ success: false, message: "Password must be at least 6 characters.",});}
const existingUsername = await User.findOne({ username: cleanUsername,});
if (existingUsername) { return res.status(409).json({ success: false, message: "Username is already taken.",});}
const existingEmail = await User.findOne({ email: cleanEmail,});
if (existingEmail) { return res.status(409).json({ success: false, message: "Email is already registered.",});}
const hashedPassword = await bcrypt.hash(password, 12);
const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,});
const token = createToken(user);
return res.status(201).json({ success: true, message: "Account created successfully.", token, user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience,
        coins: user.coins,},});} 
catch (error) { console.error("Register error:", error);
return res.status(500).json({ success: false, message: "Server error while creating account.",});}}
async function login(req, res) {try {
const { email, password } = req.body;
const cleanEmail = email?.trim().toLowerCase(); if (!cleanEmail || !password) {
return res.status(400).json({ success: false, message: "Email and password are required.",});}
const user = await User.findOne({ email: cleanEmail,}).select("+password"); if (!user) {
return res.status(401).json({ success: false, message: "Invalid email or password.",});} if (!user.isActive) {
return res.status(403).json({ success: false, message: "This account has been disabled.",});}
const passwordMatch = await bcrypt.compare( password, user.password);if (!passwordMatch) {
return res.status(401).json({ success: false, message: "Invalid email or password.",});}
const token = createToken(user); return res.json({ success: true, message: "Login successful.", token, user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience,
        coins: user.coins,},});} 
catch (error) { console.error("Login error:", error);
return res.status(500).json({ success: false, message: "Server error while logging in.",});}}
async function getMe(req, res) { try { const user = await User.findById(req.user.userId); if (!user) {
return res.status(404).json({ success: false, message: "User not found.",});}
return res.json({ success: true, user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience,
        coins: user.coins,},});} 
catch (error) { console.error("Get user error:", error);
return res.status(500).json({ success: false, message: "Server error while loading user.",});}}
async function logout(req, res) { return res.json({ success: true,  message: "Logout successful.",});}
module.exports = { register, login, getMe, logout,};