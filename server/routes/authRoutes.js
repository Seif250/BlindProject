const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getCurrentUser, 
    logoutUser 
} = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.get("/profile", auth, getCurrentUser);
router.post("/logout", auth, logoutUser);

module.exports = router;