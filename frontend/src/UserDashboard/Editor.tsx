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
  Link
} from "lucide-react";

const RichTextEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const savedSelection = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = "<p><br></p>";
    }
  }, []);

  const executeCommand = (
    command: string,
    value: string | undefined = undefined
  ) => {
    editorRef.current?.focus();

    // Special handling for lists to ensure they work properly
    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        document.execCommand(command, false, value);
        // Force a re-render to ensure the list is visible
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
      document.execCommand(command, false, value);
    }
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || "";
    console.log("Saved:", { title, content });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);

    // You can add your save logic here
    // Example: send to backend API
    // await fetch('/api/notes', { method: 'POST', body: JSON.stringify({ title, content }) });
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleEditorClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
  }> = ({ onClick, icon, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
      className="p-2 hover:bg-slate-700 rounded transition-colors duration-200 text-slate-300 hover:text-white"
    >
      {icon}
    </button>
  );
  const handleLinkClick = () => {
    const selection = window.getSelection();
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
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection.current);
      }
    }

    if (linkText && !window.getSelection()?.toString()) {
      document.execCommand("insertText", false, linkText);
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.setStart(range.endContainer, range.endOffset - linkText.length);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    const url = linkUrl.match(/^https?:\/\//) ? linkUrl : `https://${linkUrl}`;
    document.execCommand("createLink", false, url);

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    savedSelection.current = null;
    editorRef.current?.focus();
  };
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="text-lg">Back</span>
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${isSaved
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          <Save size={18} />
          <span>{isSaved ? "Saved!" : "Save"}</span>
        </button>
      </div>

      {/* Editor Container */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-[#1a2332] rounded-lg shadow-2xl overflow-hidden">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-5 bg-transparent text-2xl text-slate-300 placeholder-slate-600 border-none outline-none"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-3 border-y border-slate-700">
            <ToolbarButton
              onClick={() => executeCommand("bold")}
              icon={<Bold size={20} />}
              title="Bold (Ctrl+B)"
            />
            <ToolbarButton
              onClick={() => executeCommand("italic")}
              icon={<Italic size={20} />}
              title="Italic (Ctrl+I)"
            />
            <ToolbarButton
              onClick={() => executeCommand("underline")}
              icon={<Underline size={20} />}
              title="Underline (Ctrl+U)"
            />
            <div className="w-px h-6 bg-slate-700 mx-2" />

            <ToolbarButton
              onClick={handleLinkClick}
              icon={<Link size={20} />}
              title="Insert Link (Ctrl+K)"
            />

            <div className="w-px h-6 bg-slate-700 mx-2" />

            <ToolbarButton
              onClick={() => executeCommand("insertUnorderedList")}
              icon={<List size={20} />}
              title="Bullet List"
            />
            <ToolbarButton
              onClick={() => executeCommand("insertOrderedList")}
              icon={<ListOrdered size={20} />}
              title="Numbered List"
            />

            <div className="w-px h-6 bg-slate-700 mx-2" />

            <ToolbarButton
              onClick={() => executeCommand("justifyLeft")}
              icon={<AlignLeft size={20} />}
              title="Align Left"
            />
            <ToolbarButton
              onClick={() => executeCommand("justifyCenter")}
              icon={<AlignCenter size={20} />}
              title="Align Center"
            />
            <ToolbarButton
              onClick={() => executeCommand("justifyRight")}
              icon={<AlignRight size={20} />}
              title="Align Right"
            />
          </div>

          {/* Editor Area */}
          <div
            ref={editorRef}
            contentEditable
            onClick={handleEditorClick}
            suppressContentEditableWarning
            className="min-h-100 px-6 py-6 text-slate-300 outline-none editor-content"
            style={{
              lineHeight: "1.6",
            }}
          />
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-center text-slate-500 text-sm">
          <p>
            Use keyboard shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline), Ctrl+K (Link)
          </p>
        </div>
      </div>
      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a2332] rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">
              Insert Link
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Text to display"
                  className="w-full px-4 py-2 bg-[#0a0e1a] border border-slate-700 rounded text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-[#0a0e1a] border border-slate-700 rounded text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      insertLink();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={insertLink}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors duration-200"
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
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .editor-content {
          caret-color: #60a5fa;
        }
        
        .editor-content:focus {
          outline: none;
        }
        
        .editor-content p {
          margin: 0.75em 0;
          min-height: 1.5em;
        }
        
        .editor-content ul,
        .editor-content ol {
          margin: 0.75em 0;
          padding-left: 2.5em;
          display: block;
        }
        
        .editor-content ul {
          list-style-type: disc;
        }
        
        .editor-content ol {
          list-style-type: decimal;
        }
        
        .editor-content li {
          margin: 0.5em 0;
          display: list-item;
          padding-left: 0.5em;
        }
        
        .editor-content ul li::marker {
          color: #60a5fa;
        }
        
        .editor-content ol li::marker {
          color: #60a5fa;
        }
        
        .editor-content strong {
          font-weight: 700;
          color: #e2e8f0;
        }
        
        .editor-content em {
          font-style: italic;
        }
        
        .editor-content u {
          text-decoration: underline;
        }

        .editor-content:empty:before {
          content: '';
          color: #64748b;
        }

        /* Ensure lists are visible */
        .editor-content ul,
        .editor-content ol {
          visibility: visible !important;
          opacity: 1 !important;
        }
          .editor-content a {
  color: #60a5fa;
  text-decoration: underline;
  cursor: pointer;
}

.editor-content a:hover {
  color: #93c5fd;
}
      `}</style>
    </div>
  );
};

export default RichTextEditor;
