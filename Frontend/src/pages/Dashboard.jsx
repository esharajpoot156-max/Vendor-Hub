import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/quotation.api';
import { Users, FileText, Clock, CheckCircle2, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 font-display text-2xl font-semibold text-brand-950">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-950">
        <Icon className="h-5 w-5 text-gold-500" />
      </div>
    </div>
  </div>
);

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const CHART_COLORS = {
  Pending: '#d4a24c',
  Submitted: '#2c4068',
  Approved: '#16a34a',
  Rejected: '#dc2626',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const chartData = [
    { name: 'Pending', value: stats.pendingQuotations },
    { name: 'Submitted', value: stats.submittedQuotations },
    { name: 'Approved', value: stats.approvedQuotations },
    { name: 'Rejected', value: stats.rejectedQuotations },
  ].filter((d) => d.value > 0);

  const totalQuotations =
    stats.pendingQuotations + stats.submittedQuotations + stats.approvedQuotations + stats.rejectedQuotations;

  const maxApproved = stats.topVendors[0]?.approvedCount || 1;

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-semibold text-brand-950">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Vendors" value={stats.totalVendors} />
        <StatCard icon={FileText} label="Active Quotations" value={stats.activeQuotations} />
        <StatCard icon={Clock} label="Pending Quotations" value={stats.pendingQuotations} />
        <StatCard icon={CheckCircle2} label="Approved Quotations" value={stats.approvedQuotations} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 font-display text-sm font-semibold text-brand-950">Quotation Status Overview</h2>
          {totalQuotations === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No quotations yet.</p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={CHART_COLORS[entry.name]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {chartData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[d.name] }}
                      />
                      {d.name}
                    </span>
                    <span className="font-medium text-brand-950">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-brand-950">
            <Trophy className="h-4 w-4 text-gold-600" />
            Top Vendors by Approvals
          </h2>
          {stats.topVendors.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No approved quotations yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.topVendors.map((v, i) => (
                <div key={v.vendorName + i}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {i + 1}. {v.vendorName} <span className="text-slate-400">— {v.companyName}</span>
                    </span>
                    <span className="font-semibold text-brand-950">{v.approvedCount}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-brand-50">
                    <div
                      className="h-full rounded-full bg-gold-500 transition-all duration-700"
                      style={{ width: `${(v.approvedCount / maxApproved) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-brand-950">Recent Activity</h2>

        {stats.recentActivities.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentActivities.map((q) => (
              <div
                key={q._id}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{q.title}</p>
                  <p className="text-xs text-slate-500">
                    {q.vendor?.vendorName} — {q.vendor?.companyName}
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
  );
};

export default Dashboard;