const express = require("express");
const router = express.Router();
const { requestPasswordReset, resetPassword } = require("../Controllers/forgotPassword");
const asyncHandler = require("../Utils/asyncHandler");

// Request reset email
router.post("/request-reset", asyncHandler(requestPasswordReset));

// Reset password
router.post("/reset", asyncHandler(resetPassword));

module.exports = router;
