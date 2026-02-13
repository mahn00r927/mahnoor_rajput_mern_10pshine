const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const logger = require("../Utils/logger");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      logger.warn({ userId: req.user.id }, "User not found");
      return res.status(404).json({ message: "User not found" });
    }

    logger.info({ userId: user._id }, "User profile fetched");
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user.id }, "Error fetching user profile");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile (name, email)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn({ userId: req.user.id }, "User not found for update");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        logger.warn({ email }, "Email already in use");
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields
    user.name = name;
    user.email = email;

    const updatedUser = await user.save();

    logger.info({ userId: updatedUser._id }, "User profile updated successfully");
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user.id }, "Error updating user profile");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: "Please provide current password, new password, and confirmation" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        message: "New password and confirmation do not match" 
      });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: "Password must include uppercase, lowercase, number, and special character" 
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn({ userId: req.user.id }, "User not found for password update");
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      logger.warn({ userId: req.user.id }, "Incorrect current password");
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    logger.info({ userId: user._id }, "Password updated successfully");
    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user.id }, "Error updating password");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    // Require password confirmation for security
    if (!password) {
      return res.status(400).json({ 
        message: "Please provide your password to confirm account deletion" 
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn({ userId: req.user.id }, "User not found for deletion");
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn({ userId: req.user.id }, "Incorrect password for account deletion");
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    logger.info({ userId: req.user.id }, "User account deleted successfully");
    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user.id }, "Error deleting account");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  deleteAccount,
};