import { FileText } from "lucide-react";
import type  { Note } from "./types";

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onNew: () => void;
}

export default function NotesList({ notes, onEdit, onDelete, onNew }: Props) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="w-10 h-10 mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">No notes yet</p>
        <button onClick={onNew} className="bg-blue-600 px-6 py-2 rounded">
          + Create Note
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onEdit(note)}
          className="bg-gray-900 border border-gray-800 p-4 rounded cursor-pointer"
        >
          <h3 className="font-semibold mb-2">{note.title}</h3>
          <div
            className="text-sm text-gray-400 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="text-red-400 text-xs mt-3"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
