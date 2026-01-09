import { FileText, Trash2, Pencil } from "lucide-react";
import type { Note } from "./types";

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export default function NotesList({
  notes,
  onEdit,
  onDelete,
  onNew,
}: Props) {
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
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
            {/* EDIT */}
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

            {/* DELETE */}
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
  );
}
