const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("./../Utils/logger");
const asyncHandler = require("../Utils/asyncHandler");

// ================= SIGNUP CONTROLLER =================
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    logger.warn("Signup failed: missing fields");
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if user exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    logger.warn({ email: normalizedEmail }, "Signup failed: user already exists");
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  logger.info({ userId: user._id, email: user.email }, "New user registered");
  res.status(201).json({ message: "User created successfully" });
});


// ================= LOGIN CONTROLLER =================
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    logger.warn("Login failed: missing fields");
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    logger.warn({ email: normalizedEmail }, "Login failed: user not found");
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    logger.warn({ userId: user._id }, "Login failed: wrong password");
    throw error;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  logger.info({ userId: user._id, email: user.email }, "User logged in successfully");

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

