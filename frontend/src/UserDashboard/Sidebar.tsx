import { Plus, Trash2, FolderOpen, X, Star, FolderPlus } from "lucide-react";

interface SidebarProps {
  onNewNote: () => void;
  folders: string[];
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  onDeleteFolder: (folder: string) => void;
  onCreateFolder?: () => void; // ✅ NEW
  onClose?: () => void;
}

export default function Sidebar({
  onNewNote,
  folders,
  selectedFolder,
  onSelectFolder,
  onDeleteFolder,
  onCreateFolder,
  onClose,
}: SidebarProps) {
  return (
    <aside className="w-68 h-full bg-slate-900 border-r border-slate-800 p-4 flex flex-col relative">

      {/* ❌ Close button (mobile only) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white"
        >
          <X size={22} />
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>

        <span className="text-xl font-semibold text-white">
          Smart Notes
        </span>
      </div>

      {/* ➕ New Note */}
      <button
        onClick={onNewNote}
        className="bg-blue-600 hover:bg-blue-700 py-2 rounded-xl mb-4 flex items-center justify-center gap-2"
      >
        <Plus size={18} /> New Note
      </button>

      {/* 📄 All Notes */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`flex items-center gap-2 px-3 py-2 rounded mb-2 ${
          selectedFolder === null
            ? "bg-blue-600"
            : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        <FolderOpen size={16} />
        All Notes
      </button>

      {/* ⭐ Starred Notes */}
      <button
        onClick={() => onSelectFolder("__STARRED__")}
        className={`flex items-center gap-2 px-3 py-2 rounded mb-4 ${
          selectedFolder === "__STARRED__"
            ? "bg-yellow-500 text-black"
            : "bg-slate-800 hover:bg-slate-700 text-yellow-400"
        }`}
      >
        <Star size={16} />
        Starred Notes
      </button>

      {/* 📁 Folders Header + Add Folder */}
      <div className="flex items-center justify-between text-xs text-slate-400 uppercase mb-2">
        <span>Folders</span>
        <button
          onClick={() => onCreateFolder?.()}
          title="Create Folder"
          className="flex items-center gap-2 px-3 py-2 rounded mb-3 hover:bg-slate-800"
        >
          <FolderPlus size={16} />
        </button>
      </div>

      {/* 📁 Folder List */}
      <div className="flex-1 overflow-y-auto mt-2 space-y-2 scrollbar-thin-invisible">

        {folders.map((folder) => (
          <div
            key={folder}
            onClick={() => onSelectFolder(folder)}
            className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer ${
              selectedFolder === folder
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <span className="truncate">{folder}</span>
            <Trash2
              size={14}
              className="text-red-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder);
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-auto text-xs text-center text-slate-500">
        © Smart Notes
      </div>
    </aside>
  );
}
