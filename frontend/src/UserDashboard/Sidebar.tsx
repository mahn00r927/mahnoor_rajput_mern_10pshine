import { useState } from "react";
import { FileText, Plus, FolderOpen } from "lucide-react";

export default function Sidebar() {
  const [folders, setFolders] = useState<string[]>([]);

  const handleNewNote = () => {
    console.log("Creating new note...");
  };

  const handleAllNotes = () => {
    console.log("Viewing all notes...");
  };

  const handleAddFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      setFolders([...folders, folderName]);
    }
  };

  return (
    <div className="w-80 h-screen bg-slate-900 border-r border-slate-800 flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Smart Notes</h1>
      </div>

      {/* New Note Button */}
      <button
        onClick={handleNewNote}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 mb-10 mt-5 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={20} />
        <span>New Note</span>
      </button>

      {/* All Notes */}
      <button
        onClick={handleAllNotes}
        className="w-full bg-slate-800/50 hover:bg-slate-800 text-blue-400 font-medium py-3 rounded-lg transition-all duration-200 flex items-center gap-3 px-4 mb-6 border border-slate-700/50 hover:border-blue-500/50"
      >
        <FolderOpen size={20} />
        <span>All Notes</span>
      </button>

      {/* Folders Section */}
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
                className="text-slate-300 hover:text-white hover:bg-slate-800 py-2 px-3 rounded-lg cursor-pointer transition-all"
              >
                {folder}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer to push footer to bottom */}
      <div className="grow"></div>

    </div>
  );
}
