const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
console.log( "AUTH MIDDLEWARE:", authMiddleware);
console.log("PROTECT TYPE:", typeof authMiddleware.protect);
router.get( "/test", (req, res) => { res.json({ success: true, message: "User route is working.",});});
module.exports = router;