const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  deleteAccount,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all routes with authentication
router.use(authMiddleware);

// @route   GET /api/users/profile
router.get("/profile", getUserProfile);

// @route   PUT /api/users/profile
router.put("/profile", updateUserProfile);

// @route   PUT /api/users/password
router.put("/password", updatePassword);

// @route   DELETE /api/users/account
router.delete("/account", deleteAccount);

module.exports = router;