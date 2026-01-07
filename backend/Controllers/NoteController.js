const Note = require("../Models/Note");
const logger = require("../Utils/logger");

// CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      logger.warn("Create note failed: missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });

    logger.info({ noteId: note._id }, "Note created successfully");

    res.status(201).json(note);
  } catch (error) {
    logger.error(error, "Error creating note");
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL NOTES (user specific)
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    logger.info("Fetched user notes");
    res.json(notes);
  } catch (error) {
    logger.error(error, "Error fetching notes");
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE NOTE
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!note) {
      logger.warn("Update failed: Note not found");
      return res.status(404).json({ message: "Note not found" });
    }

    logger.info({ noteId: note._id }, "Note updated");
    res.json(note);
  } catch (error) {
    logger.error(error, "Error updating note");
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE NOTE
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      logger.warn("Delete failed: Note not found");
      return res.status(404).json({ message: "Note not found" });
    }

    logger.info({ noteId: note._id }, "Note deleted");
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    logger.error(error, "Error deleting note");
    res.status(500).json({ message: "Server error" });
  }
};
