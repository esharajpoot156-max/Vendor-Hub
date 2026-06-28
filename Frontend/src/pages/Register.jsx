import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-950 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="animate-blob absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl [animation-delay:3s]" />
        </div>

        <div className="relative z-10 flex items-center gap-3 animate-fade-up">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 font-display text-sm font-bold text-brand-950">
            VQ
          </div>
          <span className="font-display text-sm font-semibold text-white">Vendor Hub</span>
        </div>

        <div className="relative z-10">
          <h1 className="animate-fade-up delay-100 font-display text-3xl font-semibold leading-tight text-white">
            Set up your<br />admin console.
          </h1>
          <p className="animate-fade-up delay-200 mt-4 max-w-sm text-sm text-white/50">
            Create an account to start managing vendors and quotation requests.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/40 animate-fade-up delay-300">
          <ShieldCheck className="h-4 w-4 text-gold-500" />
          Admin access · Teyzix Core FS-2
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="animate-fade-up font-display text-xl font-semibold text-slate-900">Create account</h2>
          <p className="animate-fade-up delay-100 mt-1 text-sm text-slate-500">Register as an admin</p>

          {error && (
            <div className="mt-4 animate-fade-up rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="animate-fade-up delay-200">
              <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15"
                placeholder="Your name"
              />
            </div>
            <div className="animate-fade-up delay-200">
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15"
                placeholder="you@company.com"
              />
            </div>
            <div className="animate-fade-up delay-300">
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15"
                placeholder="••••••••"
              />
            </div>
            <div className="animate-fade-up delay-300">
              <label className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="animate-fade-up delay-500 flex w-full items-center justify-center gap-2 rounded-md bg-brand-950 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="animate-fade-up delay-700 mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-slate-600 underline transition hover:text-slate-900">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;