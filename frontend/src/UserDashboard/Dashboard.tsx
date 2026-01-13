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
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

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

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNewNote = () => {
    navigate("/editor");
  };

  const handleEditNote = (note: Note) => {
    navigate("/editor", { state: { note } });
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Filter notes by folder first
  const notesByFolder = selectedFolder
    ? notes.filter((n) => n.folder === selectedFolder)
    : notes;

  // Then filter by search
  const filteredNotes = notesByFolder.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  // All unique folders for Sidebar
  const uniqueFolders = Array.from(
    new Set(notes.map((n) => n.folder).filter((f): f is string => !!f))
  );

  const handleDeleteFolder = (folder: string) => {
    // Move all notes in this folder to "Default"
    const updatedNotes = notes.map((n) =>
      n.folder === folder ? { ...n, folder: "Default" } : n
    );
    setNotes(updatedNotes);

    // reset selected folder if it was deleted
    if (selectedFolder === folder) setSelectedFolder(null);

    // Optional: update backend
    const token = localStorage.getItem("token");
    updatedNotes.forEach(async (n) => {
      if (n.folder === "Default") {
        await fetch(`${BASE_URL}/notes/${n._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ folder: n.folder }),
        });
      }
    });
  };


  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar
        onNewNote={handleNewNote}
        folders={uniqueFolders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        onDeleteFolder={handleDeleteFolder}
      />


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
