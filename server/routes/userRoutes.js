const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getFirebaseToken,
} = require("../controllers/authController");

const { searchUsers } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);
router.get("/search", protect, searchUsers);
router.get("/firebase-token", protect, getFirebaseToken);

module.exports = router;
