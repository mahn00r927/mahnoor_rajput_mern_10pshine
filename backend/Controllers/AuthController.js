const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("./../Utils/logger");

// ================= SIGNUP CONTROLLER =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      logger.warn("Signup failed: missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      logger.warn(
        { email: normalizedEmail },
        "Signup failed: user already exists"
      );
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await user.save();
    logger.info({ userId: user._id, email: user.email }, "New user registered");
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN CONTROLLER =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      logger.warn("Login failed: missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      logger.warn({ email: normalizedEmail }, "Login failed: user not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn({ userId: user._id }, "Login failed: wrong password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(
      { userId: user._id, email: user.email },
      "User logged in successfully"
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error(err, "Login Failed");
    res.status(500).json({ message: err.message });
  }
};
