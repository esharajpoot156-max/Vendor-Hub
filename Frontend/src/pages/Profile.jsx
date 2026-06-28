import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="animate-fade-up mb-6 font-display text-xl font-semibold text-brand-950">My Profile</h1>

      <div className="animate-fade-up delay-100 max-w-md rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-950 font-display text-xl font-semibold text-gold-500">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-brand-950">{user?.name}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-600">
              <ShieldCheck className="h-3 w-3" />
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Administrator account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;