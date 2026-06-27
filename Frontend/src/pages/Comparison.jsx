import { useEffect, useState } from 'react';
import { getQuotationRequests, compareQuotations } from '../api/quotation.api';
import { Trophy, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const Comparison = () => {
  const [requests, setRequests] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuotationRequests().then((res) => {
      setRequests(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedGroup(res.data.data[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    setLoading(true);
    setError('');
    compareQuotations(selectedGroup)
      .then((res) => setComparisonData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load comparison'))
      .finally(() => setLoading(false));
  }, [selectedGroup]);

  const selectedRequest = requests.find((r) => r._id === selectedGroup);

  const submittedAmounts = comparisonData.filter((q) => q.amount !== null).map((q) => q.amount);
  const lowest = submittedAmounts.length ? Math.min(...submittedAmounts) : null;
  const highest = submittedAmounts.length ? Math.max(...submittedAmounts) : null;
  const savings = lowest !== null && highest !== null ? highest - lowest : null;

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(10, 18, 40);
    doc.text('Quotation Comparison Report', 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(selectedRequest?.title || '', 14, 25);
    if (selectedRequest?.description) {
      doc.text(selectedRequest.description, 14, 31);
    }

    autoTable(doc, {
      startY: 38,
      head: [['Vendor', 'Company', 'Amount (Rs.)', 'Status', 'Submitted On']],
      body: comparisonData.map((q) => [
        q.vendor?.vendorName || '-',
        q.vendor?.companyName || '-',
        q.amount !== null ? q.amount.toLocaleString() : 'Not submitted',
        q.status,
        q.submissionDate ? new Date(q.submissionDate).toLocaleDateString() : '-',
      ]),
      headStyles: { fillColor: [10, 18, 40] },
      didParseCell: (data) => {
        const row = comparisonData[data.row.index];
        if (row?.isCheapest && data.section === 'body') {
          data.cell.styles.fillColor = [250, 241, 226];
          data.cell.styles.textColor = [184, 137, 63];
        }
      },
    });

    if (savings !== null) {
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.setTextColor(10, 18, 40);
      doc.text(`Potential savings by choosing the lowest quote: Rs. ${savings.toLocaleString()}`, 14, finalY);
    }

    doc.save(`comparison-${(selectedRequest?.title || 'report').replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <div>
      <div className="animate-fade-up mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-brand-950">Quotation Comparison</h1>
        {comparisonData.length > 0 && (
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-md border border-brand-950 px-4 py-2 text-sm font-medium text-brand-950 transition hover:bg-brand-950 hover:text-white"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        )}
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-slate-500">
          No quotation requests yet. Create one from the Quotations page first.
        </p>
      ) : (
        <>
          <div className="animate-fade-up delay-100 mb-6 max-w-sm">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Select Quotation Request
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15"
            >
              {requests.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title} ({r.vendorCount} vendors)
                </option>
              ))}
            </select>
          </div>

          {selectedRequest?.description && (
            <p className="animate-fade-up delay-200 mb-4 text-sm text-slate-500">{selectedRequest.description}</p>
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Loading comparison...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <>
              {savings !== null && savings > 0 && (
                <div className="animate-fade-up delay-200 mb-6 flex items-center gap-3 rounded-xl border border-gold-500/30 bg-gold-100 px-5 py-4">
                  <Trophy className="h-5 w-5 text-gold-600" />
                  <p className="text-sm text-brand-950">
                    Choosing the lowest quote saves{' '}
                    <span className="font-semibold">Rs. {savings.toLocaleString()}</span> compared to the
                    highest offer.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comparisonData.map((q, i) => (
                  <div
                    key={q._id}
                    className={`animate-fade-up relative rounded-xl border bg-white p-5 ${
                      q.isCheapest ? 'border-gold-500 ring-1 ring-gold-500/30' : 'border-slate-200'
                    }`}
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                    {q.isCheapest && (
                      <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-medium text-brand-950">
                        <Trophy className="h-3 w-3" />
                        Best Price
                      </div>
                    )}

                    <p className="font-display text-sm font-semibold text-brand-950">{q.vendor?.vendorName}</p>
                    <p className="text-xs text-slate-500">{q.vendor?.companyName}</p>

                    <div className="mt-4">
                      <p className="text-xs text-slate-500">Quotation Amount</p>
                      <p className="text-2xl font-semibold text-brand-950">
                        {q.amount !== null ? `Rs. ${q.amount.toLocaleString()}` : 'Not submitted yet'}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {q.submissionDate
                          ? new Date(q.submissionDate).toLocaleDateString()
                          : 'No submission date'}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 font-medium ${statusColors[q.status]}`}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Comparison;