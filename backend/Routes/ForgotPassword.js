const express = require("express");
const router = express.Router();
const {
  requestPasswordReset,
  resetPassword,
} = require("../Controllers/forgotPassword");

// Request reset email
router.post("/request-reset", requestPasswordReset);

// Reset password
router.post("/reset", resetPassword);

module.exports = router;
