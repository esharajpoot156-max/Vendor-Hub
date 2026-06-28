import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <p className="text-sm text-slate-400">
        Welcome back, <span className="font-medium text-slate-700">{user?.name}</span>
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/profile')}
          title="View profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-900 transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
        >
          {user?.name?.[0]?.toUpperCase()}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;