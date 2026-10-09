'use client';

import React from 'react';
import { Shield, Globe, Info } from 'lucide-react';

export default function RegisterApp() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Register New App</h1>
        <p className="text-slate-500 mt-2">Add a new application to the Authix ecosystem to enable secure 3FA.</p>
      </div>

      <div className="glass-card p-10 bg-white/60 border-slate-200 shadow-xl space-y-8">
        <div className="space-y-6">
          {/* App Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Application Name</label>
            <div className="relative group">
               <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
               <input 
                 type="text" 
                 placeholder="e.g. My Secure Portal" 
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-300 font-medium"
               />
            </div>
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Website URL</label>
            <div className="relative group">
               <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
               <input 
                 type="url" 
                 placeholder="https://yourapp.com" 
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-300 font-medium"
               />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Description (Optional)</label>
            <textarea 
              placeholder="Tell us a bit about what this app does..." 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-300 font-medium min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
           <Info size={20} className="text-blue-500 shrink-0" />
           <p className="text-[12px] text-blue-700 font-medium">
             After registration, you'll receive a unique Client ID and Client Secret which you'll need to integrate Authix into your code.
           </p>
        </div>

        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all">
          Generate Credentials
        </button>
      </div>
    </div>
  );
}
