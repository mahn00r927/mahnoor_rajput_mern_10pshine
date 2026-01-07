import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Navbar";
import NotesList from "./NotesList";
import type { Note } from "./types";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");

  const handleNewNote = () => {
    navigate("/editor");
  };

  const handleEditNote = (note: Note) => {
    // Pass note data via state
    navigate("/editor", { state: { note } });
  };

  const handleDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar onNewNote={handleNewNote} />

      <div className="flex-1 p-8">
        <TopBar searchQuery={search} setSearchQuery={setSearch} />
        <NotesList
          notes={notes.filter((n) =>
            n.title.toLowerCase().includes(search.toLowerCase())
          )}
          onNew={handleNewNote}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
        />
      </div>
    </div>
  );
}