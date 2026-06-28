import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorLogin } from '../api/vendorAuth.api';
import { Loader2, Truck } from 'lucide-react';

const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await vendorLogin({ email, password });
      const { token, vendor } = res.data;
      localStorage.setItem('vendorToken', token);
      localStorage.setItem('vendorData', JSON.stringify(vendor));
      navigate('/vendor-portal');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gold-100 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -right-16 top-0 h-72 w-72 rounded-full bg-gold-500/30 blur-3xl" />
          <div className="animate-blob absolute bottom-0 left-0 h-80 w-80 rounded-full bg-brand-900/10 blur-3xl [animation-delay:4s]" />
        </div>

        <div className="relative z-10 flex items-center gap-3 animate-fade-up">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950">
            <Truck className="h-4 w-4 text-gold-500" />
          </div>
          <span className="font-display text-sm font-semibold text-brand-950">Vendor Portal</span>
        </div>

        <div className="relative z-10">
          <h1 className="animate-fade-up delay-100 font-display text-3xl font-semibold leading-tight text-brand-950">
            Your quotes,<br />on your terms.
          </h1>
          <p className="animate-fade-up delay-200 mt-4 max-w-sm text-sm text-brand-900/60">
            Review requests assigned to you and submit your pricing directly.
          </p>
        </div>

        <p className="relative z-10 text-xs text-brand-900/40 animate-fade-up delay-300">
          Teyzix Core FS-2 · Vendor Access
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="animate-fade-up font-display text-xl font-semibold text-slate-900">Vendor sign in</h2>
          <p className="animate-fade-up delay-100 mt-1 text-sm text-slate-500">View and respond to your quotations</p>

          {error && (
            <div className="mt-4 animate-fade-up rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="animate-fade-up delay-200">
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-gold-600 focus:ring-2 focus:ring-gold-600/15"
                placeholder="you@company.com"
              />
            </div>
            <div className="animate-fade-up delay-300">
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-gold-600 focus:ring-2 focus:ring-gold-600/15"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="animate-fade-up delay-500 flex w-full items-center justify-center gap-2 rounded-md bg-brand-950 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="animate-fade-up delay-700 mt-6 text-center text-xs text-slate-400">
            Admin?{' '}
            <a href="/login" className="font-medium text-slate-600 underline transition hover:text-slate-900">
              Go to admin login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;