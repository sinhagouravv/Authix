import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Overview of your security infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '12,482', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Sessions', value: '1,203', change: '+5%', color: 'text-green-600', bg: 'bg-green-50' },
          { label: '3FA Enabled', value: '89.4%', change: '+2.1%', color: 'text-[#052558]', bg: 'bg-[#f0f7ff]' },
          { label: 'Security Alerts', value: '3', change: '-50%', color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 flex flex-col gap-2 bg-white/60 border-slate-200">
            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 h-80 flex flex-col items-center justify-center text-slate-400 italic bg-white/40 border-slate-200">
          Login Activity Chart Placeholder
        </div>
        <div className="glass-card p-8 h-80 flex flex-col items-center justify-center text-slate-400 italic bg-white/40 border-slate-200">
          Regional Access Heatmap Placeholder
        </div>
      </div>
    </div>
  );
}
