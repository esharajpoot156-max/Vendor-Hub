import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, GitCompare, Handshake } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vendors', label: 'Vendors', icon: Users },
  { to: '/quotations', label: 'Quotations', icon: FileText },
  { to: '/comparison', label: 'Comparison', icon: GitCompare },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 flex-col bg-brand-950">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500">
          <Handshake className="h-5 w-5 text-brand-950" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-white">Vendor Hub</p>
          <p className="text-[11px] text-white/40">Procurement Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/55 hover:bg-white/5 hover:text-white/90'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-4 w-4 ${isActive ? 'text-gold-500' : ''}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-[11px] text-white/30">Teyzix Core · FS-2</p>
      </div>
    </aside>
  );
};

export default Sidebar;