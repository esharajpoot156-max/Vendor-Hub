import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyQuotations, vendorSubmitResponse } from '../api/vendorPortal.api';
import RespondModal from '../components/Quotation/RespondModal';
import VendorProfileDrawer from '../components/VendorPortal/VendorProfileDrawer';
import { Truck, LogOut, FileText } from 'lucide-react';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const VendorDashboard = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respondTarget, setRespondTarget] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const vendor = JSON.parse(localStorage.getItem('vendorData') || '{}');
  const navigate = useNavigate();

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await getMyQuotations();
      setQuotations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleRespond = async (id, data) => {
    await vendorSubmitResponse(id, data);
    fetchQuotations();
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    navigate('/vendor-login');
  };

  const pendingCount = quotations.filter((q) => q.status === 'Pending').length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-950">
            <Truck className="h-4 w-4 text-gold-500" />
          </div>
          <span className="font-display text-sm font-semibold text-brand-950">Vendor Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setProfileOpen(true)}
            title="View profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-100 text-xs font-semibold text-brand-900 transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
          >
            {vendor.vendorName?.[0]?.toUpperCase()}
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{vendor.vendorName}</p>
            <p className="text-xs text-slate-500">{vendor.companyName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="animate-fade-up mb-6">
          <h1 className="font-display text-xl font-semibold text-brand-950">My Quotation Requests</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pendingCount > 0
              ? `You have ${pendingCount} request${pendingCount > 1 ? 's' : ''} waiting for your response.`
              : "You're all caught up — no pending requests."}
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : quotations.length === 0 ? (
          <div className="animate-fade-up delay-100 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">No quotation requests assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quotations.map((q, i) => (
              <div
                key={q._id}
                className="animate-fade-up rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:shadow-md"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h2 className="font-display text-sm font-semibold text-brand-950">{q.title}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[q.status]}`}>
                    {q.status}
                  </span>
                </div>

                {q.description && (
                  <p className="mb-4 text-sm text-slate-500">{q.description}</p>
                )}

                <div className="mb-4 rounded-lg bg-brand-50 px-3 py-2.5">
                  <p className="text-xs text-brand-900/50">Your Submitted Amount</p>
                  <p className="font-display text-lg font-semibold text-brand-950">
                    {q.amount !== null ? `Rs. ${q.amount.toLocaleString()}` : 'Not submitted yet'}
                  </p>
                </div>

                {q.status === 'Pending' && (
                  <button
                    onClick={() => setRespondTarget(q)}
                    className="w-full rounded-md bg-brand-950 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98]"
                  >
                    Submit Your Quotation
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Vendor Hub — Vendor Access Portal</p>
          <p>Teyzix Core · FS-2</p>
        </div>
      </footer>

      <RespondModal
        isOpen={!!respondTarget}
        onClose={() => setRespondTarget(null)}
        onSubmit={handleRespond}
        quotation={respondTarget}
      />

      <VendorProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} vendor={vendor} />
    </div>
  );
};

export default VendorDashboard;