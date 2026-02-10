import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Note } from "./types";

const BASE_URL = "http://localhost:5000/api";

/* ================= TOOLBAR BUTTON ================= */
interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    className="p-2 hover:bg-slate-700 rounded transition-colors duration-200 text-slate-300 hover:text-white"
  >
    {icon}
  </button>
);

const RichTextEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const note: Note | null = location.state?.note || null;

  const [title, setTitle] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const savedSelection = useRef<Range | null>(null);
  const [isPinned, setIsPinned] = useState(false);

  const [folder, setFolder] = useState<string>(
    note?.folder || location.state?.folder || "Default"
  );

  /* ================= LOAD NOTE ================= */
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setFolder(note.folder || "Default");
      setIsPinned(Boolean(note.isPinned));

      if (editorRef.current) {
        editorRef.current.innerHTML = note.content || "<p><br></p>";
      }
    } else {
      setFolder((prev) => prev || "Default");
      setIsPinned(false);
      if (editorRef.current && editorRef.current.innerHTML === "") {
        editorRef.current.innerHTML = "<p><br></p>";
      }
    }
  }, [note]);

  /* ================= TEXT COMMANDS ================= */
  const executeCommand = (command: string, value?: string) => {
    editorRef.current?.focus();

    const selection = globalThis.getSelection(); // globalThis instead of window

    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      if (selection && selection.rangeCount > 0) {
        // eslint-disable-next-line deprecation/deprecation
        document.execCommand(command, false, value); // deprecated
        setTimeout(() => {
          if (editorRef.current) {
            const range = selection.getRangeAt(0);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 0);
      }
    } else {
      // eslint-disable-next-line deprecation/deprecation
      document.execCommand(command, false, value); // deprecated
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || "";

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        note ? `${BASE_URL}/notes/${note._id}` : `${BASE_URL}/notes`,
        {
          method: note ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, folder, isPinned }),
        }
      );

      if (!res.ok) throw new Error("Save failed");

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Error saving note");
    }
  };

  const handleBack = () => navigate("/dashboard");
  const handleEditorClick = () => editorRef.current?.focus();

  /* ================= LINK MODAL ================= */
  const handleLinkClick = () => {
    const selection = globalThis.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
      const selectedText = selection.toString();
      setLinkText(selectedText);
      setLinkUrl("");
      setShowLinkModal(true);
    }
  };

  const insertLink = () => {
    if (!linkUrl) return;

    if (savedSelection.current) {
      const selection = globalThis.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection.current);
      }
    }

    if (linkText && !globalThis.getSelection()?.toString()) {
      // eslint-disable-next-line deprecation/deprecation
      document.execCommand("insertText", false, linkText);
      const selection = globalThis.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.setStart(range.endContainer, range.endOffset - linkText.length);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    const url = /^https?:\/\//.exec(linkUrl) ? linkUrl : `https://${linkUrl}`;
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand("createLink", false, url);

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    savedSelection.current = null;
    editorRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-slate-800/80 bg-slate-950/50 backdrop-blur">
        <div className="max-w-6xl mx-auto flex flex-row sm:flex-row items-center justify-between px-4 sm:px-6 py-4 gap-3 sm:gap-0">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-300 hover:text-white hover:border-slate-700 transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer shadow-lg ${
              isSaved
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-cyan-500/20"
            }`}
          >
            <Save size={18} />
            <span>{isSaved ? "Saved!" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden flex flex-col">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900/40 px-4 sm:px-6 py-4 sm:py-5 text-2xl text-white placeholder-slate-500 border-b border-slate-800/80 outline-none"
          />

          {/* Toolbar */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 px-2 sm:px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <ToolbarButton onClick={() => executeCommand("bold")} icon={<Bold size={20} />} title="Bold (Ctrl+B)" />
            <ToolbarButton onClick={() => executeCommand("italic")} icon={<Italic size={20} />} title="Italic (Ctrl+I)" />
            <ToolbarButton onClick={() => executeCommand("underline")} icon={<Underline size={20} />} title="Underline (Ctrl+U)" />

            <div className="w-px h-6 bg-slate-700 mx-2 hidden sm:block" />

            <ToolbarButton onClick={handleLinkClick} icon={<Link size={20} />} title="Insert Link (Ctrl+K)" />

            <div className="w-px h-6 bg-slate-700 mx-2 hidden sm:block" />

            <ToolbarButton onClick={() => executeCommand("insertUnorderedList")} icon={<List size={20} />} title="Bullet List" />
            <ToolbarButton onClick={() => executeCommand("insertOrderedList")} icon={<ListOrdered size={20} />} title="Numbered List" />

            <div className="w-px h-6 bg-slate-700 mx-2 hidden sm:block" />

            <ToolbarButton onClick={() => executeCommand("justifyLeft")} icon={<AlignLeft size={20} />} title="Align Left" />
            <ToolbarButton onClick={() => executeCommand("justifyCenter")} icon={<AlignCenter size={20} />} title="Align Center" />
            <ToolbarButton onClick={() => executeCommand("justifyRight")} icon={<AlignRight size={20} />} title="Align Right" />

            <input
              list="folders"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="Select or type folder"
              className="ml-auto sm:ml-4 mt-2 sm:mt-0 bg-slate-900/70 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-sm w-full sm:w-auto"
            />
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                isPinned
                  ? "bg-yellow-400/90 text-slate-900 border-yellow-300/70"
                  : "bg-slate-900/70 text-slate-300 border-slate-800 hover:bg-slate-800/80"
              }`}
            >
              {isPinned ? "⭐ Star" : "☆ Star"}
            </button>
          </div>

          {/* Editor Area */}
          <div
            ref={editorRef}
            contentEditable
            role="textbox"
            tabIndex={0}
            onClick={handleEditorClick}
            suppressContentEditableWarning
            className="min-h-[300px] sm:min-h-[420px] px-4 sm:px-6 py-6 sm:py-8 text-slate-200 outline-none editor-content flex-1 bg-slate-950/20"
            style={{ lineHeight: "1.6" }}
          />
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-center text-slate-500 text-sm px-2 sm:px-0">
          <p>
            Use keyboard shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline), Ctrl+K (Link)
          </p>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900/90 rounded-2xl p-6 w-full max-w-md border border-slate-800/80 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="linkText" className="block text-sm text-slate-400 mb-2">Link Text</label>
                <input
                  id="linkText"
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Text to display"
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="linkUrl" className="block text-sm text-slate-400 mb-2">URL</label>
                <input
                  id="linkUrl"
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
                  onKeyDown={(e) => e.key === "Enter" && insertLink()}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={insertLink}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
              >
                Insert
              </button>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                  setLinkText("");
                  savedSelection.current = null;
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-medium transition-colors duration-200 cursor-pointer text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor styles */}
      <style>{`
        .editor-content { caret-color: #60a5fa; }
        .editor-content:focus { outline: none; }
        .editor-content p { margin: 0.75em 0; min-height: 1.5em; }
        .editor-content ul, .editor-content ol { margin: 0.75em 0; padding-left: 2.5em; }
        .editor-content ul { list-style-type: disc; }
        .editor-content ol { list-style-type: decimal; }
        .editor-content li { margin: 0.5em 0; display: list-item; padding-left: 0.5em; }
        .editor-content ul li::marker, .editor-content ol li::marker { color: #60a5fa; }
        .editor-content strong { font-weight: 700; color: #e2e8f0; }
        .editor-content em { font-style: italic; }
        .editor-content u { text-decoration: underline; }
        .editor-content a { color: #60a5fa; text-decoration: underline; cursor: pointer; }
        .editor-content a:hover { color: #93c5fd; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
