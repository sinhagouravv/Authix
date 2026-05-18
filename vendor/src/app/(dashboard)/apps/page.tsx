'use client';

import React from 'react';
import { AppWindow, Search, Plus } from 'lucide-react';

export default function MyApps() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">My Applications</h1>
          <p className="text-slate-500 mt-2">Manage all your integrated Authix applications from one place.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
          <Plus size={18} /> Register App
        </button>
      </div>

      <div className="glass-card overflow-hidden bg-white/60 border-slate-200 shadow-md">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-white/40">
           <div className="relative flex-grow max-w-md">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by app name or ID..." 
               className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
             />
           </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30">
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">App Name</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">App ID</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Created</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <AppWindow size={40} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">No applications found in your account.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
