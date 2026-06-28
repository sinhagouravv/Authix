'use client';

import React from 'react';

export default function SystemLogsPage() {
  const [lastRefreshed, setLastRefreshed] = React.useState<Date | null>(new Date());

  return (
    <div className="space-y-5 pb-0.25 px-0.25">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold uppercase">System Logs</h1>
        </div>
        <div className="text-[12.5px] uppercase text-gray-500 font-semibold self-end md:self-center mb-1">
          {lastRefreshed
            ? `Last refreshed | ${lastRefreshed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | ${lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            : 'Loading…'}
        </div>
      </div>

      {/* Logs Table Section */}
      <div className="glass-card overflow-auto h-[54.75rem] no-scrollbar border-l border-gray-200">
        <table className="w-full text-center border-collapse">
          <thead className="sticky top-0 z-20 pt-0.25 bg-[#f8fafc] shadow-sm">
            <tr className="text-[16px] uppercase text-gray-600 font-semibold border-gray-100">
              <th className="p-4.75 font-semibold w-[8%] text-mono">Log ID</th>
              <th className="p-4.75 font-semibold w-[15%] text-mono">Source</th>
              <th className="p-4.75 font-semibold w-[9%] text-mono">Module</th>
              <th className="p-4.75 font-semibold w-[10%] text-mono">Event</th>
              <th className="p-4.75 font-semibold w-[10%] text-mono">CPU/RAM</th>
              <th className="p-4.75 font-semibold w-[14%] text-mono">Date & Time</th>
              <th className="p-4.75 font-semibold w-[7%] text-mono">Status</th>
              <th className="p-4.75 font-semibold w-[6%] text-mono">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[13px]">
            <tr>
              <td colSpan={8} className="py-16 text-gray-400 text-sm text-mono">
                System health monitoring is online. Collecting metrics...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
