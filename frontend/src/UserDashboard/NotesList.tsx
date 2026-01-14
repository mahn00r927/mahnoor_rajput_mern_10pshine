import { useState } from "react";
import { FileText, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import type { Note } from "./types";

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const NOTES_PER_PAGE = 9;

export default function NotesList({
  notes,
  onEdit,
  onDelete,
  onNew,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);

  const startIndex = (currentPage - 1) * NOTES_PER_PAGE;
  const currentNotes = notes.slice(
    startIndex,
    startIndex + NOTES_PER_PAGE
  );

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="w-12 h-12 mx-auto text-gray-600 mb-4 mt-10" />
        <p className="text-gray-400 mb-4">No notes yet</p>
        <button
          onClick={onNew}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create Note
        </button>
      </div>
    );
  }

  return (
    <>
      {/* NOTES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentNotes.map((note) => (
          <div
            key={note._id}
            onClick={() => onEdit(note)}
            className="bg-gray-900 border border-gray-800 p-4 rounded cursor-pointer hover:border-gray-700 transition"
          >
            <h3 className="font-semibold mb-2 truncate">
              {note.title || "Untitled"}
            </h3>

            <div
              className="text-sm text-gray-400 line-clamp-3 pointer-events-none"
              dangerouslySetInnerHTML={{
                __html: note.content || "<p class='italic'>Empty note</p>",
              }}
            />

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="flex items-center gap-1 text-green-400 text-xs hover:text-green-500"
              >
                <Pencil size={14} />
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note._id);
                }}
                className="flex items-center gap-1 text-red-400 text-xs hover:text-red-500"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="flex items-center gap-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center gap-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
