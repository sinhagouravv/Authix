import React from 'react';

export default function SecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Security</h1>
        <p className="text-slate-500 mt-2">Manage global security policies and threat detection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 space-y-6 bg-white/60 border-slate-200">
          <h3 className="text-xl font-bold border-b border-slate-100 pb-4 text-slate-900">Global Policies</h3>
          <div className="space-y-4">
            {[
              { label: 'Enforce 3FA for all Admins', enabled: true },
              { label: 'IP Whitelisting', enabled: false },
              { label: 'Session Timeout (30m)', enabled: true },
              { label: 'Brute Force Protection', enabled: true },
            ].map((policy) => (
              <div key={policy.label} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">{policy.label}</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${policy.enabled ? 'bg-[#052558]' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${policy.enabled ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 space-y-6 border-red-100 bg-red-50/30">
          <h3 className="text-xl font-bold border-b border-red-100 pb-4 text-red-600">Threat Detection</h3>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-red-100/50 border border-red-200 text-sm text-red-700">
              <span className="font-bold">Active Threat:</span> High-frequency login attempts detected from IP 192.168.1.1
            </div>
            <div className="p-4 rounded-xl bg-yellow-100/50 border border-yellow-200 text-sm text-yellow-700">
              <span className="font-bold">Advisory:</span> 12 users have expired passwords.
            </div>
          </div>
          <button className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all text-sm shadow-lg shadow-red-500/20">
            Emergency Lockdown
          </button>
        </div>
      </div>
    </div>
  );
}
