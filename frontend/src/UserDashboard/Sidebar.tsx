import { Plus, Trash2, FolderOpen, X, Star, FolderPlus } from "lucide-react";

type SidebarProps = Readonly<{
  onNewNote: () => void;
  folders: string[];
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  onDeleteFolder: (folder: string) => void;
  onCreateFolder?: () => void;
  onClose?: () => void;
}>;

import { useNavigate } from "react-router-dom";

export default function Sidebar({
  onNewNote,
  folders,
  selectedFolder,
  onSelectFolder,
  onDeleteFolder,
  onCreateFolder,
  onClose,
}: SidebarProps) {
  const navigator = useNavigate();
  return (
    <aside className="w-80 h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/80 flex flex-col p-5 relative">

      {/* ❌ Close (mobile only) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden rounded-lg border border-slate-800 bg-slate-900/70 p-1.5 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
        >
          <X size={18} />
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3 cursor-pointer mb-6"
       >
        <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-cyan-500/30 cursor-pointer transition-transform hover:scale-105"
         onClick={() => { navigator('/') }}>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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

        <div>
          <span className="block text-lg sm:text-2xl font-semibold text-white tracking-tight whitespace-nowrap">
            Smart Notes
          </span>
        </div>
      </div>


      {/* ➕ New Note */}
      <button
        onClick={onNewNote}
        className="mt-6 mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-medium shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-400 transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={18} /> New Note
      </button>

      {/* 📄 All Notes */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 border transition cursor-pointer ${selectedFolder === null
          ? "bg-blue-600/90 border-blue-500/60 text-white"
          : "bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-800/70"
          }`}
      >
        <FolderOpen size={16} />
        All Notes
      </button>

      {/* ⭐ Starred Notes */}
      <button
        onClick={() => onSelectFolder("__STARRED__")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 border transition cursor-pointer ${selectedFolder === "__STARRED__"
          ? "bg-yellow-400/90 text-slate-900 border-yellow-300/70"
          : "bg-slate-900/60 border-slate-800 text-yellow-300 hover:bg-slate-800/70"
          }`}
      >
        <Star size={16} />
        Starred Notes
      </button>

      {/* 📁 Folders Header */}
      <div className="mt-4 mb-3 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest">
        <span>Folders</span>
        <button
          onClick={onCreateFolder}
          className="rounded-md border border-slate-800 bg-slate-900/60 p-1 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
          title="Create Folder"
        >
          <FolderPlus size={14} />
        </button>
      </div>

      {/* 📁 Folder List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {folders.map((folder) => (
          <button
            key={folder}
            type="button"
            onClick={() => onSelectFolder(folder)}
            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-left border transition cursor-pointer ${selectedFolder === folder
              ? "bg-blue-600/90 border-blue-500/60 text-white"
              : "bg-slate-900/40 border-slate-800 text-slate-200 hover:bg-slate-800/70"
              }`}
          >
            <span className="truncate">{folder}</span>

            <Trash2
              size={14}
              className="text-rose-400 hover:text-rose-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder);
              }}
            />
          </button>

        ))}
      </div>

      <div className="mt-6 text-[11px] text-center text-slate-500">
        © Smart Notes
      </div>
    </aside>
  );
}
