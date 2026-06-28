'use client';

import React from 'react';
import { Key, Copy, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ApiKeys() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">API Credentials</h1>
        <p className="text-slate-500 mt-2">Manage your production and development API keys securely.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
          <AlertTriangle size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">Security Warning</h3>
          <p className="text-xs text-amber-700 leading-relaxed font-medium">
            Your API keys grant full access to your vendor account's authentication features. Never share your **Client Secret** or commit it to version control.
          </p>
        </div>
      </div>

      {/* API Key Card Placeholder */}
      <div className="glass-card p-10 bg-white/60 border-slate-200 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 blur-[80px] rounded-full" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                <Key size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Main Production Key</h3>
                <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Created 12 days ago</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase border border-emerald-200">
              Active
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Client ID</label>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value="authix_cli_9284018592301" 
                  className="flex-grow px-5 py-3.5 bg-slate-100/50 border border-slate-100 rounded-xl text-sm font-mono text-slate-600 outline-none"
                />
                <button className="p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <Copy size={18} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Client Secret</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  readOnly 
                  value="••••••••••••••••••••••••••••••••" 
                  className="flex-grow px-5 py-3.5 bg-slate-100/50 border border-slate-100 rounded-xl text-sm font-mono text-slate-600 outline-none"
                />
                <button className="p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <Copy size={18} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
               <RefreshCw size={14} /> Regenerate
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
