import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Global system configuration and administrative preferences.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="glass-card p-8 space-y-8 bg-white/60 border-slate-200 shadow-md">
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Organization Name</label>
                <input type="text" defaultValue="Authix Security" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-[#052558]/10 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Support Email</label>
                <input type="email" defaultValue="support@authix.io" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-[#052558]/10 outline-none transition-all" />
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Maintenance Mode</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-100">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-yellow-700">Enable Maintenance Mode</span>
                <span className="text-xs text-yellow-600/80">Temporarily disable all external authentication requests.</span>
              </div>
              <button className="px-6 py-2 rounded-lg bg-yellow-100 border border-yellow-200 text-yellow-700 font-bold text-xs hover:bg-yellow-200 transition-all">Enable</button>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button className="bg-[#052558] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#052558]/20">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
