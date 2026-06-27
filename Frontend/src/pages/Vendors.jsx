import { useEffect, useState } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../api/vendor.api';
import VendorFormModal from '../components/Vendor/VendorFormModal';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [error, setError] = useState('');

  const fetchVendors = async (searchTerm = '') => {
    setLoading(true);
    try {
      const res = await getVendors(searchTerm);
      setVendors(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVendors(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAdd = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await deleteVendor(id);
      fetchVendors(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vendor');
    }
  };

  const handleSubmit = async (formData) => {
    if (editingVendor) {
      await updateVendor(editingVendor._id, formData);
    } else {
      await createVendor(formData);
    }
    fetchVendors(search);
  };

  return (
    <div>
      <div className="animate-fade-up mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-brand-950">Vendors</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-md bg-brand-950 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="animate-fade-up delay-100 mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, or email..."
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15"
        />
      </div>

      <div className="animate-fade-up delay-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-xs uppercase text-brand-900/60">
            <tr>
              <th className="px-4 py-3">Vendor Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-red-600">{error}</td>
              </tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">No vendors found.</td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor._id} className="border-t border-slate-100 transition hover:bg-brand-50/40">
                  <td className="px-4 py-3 font-medium text-brand-950">{vendor.vendorName}</td>
                  <td className="px-4 py-3 text-slate-600">{vendor.companyName}</td>
                  <td className="px-4 py-3 text-slate-600">{vendor.email}</td>
                  <td className="px-4 py-3 text-slate-600">{vendor.contactNumber}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-brand-50 hover:text-brand-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vendor._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <VendorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingVendor}
      />
    </div>
  );
};

export default Vendors;