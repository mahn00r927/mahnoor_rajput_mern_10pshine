import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Navbar";
import NotesList from "./NotesList";
import type { Note } from "./types";
import { Menu } from "lucide-react";

const BASE_URL = "http://localhost:5000/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
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
    navigate("/editor", { state: { folder: selectedFolder || "Default" } });
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

  const notesByFolder = selectedFolder
    ? notes.filter((n) => n.folder === selectedFolder)
    : notes;

  const filteredNotes = notesByFolder.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueFolders = Array.from(
    new Set(notes.map((n) => n.folder).filter((f): f is string => !!f))
  );

  const handleDeleteFolder = async (folder: string) => {
    const token = localStorage.getItem("token");
    const affectedNotes = notes.filter((n) => n.folder === folder);

    setNotes((prev) =>
      prev.map((n) =>
        n.folder === folder ? { ...n, folder: "Default" } : n
      )
    );

    if (selectedFolder === folder) setSelectedFolder(null);

    for (const note of affectedNotes) {
      await fetch(`${BASE_URL}/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folder: "Default" }),
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar
          onNewNote={handleNewNote}
          folders={uniqueFolders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onDeleteFolder={handleDeleteFolder}
          isMobileOpen={isMobileSidebarOpen}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 h-full bg-slate-900 border-r border-slate-800 shadow-lg z-50 p-4 overflow-y-auto">
            <Sidebar
              onNewNote={handleNewNote}
              folders={uniqueFolders}
              selectedFolder={selectedFolder}
              onSelectFolder={(f) => {
                setSelectedFolder(f);
                setSidebarOpen(false);
              }}
              onDeleteFolder={handleDeleteFolder}
              isMobileOpen={isMobileSidebarOpen}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        {/* TopBar with mobile menu button */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition"
          >
            <Menu size={20} />
          </button>
        </div>

        <TopBar searchQuery={search} setSearchQuery={setSearch} onSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

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
