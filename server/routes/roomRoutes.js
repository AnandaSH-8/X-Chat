const express = require("express");

const {
  initializeRoom,
  getUserRooms,
} = require("../controllers/roomController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Both room endpoints require authentication.
router.post("/init", protect, initializeRoom);
router.get("/userrooms", protect, getUserRooms);

module.exports = router;
