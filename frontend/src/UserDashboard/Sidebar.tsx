import { Plus, FolderOpen } from "lucide-react";

interface SidebarProps {
  onNewNote: () => void;
  folders: string[];
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  onDeleteFolder: (folder: string) => void; // NEW
}


const Sidebar: React.FC<SidebarProps> = ({
  onNewNote,
  folders,
  selectedFolder,
  onSelectFolder,
  onDeleteFolder, // NEW
}) => {

  const handleAddFolder = (): void => {
    const folderName = prompt("Enter folder name");
    if (!folderName) return;
    // Trigger a folder selection immediately
    onSelectFolder(folderName);
    // Optional: you may later save this folder to backend
  };

  return (
    <aside className="w-80 h-180 bg-slate-900 border-r border-slate-800 flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
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
        <span className="text-2xl font-bold text-white tracking-tight">
          Smart Notes
        </span>
      </div>

      {/* New Note */}
      <button
        onClick={onNewNote}
        className="w-full bg-blue-600 hover:bg-blue-700 mt-7 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 mb-10 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={20} />
        New Note
      </button>

      {/* All Notes */}
      <button
        className={`w-full bg-slate-800/50 hover:bg-slate-800 text-blue-400 font-medium py-3 rounded-lg transition-all duration-200 flex items-center gap-3 px-4 mb-6 border border-slate-700/50 hover:border-blue-500/50 ${selectedFolder === null ? "bg-blue-600 text-white" : ""
          }`}
        onClick={() => onSelectFolder(null)}
      >
        <FolderOpen size={20} />
        All Notes
      </button>

      {/* Folders */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Folders
          </h2>
          <button
            onClick={handleAddFolder}
            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        {folders.length === 0 ? (
          <p className="text-slate-500 text-sm italic pl-2">No folders yet</p>
        ) : (
          <div className="space-y-2">
            {folders.map((folder, index) => (
              <div
                key={index}
                className={`flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer transition-all ${selectedFolder === folder
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
              >
                <span onClick={() => onSelectFolder(folder)}>{folder}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting folder
                    onDeleteFolder(folder); // call Dashboard handler
                  }}
                  className="text-red-400 hover:text-red-600 text-sm px-2"
                >
                  Delete
                </button>
              </div>
            ))}


          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="grow" />

      {/* Footer */}
      <div className="text-xs text-slate-500 text-center">© Smart Notes</div>
    </aside>
  );
};

export default Sidebar;
