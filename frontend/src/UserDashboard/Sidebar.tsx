import { Plus, Trash2, FolderOpen, X } from "lucide-react";

interface SidebarProps {
  onNewNote: () => void;
  folders: string[];
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  onDeleteFolder: (folder: string) => void;
  onClose?: () => void; // ✅ NEW
}

export default function Sidebar({
  onNewNote,
  folders,
  selectedFolder,
  onSelectFolder,
  onDeleteFolder,
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
      <div className="flex items-center gap-2 sm:gap-3 mb-5">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-blue-500/30">
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

        {/* Smart Notes text */}
        <span className="text-lg sm:text-xl font-semibold tracking-tight text-white">
          Smart Notes
        </span>
      </div>


      {/* New Note */}
      <button
        onClick={onNewNote}
        className="bg-blue-600 hover:bg-blue-700 py-2 rounded-xl mb-6 flex items-center justify-center gap-2"
      >
        <Plus size={18} /> New Note
      </button>

      {/* All Notes */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`flex items-center gap-2 px-3 py-2 rounded mb-3 ${selectedFolder === null ? "bg-blue-600" : "bg-slate-800"
          }`}
      >
        <FolderOpen size={16} /> All Notes
      </button>

      {/* Folders */}
      <div className="space-y-2">
        {folders.map((folder) => (
          <div
            key={folder}
            className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer ${selectedFolder === folder
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`}
            onClick={() => onSelectFolder(folder)}
          >
            <span>{folder}</span>
            <Trash2
              size={14}
              className="text-red-400"
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
