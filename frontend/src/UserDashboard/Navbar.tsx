import { Search, Menu } from "lucide-react";
import UserAvatar from "./Avatar";
import { useNavigate } from "react-router-dom";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onSidebarToggle?: () => void; // added to trigger mobile sidebar
}

export default function TopBar({ searchQuery, setSearchQuery, onSidebarToggle }: Props) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full">
      <button
        className="sm:hidden p-2 rounded bg-gray-800 hover:bg-gray-700 transition"
        onClick={onSidebarToggle}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 mx-2">
        <Search className="absolute left-4 top-1/2 color-white -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-200 bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      {/* User Avatar */}
      <div className="flex-shrink-0">
        <UserAvatar
          name={user.name}
          email={user.email}
          onLogout={() => {
            localStorage.clear();
            navigate("/login", { replace: true });
          }}
        />
      </div>
    </div>
  );
}
