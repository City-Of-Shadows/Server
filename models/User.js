const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20,},
email: { type: String, required: true, unique: true, lowercase: true, trim: true,},
password: { type: String,  required: true, select: false,},
level: { type: Number, default: 1, min: 1,},
experience: { type: Number,  default: 0,  min: 0,},
coins: { type: Number, default: 0, min: 0,},
isActive: { type: Boolean, default: true,},},{timestamps: true,});
module.exports = mongoose.model( "User", userSchema);