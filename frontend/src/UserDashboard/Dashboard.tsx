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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    navigate("/editor", { state: { folder: selectedFolder && selectedFolder !== "__STARRED__" ? selectedFolder : "Default" } });


  };

  const handleEditNote = (note: Note) => {
    navigate("/editor", { state: { note } });
  };

  const handleDeleteNote = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  // ✅ folders derived from notes (single source of truth)
  const folders = Array.from(
    new Set(notes.map((n) => n.folder).filter(Boolean))
  ) as string[];

  const filteredNotes = notes.filter((n) => {
    // ⭐ If Starred Notes selected, only show pinned notes
    if (selectedFolder === "__STARRED__") return n.isPinned;

    // 🔹 Otherwise normal folder filtering
    if (selectedFolder && n.folder !== selectedFolder) return false;

    // 🔹 Search filtering
    return (
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    );
  });


  const handleDeleteFolder = async (folder: string) => {
    const token = localStorage.getItem("token");

    setNotes((prev) =>
      prev.map((n) =>
        n.folder === folder ? { ...n, folder: "Default" } : n
      )
    );

    if (selectedFolder === folder) setSelectedFolder(null);

    for (const note of notes.filter((n) => n.folder === folder)) {
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

   const handleCreateFolder = () => {
      const folderName = prompt("Enter folder name");

      if (!folderName) return;

      // Check if folder already exists in current notes
      const existingFolders = Array.from(new Set(notes.map((n) => n.folder).filter(Boolean)));
      if (existingFolders.includes(folderName)) {
        alert("Folder already exists");
        return;
      }

      alert("Folder created! You can now assign notes to this folder when creating/editing a note.");
    };
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          onNewNote={handleNewNote}
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onDeleteFolder={handleDeleteFolder}
          onCreateFolder={handleCreateFolder}
        />
      </div>
    <div className="flex h-190 bg-gray-950 text-white">
      <Sidebar
        onNewNote={handleNewNote}
        folders={uniqueFolders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-[260px] bg-slate-900">
            <Sidebar
              onNewNote={handleNewNote}
              folders={folders}
              selectedFolder={selectedFolder}
              onSelectFolder={(f) => {
                setSelectedFolder(f);
                setSidebarOpen(false);
              }}
              onDeleteFolder={handleDeleteFolder}
              onClose={() => setSidebarOpen(false)}
              onCreateFolder={handleCreateFolder}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <TopBar
          searchQuery={search}
          setSearchQuery={setSearch}
          onSidebarToggle={() => setSidebarOpen(true)}
        />

        {loading ? (
          <p className="text-gray-400 mt-6">Loading notes...</p>
        ) : (
          <NotesList
            notes={filteredNotes}
            setNotes={setNotes}
            onNew={handleNewNote}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        )}
      </div>
    </div>
  );
}
