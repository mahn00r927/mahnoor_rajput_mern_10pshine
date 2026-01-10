require('dotenv').config();
const User = require("../Models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const logger = require("../Utils/logger"); 
const nodemailer = require("nodemailer");

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
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

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
      console.error("Email sending error:", emailError); 
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      logger.error(emailError, "Error sending password reset email");
      return res.status(500).json({ message: "Failed to send email", error: emailError.message });
    }

    logger.info({ email: user.email }, "Password reset requested");
    res.json({ message: "Password reset email sent. Check your inbox!" });

  } catch (err) {
    console.error("RequestPasswordReset error:", err);
    logger.error(err, "Error in requestPasswordReset");
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info({ email: user.email }, "Password reset successful");
    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("ResetPassword error:", err);
    logger.error(err, "Error in resetPassword");
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
