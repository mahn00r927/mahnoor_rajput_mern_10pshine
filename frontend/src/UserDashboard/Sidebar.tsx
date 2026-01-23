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
    <aside className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col p-4 relative">

      {/* ❌ Close (mobile only) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white"
        >
          <X size={22} />
        </button>
      )}

      {/* Logo */}
     <div className="flex items-center gap-2 sm:gap-3">
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

            <span className="text-lg sm:text-2xl font-bold text-white tracking-tight whitespace-nowrap">
              Smart Notes
            </span>
          </div>


      {/* ➕ New Note */}
      <button
        onClick={onNewNote}
        className="bg-blue-600 hover:bg-blue-700 py-2 rounded-xl mb-8 flex items-center justify-center gap-2 mt-6"
      >
        <Plus size={18} /> New Note
      </button>

      {/* 📄 All Notes */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`flex items-center gap-2 px-3 py-2 rounded mb-6 ${selectedFolder === null
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
        className={`flex items-center gap-2 px-3 py-2 rounded mb-4 ${selectedFolder === "__STARRED__"
          ? "bg-yellow-500 text-black"
          : "bg-slate-800 hover:bg-slate-700 text-yellow-400"
          }`}
      >
        <Star size={16} />
        Starred Notes
      </button>

      {/* 📁 Folders Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 uppercase mb-6 mt-6">
        <span>Folders</span>
        <button
          onClick={onCreateFolder}
          className="hover:text-white"
          title="Create Folder"
        >
          <FolderPlus size={16} />
        </button>
      </div>

      {/* 📁 Folder List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {folders.map((folder) => (
          <button
            key={folder}
            type="button"
            onClick={() => onSelectFolder(folder)}
            className={`w-full flex justify-between items-center px-3 py-2 rounded text-left ${selectedFolder === folder
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
          </button>

        ))}
      </div>

      <div className="mt-auto text-xs text-center text-slate-500">
        © Smart Notes
      </div>
    </aside>
  );
}
