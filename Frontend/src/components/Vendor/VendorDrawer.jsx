import { useEffect, useState } from 'react';
import { X, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { getQuotations } from '../../api/quotation.api';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const VendorDrawer = ({ vendor, onClose }) => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendor) return;
    setLoading(true);
    getQuotations({ vendor: vendor._id })
      .then((res) => setQuotations(res.data.data))
      .finally(() => setLoading(false));
  }, [vendor]);

  if (!vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="animate-backdrop-fade absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="animate-slide-in-right relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="font-display text-lg font-semibold text-brand-950">Vendor Details</h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-950 font-display text-lg font-semibold text-gold-500">
              {vendor.vendorName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-display text-base font-semibold text-brand-950">{vendor.vendorName}</p>
              <p className="text-sm text-slate-500">{vendor.companyName}</p>
            </div>
          </div>

          <div className="mb-6 space-y-3 rounded-lg bg-brand-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-brand-900/40" /> {vendor.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="h-4 w-4 text-brand-900/40" /> {vendor.contactNumber}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-brand-900/40" /> {vendor.address}
            </div>
          </div>

          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-brand-950">
            <FileText className="h-4 w-4 text-gold-600" />
            Quotation History
          </h3>

          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : quotations.length === 0 ? (
            <p className="text-sm text-slate-500">No quotation requests for this vendor yet.</p>
          ) : (
            <div className="space-y-2">
              {quotations.map((q, i) => (
                <div
                  key={q._id}
                  className="animate-fade-up flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{q.title}</p>
                    <p className="text-xs text-slate-400">
                      {q.amount !== null ? `Rs. ${q.amount.toLocaleString()}` : 'No amount yet'}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[q.status]}`}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDrawer;