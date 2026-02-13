const express = require("express");
const router = express.Router();
const { signup, login } = require("../Controllers/AuthController");
const asyncHandler = require("../Utils/asyncHandler");

// Wrap each controller with asyncHandler
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));

module.exports = router;
