'use client';

import React from 'react';
import { AppWindow, Users, Activity, ArrowUpRight } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '0', icon: Users, change: '+0%', color: 'bg-blue-500' },
  { name: 'Active Apps', value: '0', icon: AppWindow, change: '+0', color: 'bg-indigo-500' },
  { name: 'API Calls', value: '0', icon: Activity, change: '+0%', color: 'bg-emerald-500' },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome to your Authix control center. Monitor and manage your application security.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 bg-white/60 border-slate-200 shadow-md group hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-indigo-500/10`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> {stat.change}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="glass-card p-12 bg-white/60 border-slate-200 border-dashed border-2 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <AppWindow size={32} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Apps Registered Yet</h2>
        <p className="text-slate-500 mt-2 max-w-sm">Start integrating Authix into your applications by registering your first app.</p>
        <button className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
          Register My First App
        </button>
      </div>
    </div>
  );
}
