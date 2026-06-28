import React from 'react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-2">Deep dive into platform usage and security performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-[#f0f7ff] border-[#e6f0fa]">
          <h4 className="text-sm font-semibold text-[#052558] mb-1">Weekly Growth</h4>
          <div className="text-3xl font-bold text-slate-900">+2,401</div>
          <div className="text-xs text-green-600 mt-2">↑ 14% vs last week</div>
        </div>
        <div className="glass-card p-6 bg-white/60 border-slate-200">
          <h4 className="text-sm font-semibold text-slate-500 mb-1">Avg Session Time</h4>
          <div className="text-3xl font-bold text-slate-900">12m 45s</div>
          <div className="text-xs text-red-600 mt-2">↓ 2% vs last month</div>
        </div>
        <div className="glass-card p-6 bg-white/60 border-slate-200">
          <h4 className="text-sm font-semibold text-slate-500 mb-1">Success Rate</h4>
          <div className="text-3xl font-bold text-slate-900">99.98%</div>
          <div className="text-xs text-green-600 mt-2">Stable</div>
        </div>
      </div>

      <div className="glass-card p-12 h-[400px] flex flex-col items-center justify-center gap-4 text-slate-400 bg-white/40 border-slate-200">
        <div className="w-full max-w-md h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-[#052558] shadow-[0_0_20px_rgba(79,70,229,0.2)]" />
        </div>
        <p className="italic font-medium">Advanced Analytics Engine Initializing...</p>
      </div>
    </div>
  );
}
