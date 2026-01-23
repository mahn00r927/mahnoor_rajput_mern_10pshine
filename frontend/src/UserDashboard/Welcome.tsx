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
      <div className="mb-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
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
    <div className="mb-1 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Gradient Top Border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500"></div>
      
      <div className="p-6 sm:p-8">
        <div>
          <p className="text-sm sm:text-base text-slate-400 mb-2">
            {getGreeting()}! 👋
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {userName || 'User'}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Ready to organize your thoughts today?
          </p>
        </div>
      </div>
    </div>
  );
}