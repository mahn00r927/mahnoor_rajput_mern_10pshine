require('dotenv').config();
const User = require("../Models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const logger = require("../Utils/logger"); 
const nodemailer = require("nodemailer");
const asyncHandler = require("../Utils/asyncHandler");


// Send email using Gmail with debug
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,        
      pass: process.env.GMAIL_APP_PASSWORD, 
    },
    logger: true,
    debug: true,
  });

  const info = await transporter.sendMail({
    from: `"No Reply" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
};

// Request password reset
exports.requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const emailHtml = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link expires in 1 hour.</p>
  `;

  try {
    await sendEmail(user.email, "Password Reset", emailHtml);
  } catch (emailError) {
    // Clean up token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.error(emailError, "Error sending password reset email");
    const error = new Error("Failed to send password reset email");
    error.statusCode = 500;
    throw error;
  }

  logger.info({ email: user.email }, "Password reset requested");
  res.json({ message: "Password reset email sent. Check your inbox!" });
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    const error = new Error("Token and new password are required");
    error.statusCode = 400;
    throw error;
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400;
    throw error;
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    const error = new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    );
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  logger.info({ email: user.email }, "Password reset successful");
  res.json({ message: "Password reset successful" });
});
