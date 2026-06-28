'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const [mounted, setMounted] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setLastRefreshed(new Date());
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold uppercase tracking-tight text-[#052558]">Analytics</h1>
          <p className="text-slate-500 mt-1">Deep dive into your application authentication patterns and user growth.</p>
        </div>
        <div className="text-[12.5px] uppercase text-gray-500 font-semibold self-end md:self-center mb-1 h-5">
          {mounted && lastRefreshed
            ? `Data current as of | ${lastRefreshed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | ${lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            : 'Loading...'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Success Rate', value: '99.2%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Total Requests', value: '0', icon: BarChart3, color: 'text-indigo-500' },
          { label: 'Unique Users', value: '0', icon: Users, color: 'text-blue-500' },
          { label: 'Latency', value: '42ms', icon: Clock, color: 'text-amber-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 bg-white shadow-sm border border-slate-100 group">
             <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <stat.icon size={16} className={stat.color} />
             </div>
             <h3 className="text-2xl font-black text-[#052558]">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="glass-card p-12 bg-white/60 border-slate-200 border-dashed border-2 flex flex-col items-center justify-center text-center h-[400px]">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
          <BarChart3 size={28} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-[#052558] uppercase">Chart Infrastructure Ready</h2>
        <p className="text-slate-400 mt-2 max-w-sm text-sm uppercase font-semibold">Real-time data visualization will appear here once your applications start processing traffic.</p>
      </div>
    </div>
  );
}
