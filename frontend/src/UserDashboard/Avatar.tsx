import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";

interface UserAvatarProps {
  name: string;
  email: string;
  onLogout: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, email, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      <div
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-200"
      >
        {initial}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute ml-20 mt-3 w-56 sm:w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm text-slate-400">Account</p>
            <p className="text-sm font-medium truncate text-white">{email}</p>
          </div>

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
