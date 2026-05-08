'use client';

import React from 'react';

export default function ActivityLogsPage() {
  const [lastRefreshed, setLastRefreshed] = React.useState<Date | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [filter, setFilter] = React.useState<'ALL' | 'FRONTEND' | 'VENDOR_PANEL'>('ALL');
  const [limit, setLimit] = React.useState<'ALL' | '25' | '50' | '75' | '100'>('ALL');

  React.useEffect(() => {
    setMounted(true);
    setLastRefreshed(new Date());
  }, []);

  return (
    <div className="space-y-5 pb-0.25 px-0.25">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold uppercase">Activity Logs</h1>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-white/10 backdrop-blur-xl border border-white rounded-xl shadow-sm shadow-[#052558]/25 px-3.5 py-1 text-[12px] font-semibold  outline-none cursor-pointer w-auto transition-all duration-300 appearance-none text-center uppercase  hover:bg-white/80"
              >
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'FRONTEND', label: 'Frontend' },
                  { id: 'VENDOR_PANEL', label: 'Vendor' }
                ].map((opt) => (
                  <option key={opt.id} value={opt.id} className="font-bold text-[#052558] bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value as any)}
                className="bg-white/10 backdrop-blur-xl border border-white rounded-xl shadow-sm shadow-[#052558]/25 px-3.5 py-1 text-[12px] font-semibold  outline-none cursor-pointer w-auto transition-all duration-300 appearance-none text-center uppercase  hover:bg-white/80"
              >
                {['ALL', '25', '50', '75', '100'].map((val) => (
                  <option key={val} value={val} className="font-bold text-[#052558] text-center bg-white">
                    {val === 'ALL' ? 'All' : `Latest ${val}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="text-[12.5px] uppercase text-gray-500 font-semibold self-end md:self-center mb-1 h-5">
          {mounted && lastRefreshed
            ? `Last refreshed | ${lastRefreshed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | ${lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            : 'Loading…'}
        </div>
      </div>

      {/* Logs Table Section */}
      <div className="glass-card overflow-auto h-[54.75rem] no-scrollbar border-l border-gray-200">
        <table className="w-full text-center border-collapse">
          <thead className="sticky top-0 z-20 pt-0.25 bg-[#f8fafc] shadow-sm">
            <tr className="text-[16px] uppercase text-gray-600 font-semibold border-gray-100">
              <th className="p-4.75 font-semibold w-[8%] text-mono">Activity ID</th>
              <th className="p-4.75 font-semibold w-[15%] text-mono">Action</th>
              <th className="p-4.75 font-semibold w-[9%] text-mono">Entity</th>
              <th className="p-4.75 font-semibold w-[10%] text-mono">User</th>
              <th className="p-4.75 font-semibold w-[10%] text-mono">IP</th>
              <th className="p-4.75 font-semibold w-[14%] text-mono">Date & Time</th>
              <th className="p-4.75 font-semibold w-[7%] text-mono">Status</th>
              <th className="p-4.75 font-semibold w-[6%] text-mono">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[13px]">
            <tr>
              <td colSpan={8} className="py-16 text-gray-400 text-sm text-mono">
                Activity logging infrastructure is ready. Data will be populated soon.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
