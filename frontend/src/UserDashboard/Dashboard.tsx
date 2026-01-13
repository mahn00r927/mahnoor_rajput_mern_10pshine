import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Navbar";
import NotesList from "./NotesList";
import type { Note } from "./types";

const BASE_URL = "http://localhost:5000/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 fetch notes from backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch notes");

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // load notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNewNote = () => {
    navigate("/editor");
  };

  const handleEditNote = (note: Note) => {
    
    navigate("/editor", { state: { note } });
  };

  // 🗑️ delete note (backend + frontend sync)
  const handleDeleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // update UI
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar onNewNote={handleNewNote} />

      <div className="flex-1 p-8">
        <TopBar searchQuery={search} setSearchQuery={setSearch} />

        {loading ? (
          <p className="text-gray-400">Loading notes...</p>
        ) : (
          <NotesList
            notes={filteredNotes}
            onNew={handleNewNote}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        )}
      </div>
    </div>
  );
}
