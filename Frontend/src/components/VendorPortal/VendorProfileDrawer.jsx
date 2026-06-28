import { X, Mail, Building2 } from 'lucide-react';

const VendorProfileDrawer = ({ isOpen, onClose, vendor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="animate-backdrop-fade absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="animate-slide-in-right relative h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="font-display text-lg font-semibold text-brand-950">My Profile</h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-950 font-display text-xl font-semibold text-gold-500">
              {vendor?.vendorName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-display text-base font-semibold text-brand-950">{vendor?.vendorName}</p>
              <p className="text-sm text-slate-500">{vendor?.companyName}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-brand-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-brand-900/40" /> {vendor?.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="h-4 w-4 text-brand-900/40" /> {vendor?.companyName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileDrawer;