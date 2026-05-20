'use client';

import React from 'react';
import { Users, Search, Filter, Shield, MoreHorizontal } from 'lucide-react';

export default function VendorUsersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold uppercase tracking-tight text-[#052558]">End Users</h1>
          <p className="text-slate-500 mt-1">Manage and audit users across all your registered applications.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden bg-white shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by email, name or user ID..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Filter size={14} /> Filter
             </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">User Info</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Application</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Factors</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Joined</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-8 py-20 text-center">
                 <div className="flex flex-col items-center justify-center text-slate-300">
                    <Users size={40} className="mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No users registered in your apps yet</p>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
