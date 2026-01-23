import { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom"; // for navigation

interface UserAvatarProps {
  name: string;
  onLogout: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar */}
      <button
        type="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault(); // prevent scrolling for space
            console.log("Button activated with keyboard");
          }
        }}
        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-200"
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">

          {/* Account / Settings */}
          <button
            onClick={() => navigate("/account")}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-slate-800 text-med transition-all duration-200"
          >
            <Settings size={18} /> Account
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-slate-800 text-sm transition-all duration-200"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
