const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const noteController = require("../Controllers/NoteController");
const asyncHandler = require("../Utils/asyncHandler");

// Create note
router.post("/", authMiddleware, asyncHandler(noteController.createNote));

// Get notes
router.get("/", authMiddleware, asyncHandler(noteController.getNotes));

// Update note
router.put("/:id", authMiddleware, asyncHandler(noteController.updateNote));

// Delete note
router.delete("/:id", authMiddleware, asyncHandler(noteController.deleteNote));

module.exports = router;
