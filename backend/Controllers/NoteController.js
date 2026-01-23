const Note = require("../Models/Note");
const logger = require("../Utils/logger");
const asyncHandler = require("../Utils/asyncHandler");

// CREATE NOTE
exports.createNote = asyncHandler(async (req, res) => {
  const { title, content, folder, isPinned } = req.body;
  console.log("REQ BODY:", req.body);
    console.log("REQ USER:", req.user);
  if (!title || !content) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error; // goes to global error handler
  }

  try {
    const { title, content, folder, isPinned } = req.body;

    const note = await Note.create({
      title,
      content,
      folder,
      user: req.user.id,
      isPinned: isPinned || false,
    });

    res.status(201).json(note);
    logger.info({ noteId: note._id }, "Note created successfully");
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    res.status(500).json({ message: "Failed to create note" });
  }
});


// GET ALL NOTES (user specific)
exports.getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ isPinned: -1, updatedAt: -1 });


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
  try {
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

  }
  catch (error) {
    res.status(500).json({ message: "Failed to update note" });
  }
}
);


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

