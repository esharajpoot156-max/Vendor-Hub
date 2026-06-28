import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getVendors } from '../../api/vendor.api';

const QuotationFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', vendorIds: [] });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getVendors().then((res) => setVendors(res.data.data));
      setForm({ title: '', description: '', vendorIds: [] });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleVendor = (id) => {
    setForm((prev) => ({
      ...prev,
      vendorIds: prev.vendorIds.includes(id) ? prev.vendorIds.filter((v) => v !== id) : [...prev.vendorIds, id],
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.vendorIds.length === 0) newErrors.vendorIds = 'Select at least one vendor';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSubmitting(true);
    try { await onSubmit(form); onClose(); }
    catch (err) { setErrors({ form: err.response?.data?.message || 'Something went wrong' }); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 px-4 backdrop-blur-sm">
      <div className="animate-fade-up w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-950 dark:text-white">New Quotation Request</h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errors.form && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">{errors.form}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Quotation Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Office Chairs Supply"
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                errors.title ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-brand-700 focus:ring-brand-700/15 dark:border-slate-700'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="What do you need from vendors?"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Assign to Vendors</label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-slate-300 p-2 dark:border-slate-700">
              {vendors.length === 0 ? (
                <p className="px-2 py-1 text-sm text-slate-500 dark:text-slate-400">No vendors found. Add a vendor first.</p>
              ) : (
                vendors.map((v) => (
                  <label key={v._id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-brand-50 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={form.vendorIds.includes(v._id)}
                      onChange={() => toggleVendor(v._id)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-900 focus:ring-brand-700/30"
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      {v.vendorName} <span className="text-slate-400 dark:text-slate-500">— {v.companyName}</span>
                    </span>
                  </label>
                ))
              )}
            </div>
            {errors.vendorIds && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.vendorIds}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-md bg-brand-950 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98] disabled:opacity-60 dark:bg-gold-500 dark:text-brand-950 dark:hover:bg-gold-600">
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationFormModal;