import { useState } from 'react';
import { X } from 'lucide-react';

const RespondModal = ({ isOpen, onClose, onSubmit, quotation }) => {
  const [amount, setAmount] = useState('');
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !quotation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { setError('Please enter a valid amount'); return; }
    setSubmitting(true);
    try {
      await onSubmit(quotation._id, { amount: Number(amount), submissionDate });
      onClose();
      setAmount('');
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 px-4 backdrop-blur-sm">
      <div className="animate-fade-up w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-950 dark:text-white">Submit Quotation Response</h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          For <span className="font-medium text-slate-700 dark:text-slate-300">{quotation.title}</span> — {quotation.vendor?.vendorName}
        </p>

        {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Quotation Amount (Rs.)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Submission Date</label>
            <input
              type="date"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-md bg-brand-950 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98] disabled:opacity-60 dark:bg-gold-500 dark:text-brand-950 dark:hover:bg-gold-600">
              {submitting ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RespondModal;