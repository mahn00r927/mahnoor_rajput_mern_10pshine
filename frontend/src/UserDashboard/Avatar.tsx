import { useState, useRef, useEffect } from "react";
import { LogOut, } from "lucide-react";

interface UserAvatarProps {
  name: string;
  email: string;
  onLogout: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initial = name.charAt(0).toUpperCase();

  // close dropdown on outside click
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
        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-semibold cursor-pointer hover:bg-blue-700 transition"
      >
        {initial}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-sm text-gray-400">Account</p>
            <p className="text-sm font-medium truncate">{email}</p>
          </div>

          {/* <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 text-sm">
            <User size={16} /> Profile
          </button> */}

          <button
            onClick={onLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-gray-800 text-sm"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
