import { Search, Menu } from "lucide-react";
import UserAvatar from "./Avatar";
import { useNavigate } from "react-router-dom";

interface Props {
  readonly searchQuery: string;
  readonly setSearchQuery: (v: string) => void;
  readonly onSidebarToggle: () => void;
}

export default function TopBar({
  searchQuery,
  setSearchQuery,
  onSidebarToggle,
}: Props) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">

      {/* Mobile Menu */}
      <button
        onClick={onSidebarToggle}
        className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-12 pr-4 py-3 bg-slate-900/70 text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800/80 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
        />
      </div>

      {/* Avatar */}
      <UserAvatar
        name={user.name}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.clear();
          navigate("/login", { replace: true });
        }}
      />
    </div>
  );
}

