import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <p className="text-sm text-slate-400 dark:text-slate-500">
        Welcome back, <span className="font-medium text-slate-700 dark:text-slate-200">{user?.name}</span>
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 active:scale-90 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Sun className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
          <Moon className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
        </button>

        <button
          onClick={() => navigate('/profile')}
          title="View profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-900 transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95 dark:bg-brand-800 dark:text-gold-500"
        >
          {user?.name?.[0]?.toUpperCase()}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;