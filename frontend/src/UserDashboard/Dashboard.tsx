import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Navbar";
import NotesList from "./NotesList";
import Editor from "./Editor";
import type { Note, ViewMode } from "./types";

export default function Dashboard() {
  const [view, setView] = useState<ViewMode>("list");
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [current, setCurrent] = useState<Note | null>(null);

  const saveNote = () => {
    const data: Note = {
      id: current?.id || Date.now(),
      title,
      content,
      folder: "No folder",
      createdAt: new Date().toISOString(),
    };

    setNotes((p) =>
      current ? p.map((n) => (n.id === data.id ? data : n)) : [data, ...p]
    );
    setView("list");
    setCurrent(null);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar onNewNote={() => setView("editor")} />

      <div className="flex-1 p-8">
        {view === "list" ? (
          <>
            <TopBar searchQuery={search} setSearchQuery={setSearch} />
            <NotesList
              notes={notes.filter((n) =>
                n.title.toLowerCase().includes(search.toLowerCase())
              )}
              onNew={() => setView("editor")}
              onEdit={(n) => {
                setCurrent(n);
                setTitle(n.title);
                setContent(n.content);
                setView("editor");
              }}
              onDelete={(id) =>
                setNotes((p) => p.filter((n) => n.id !== id))
              }
            />
          </>
        ) : (
          <Editor />
        )}
      </div>
    </div>
  );
}
