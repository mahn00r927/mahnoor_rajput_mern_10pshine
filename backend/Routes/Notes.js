const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const noteController = require("./../Controllers/NoteController");

router.post("/", authMiddleware, noteController.createNote);
router.get("/", authMiddleware, noteController.getNotes);
router.put("/:id", authMiddleware, noteController.updateNote);
router.delete("/:id", authMiddleware, noteController.deleteNote);

module.exports = router;
