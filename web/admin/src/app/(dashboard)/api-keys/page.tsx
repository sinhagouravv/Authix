import React from 'react';

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">API Keys</h1>
        <p className="text-slate-500 mt-2">Manage secret keys for secure service-to-service communication.</p>
      </div>

      <div className="glass-card p-8 bg-white/60 border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900">Active Keys</h2>
          <button className="bg-[#052558] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-semibold transition-all text-sm shadow-lg shadow-[#052558]/20">
            Generate New Key
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Prod-Main-API', key: 'ax_live_••••••••••••••••3a9c', created: '2 days ago' },
            { name: 'Staging-Key', key: 'ax_test_••••••••••••••••7f2b', created: '1 month ago' },
            { name: 'Backup-Sync', key: 'ax_live_••••••••••••••••1e0d', created: '3 months ago' },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-[#052558]/20 transition-all">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-900">{item.name}</span>
                <code className="text-xs text-[#052558] font-mono font-medium">{item.key}</code>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-slate-500">Created {item.created}</span>
                <button className="text-red-500 hover:text-red-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
