import { useState, useEffect } from 'react';

export default function WelcomeSection() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUserName(data.user.name);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6 relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>
        <div className="relative p-6 sm:p-8">
          <div className="space-y-3">
            <div className="h-6 w-32 bg-slate-700/50 rounded-lg animate-pulse"></div>
            <div className="h-10 w-full max-w-md bg-slate-700/50 rounded-lg animate-pulse"></div>
            <div className="h-5 w-64 bg-slate-700/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="mb-6 relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.18),transparent_45%)]" />
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {getGreeting()}! Welcome back
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
            {userName || 'User'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
            Keep your ideas organized and actionable. Capture quick notes, pin priorities, and stay focused.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-sm">
            <p className="text-slate-400">Today</p>
            <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-sm">
            <p className="text-slate-400">Workspace</p>
            <p className="text-white font-medium">Smart Notes</p>
          </div>
        </div>
      </div>
    </div>
  );
}