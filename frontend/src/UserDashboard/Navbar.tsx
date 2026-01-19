import { Search, Menu } from "lucide-react";
import UserAvatar from "./Avatar";
import { useNavigate } from "react-router-dom";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onSidebarToggle: () => void;
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
        className="md:hidden p-2 bg-gray-800 rounded"
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
          className="w-full pl-12 py-3 bg-slate-900 rounded-xl border border-slate-700"
        />
      </div>

      {/* Avatar */}
      <UserAvatar
        name={user.name}
        email={user.email}
        onLogout={() => {
          localStorage.clear();
          navigate("/login", { replace: true });
        }}
      />
    </div>
  );
}

