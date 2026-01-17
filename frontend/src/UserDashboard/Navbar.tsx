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
    <div className="flex items-center justify-between gap-4 mb-8">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 outline-none"
        />
      </div>

      <UserAvatar
        name={user.name}
        email={user.email}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.clear();
          navigate("/login", { replace: true });
        }}
      />
    </div>
  );
}
