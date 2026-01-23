import { useState } from "react";
import {
  FileText,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import type { Note } from "./types";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  readonly notes: Note[];
  readonly onEdit: (note: Note) => void;
  readonly onDelete: (id: string) => void;
  readonly onNew: () => void;
  readonly setNotes: Dispatch<SetStateAction<Note[]>>;
}


const NOTES_PER_PAGE = 9;

export default function NotesList({
  notes,
  onEdit,
  onDelete,
  onNew,
  setNotes,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Sort pinned notes first
  const sortedNotes = [...notes].sort(
    (a, b) => Number(b.isPinned) - Number(a.isPinned)
  );

  const totalPages = Math.ceil(sortedNotes.length / NOTES_PER_PAGE);
  const startIndex = (currentPage - 1) * NOTES_PER_PAGE;
  const currentNotes = sortedNotes.slice(
    startIndex,
    startIndex + NOTES_PER_PAGE
  );

  // 🔹 Toggle pin API
  const togglePin = async (note: Note) => {
    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });

      if (!res.ok) throw new Error("Failed to update pin");

      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? { ...n, isPinned: !n.isPinned } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-20" >
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {currentNotes.map((note) => (
          <button
            key={note._id}
            onClick={() => onEdit(note)}
            className="bg-gray-900 border border-gray-800 p-4 rounded cursor-pointer hover:border-gray-700 transition flex flex-col"
          >
            {/* TITLE + PIN */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold truncate text-lg sm:text-base">
                {note.title || "Untitled"}
              </h3>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(note);
                }}
                title={note.isPinned ? "Unpin note" : "Pin note"}
              >
                <Star
                  size={18}
                  className={
                    note.isPinned
                      ? "fill-yellow-400 text-yellow-400 cursor-pointer"
                      : "text-gray-500 hover:text-yellow-400 cursor-pointer"
                  }
                />
              </button>
            </div>

            {/* CONTENT */}
            <div
              className="text-sm text-gray-400 line-clamp-3 flex-1 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: note.content || "<p class='italic'>Empty note</p>",
              }}
            />

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-3 flex-wrap">
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
          </button>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="flex items-center gap-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center gap-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
