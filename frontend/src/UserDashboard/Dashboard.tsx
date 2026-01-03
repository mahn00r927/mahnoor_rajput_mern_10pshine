import React, { useState } from "react";
import Sidebar from "./Sidebar";
import UserAvatar from "./Avatar";
import {
  Search,
  ArrowLeft,
  Save,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileText,
} from "lucide-react";

type ViewMode = "list" | "editor";

interface Note {
  id: number;
  title: string;
  content: string;
  folder: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [view, setView] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>("No folder");
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");

  const handleNewNote = (): void => {
    setView("editor");
    setNoteTitle("");
    setEditorContent("");
    setCurrentNote(null);
  };

  const handleSaveNote = (): void => {
    if (!noteTitle.trim() && !editorContent.trim()) return;

    const noteData: Note = {
      id: currentNote?.id ?? Date.now(),
      title: noteTitle || "Untitled Note",
      content: editorContent,
      folder: selectedFolder,
      createdAt: currentNote?.createdAt ?? new Date().toISOString(),
    };

    setNotes((prev) =>
      currentNote
        ? prev.map((n) => (n.id === currentNote.id ? noteData : n))
        : [noteData, ...prev]
    );

    setView("list");
    setCurrentNote(null);
  };

  const handleEditNote = (note: Note): void => {
    setCurrentNote(note);
    setNoteTitle(note.title);
    setEditorContent(note.content);
    setView("editor");
    setTimeout(() => {
      const editor = document.querySelector(
        "[contenteditable]"
      ) as HTMLDivElement;
      if (editor) {
        editor.innerHTML = note.content;
      }
    }, 0);
  };

  const handleDeleteNote = (id: number): void => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const formatText = (command: string): void => {
    document.execCommand(command, false);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar onNewNote={handleNewNote} />
      <div className="flex-1 overflow-auto">
        {view === "list" ? (
          <div className="p-8">
            {/* Search and Profile */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search notes..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              <UserAvatar
                name="Mahnoor"
                email="mahnoor.rajput11927@gmail.com"
                onLogout={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              />
            </div>

            {/* Notes */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-600" />
                </div>
                <h2 className="text-2xl text-gray-300 mb-2 font-semibold">
                  No notes yet
                </h2>
                <p className="text-gray-500 mb-6">
                  Create your first note to get started
                </p>
                <button
                  onClick={handleNewNote}
                  className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  + Create Note
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleEditNote(note)}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-5 cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-semibold mb-2 truncate">
                      {note.title}
                    </h3>
                    <div
                      className="text-sm text-gray-400 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: note.content,
                      }}
                    />
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                      <span>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between mb-6">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleSaveNote}
                className="bg-blue-600 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Save size={16} /> Save
              </button>
            </div>

            {/* Editor */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg">
              <input
                value={noteTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNoteTitle(e.target.value)
                }
                placeholder="Note title..."
                className="w-full bg-transparent border-b border-gray-800 px-6 py-4 text-xl outline-none focus:border-blue-600"
              />

              {/* Toolbar */}
              <div className="flex gap-3 px-4 py-2 border-b border-gray-800">
                <button
                  onClick={() => formatText("bold")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <Bold
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
                <button
                  onClick={() => formatText("italic")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <Italic
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
                <button
                  onClick={() => formatText("underline")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <Underline
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
                <button
                  onClick={() => formatText("insertUnorderedList")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <List
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
                <button
                  onClick={() => formatText("insertOrderedList")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <ListOrdered
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
                <button
                  onClick={() => formatText("justifyLeft")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <AlignLeft
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
                <button
                  onClick={() => formatText("justifyCenter")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <AlignCenter
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
                <button
                  onClick={() => formatText("justifyRight")}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <AlignRight
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </button>
              </div>

              {/* Content */}
              <div
                contentEditable
                suppressContentEditableWarning
                className="min-h-100 px-6 py-4 outline-none text-left"
                style={{ direction: "ltr", unicodeBidi: "normal" }}
                onInput={(e: React.FormEvent<HTMLDivElement>) =>
                  setEditorContent((e.target as HTMLDivElement).innerHTML)
                }
                onPaste={(e: React.ClipboardEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData("text/plain");
                  document.execCommand("insertText", false, text);
                }}
                data-placeholder="Start writing..."
              ></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #6b7280;
        }
        [contenteditable] {
          direction: ltr;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
