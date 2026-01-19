import { Search } from "lucide-react";
import UserAvatar from "./Avatar";
import { useNavigate } from "react-router-dom";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export default function TopBar({ searchQuery, setSearchQuery }: Props) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 w-full">
      
      {/* Search input */}
      <div className="relative flex-1 max-w-full sm:max-w-2xl w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
