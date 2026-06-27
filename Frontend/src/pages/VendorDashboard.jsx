import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyQuotations, vendorSubmitResponse } from '../api/vendorPortal.api';
import RespondModal from '../components/Quotation/RespondModal';
import { Truck, LogOut } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">Vendor Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{vendor.vendorName}</p>
            <p className="text-xs text-slate-500">{vendor.companyName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <h1 className="mb-6 text-xl font-semibold text-slate-900">My Quotation Requests</h1>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : quotations.length === 0 ? (
          <p className="text-sm text-slate-500">No quotation requests assigned to you yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quotations.map((q) => (
              <div key={q._id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">{q.title}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[q.status]}`}>
                    {q.status}
                  </span>
                </div>

                {q.description && (
                  <p className="mb-4 text-sm text-slate-500">{q.description}</p>
                )}

                <div className="mb-4 text-sm">
                  <p className="text-xs text-slate-500">Your Submitted Amount</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {q.amount !== null ? `Rs. ${q.amount.toLocaleString()}` : 'Not submitted yet'}
                  </p>
                </div>

                {q.status === 'Pending' && (
                  <button
                    onClick={() => setRespondTarget(q)}
                    className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Submit Your Quotation
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <RespondModal
        isOpen={!!respondTarget}
        onClose={() => setRespondTarget(null)}
        onSubmit={handleRespond}
        quotation={respondTarget}
      />
    </div>
  );
};

export default VendorDashboard;