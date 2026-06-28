import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const emptyForm = { vendorName: '', companyName: '', email: '', contactNumber: '', address: '' };

const VendorFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        vendorName: initialData.vendorName || '',
        companyName: initialData.companyName || '',
        email: initialData.email || '',
        contactNumber: initialData.contactNumber || '',
        address: initialData.address || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: 'vendorName', label: 'Vendor Name', placeholder: 'e.g. Ali Khan' },
    { name: 'companyName', label: 'Company Name', placeholder: 'e.g. Khan Traders' },
    { name: 'email', label: 'Email Address', placeholder: 'e.g. ali@khantraders.com', type: 'email' },
    { name: 'contactNumber', label: 'Contact Number', placeholder: 'e.g. 03001234567' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 px-4 backdrop-blur-sm">
      <div className="animate-fade-up w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-950 dark:text-white">
            {initialData ? 'Edit Vendor' : 'Add New Vendor'}
          </h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                  errors[field.name]
                    ? 'border-red-400 focus:ring-red-100'
                    : 'border-slate-300 focus:border-brand-700 focus:ring-brand-700/15 dark:border-slate-700'
                }`}
              />
              {errors[field.name] && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[field.name]}</p>}
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Business Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Lahore, Pakistan"
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                errors.address
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-300 focus:border-brand-700 focus:ring-brand-700/15 dark:border-slate-700'
              }`}
            />
            {errors.address && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-brand-950 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98] disabled:opacity-60 dark:bg-gold-500 dark:text-brand-950 dark:hover:bg-gold-600"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorFormModal;