import { useEffect, useState } from 'react';
import { getQuotations, createQuotationRequest, submitQuotationResponse, updateQuotationStatus, deleteQuotation } from '../api/quotation.api';
import QuotationFormModal from '../components/Quotation/QuotationFormModal';
import RespondModal from '../components/Quotation/RespondModal';
import { Plus, Trash2 } from 'lucide-react';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Approved: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [respondTarget, setRespondTarget] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchQuotations = async (status = '') => {
    setLoading(true);
    try {
      const res = await getQuotations(status ? { status } : {});
      setQuotations(res.data.data);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load quotations'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQuotations(statusFilter); }, [statusFilter]);

  const handleCreate = async (formData) => { await createQuotationRequest(formData); fetchQuotations(statusFilter); };
  const handleRespond = async (id, data) => { await submitQuotationResponse(id, data); fetchQuotations(statusFilter); };
  const handleStatusChange = async (id, status) => {
    try { await updateQuotationStatus(id, status); fetchQuotations(statusFilter); }
    catch (err) { alert(err.response?.data?.message || 'Failed to update status'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quotation?')) return;
    try { await deleteQuotation(id); fetchQuotations(statusFilter); }
    catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div>
      <div className="animate-fade-up mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-brand-950 dark:text-white">Quotations</h1>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 rounded-md bg-brand-950 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98] dark:bg-gold-500 dark:text-brand-950 dark:hover:bg-gold-600">
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="animate-fade-up delay-100 mb-4 flex gap-2">
        {['', 'Pending', 'Submitted', 'Approved', 'Rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              statusFilter === s
                ? 'bg-brand-950 text-white dark:bg-gold-500 dark:text-brand-950'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="animate-fade-up delay-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-xs uppercase text-brand-900/60 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Submitted On</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-red-600">{error}</td></tr>
            ) : quotations.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">No quotations found.</td></tr>
            ) : (
              quotations.map((q) => (
                <tr key={q._id} className="border-t border-slate-100 transition hover:bg-brand-50/40 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-brand-950 dark:text-white">{q.title}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{q.vendor?.vendorName}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{q.amount !== null ? `Rs. ${q.amount.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{q.submissionDate ? new Date(q.submissionDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[q.status]}`}>{q.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {q.status === 'Pending' && (
                      <button onClick={() => setRespondTarget(q)} className="mr-2 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Respond
                      </button>
                    )}
                    {q.status === 'Submitted' && (
                      <>
                        <button onClick={() => handleStatusChange(q._id, 'Approved')} className="mr-2 rounded-md border border-green-200 px-2.5 py-1 text-xs font-medium text-green-700 transition hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/40">
                          Approve
                        </button>
                        <button onClick={() => handleStatusChange(q._id, 'Rejected')} className="mr-2 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40">
                          Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(q._id)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/40">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <QuotationFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} />
      <RespondModal isOpen={!!respondTarget} onClose={() => setRespondTarget(null)} onSubmit={handleRespond} quotation={respondTarget} />
    </div>
  );
};

export default Quotations;