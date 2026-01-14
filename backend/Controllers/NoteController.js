const Note = require("../Models/Note");
const logger = require("../Utils/logger");
const asyncHandler = require("../Utils/asyncHandler");

// CREATE NOTE
exports.createNote = asyncHandler(async (req, res) => {
  const { title, content, folder } = req.body;

  if (!title || !content) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error; // goes to global error handler
  }

  const note = await Note.create({
    title,
    content,
    folder: folder || "Default",
    user: req.user.id,
  });

  logger.info({ noteId: note._id }, "Note created successfully");

  res.status(201).json(note);
});


// GET ALL NOTES (user specific)
exports.getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });

  if (!notes.length) {
    const error = new Error("No notes found");
    error.statusCode = 404;
    throw error;
  }

  logger.info("Fetched user notes");
  res.json(notes);
});


// UPDATE NOTE
exports.updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  logger.info({ noteId: note._id }, "Note updated");
  res.json(note);
});


// DELETE NOTE
exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  logger.info({ noteId: note._id }, "Note deleted");
  res.json({ message: "Note deleted successfully" });
});

