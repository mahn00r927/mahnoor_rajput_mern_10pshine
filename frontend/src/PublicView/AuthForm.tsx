import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface AuthFormProps {
  title: string;
  subtitle: string;
  buttonText: string;
  showPasswordHint: boolean;
  onSubmit: (email: string, password: string) => void;
  toggleText: string;
  onToggle: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  buttonText,
  showPasswordHint,
  onSubmit,
  toggleText,
  onToggle,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h2>
  <p className="text-slate-400 text-xs sm:text-sm mb-6">{subtitle}</p>

  {/* Email */}
  <div className="relative mb-4">
    <Mail className="absolute left-3 top-3 sm:top-2.5 text-slate-400" size={16} />
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full pl-10 py-2 sm:py-2.5 bg-slate-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
      placeholder="you@example.com"
    />
  </div>

  {/* Password */}
  <div className="relative mb-2">
    <Lock className="absolute left-3 top-3 sm:top-2.5 text-slate-400" size={16} />
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
      placeholder="••••••••"
    />
    <button
      type="button"
      aria-label={showPassword ? "Hide password" : "Show password"}
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3 sm:top-2.5 text-slate-400"
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>

  {showPasswordHint && (
    <p className="text-xs sm:text-sm text-slate-400 mb-4">Min 6 characters</p>
  )}

  <button
    onClick={() => onSubmit(email, password)}
    className="w-full bg-blue-600 py-2 sm:py-2.5 rounded-md text-white font-semibold hover:bg-blue-700 transition-colors"
  >
    {buttonText}
  </button>

  <p className="text-center text-xs sm:text-sm text-slate-400 mt-4">
    <button onClick={onToggle} className="text-blue-400 hover:text-blue-300 transition-colors">
      {toggleText}
    </button>
  </p>
</>

  );
};
