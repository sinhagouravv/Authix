import React from 'react';

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Clients (Apps)</h1>
        <p className="text-slate-500 mt-2">Configure third-party applications and OAuth clients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Authix Dashboard', id: 'client_123', status: 'Active' },
          { name: 'Mobile App', id: 'client_456', status: 'Active' },
          { name: 'Internal Tooling', id: 'client_789', status: 'Disabled' },
        ].map((client) => (
          <div key={client.id} className="glass-card p-6 flex flex-col gap-4 bg-white/60 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{client.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {client.status}
              </span>
            </div>
            <div className="text-sm text-slate-500">
              ID: <code className="text-[#052558] font-mono font-medium">{client.id}</code>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-grow py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-all">Configure</button>
              <button className="flex-grow py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-all">Keys</button>
            </div>
          </div>
        ))}
        <button className="glass-card p-6 flex flex-col items-center justify-center gap-2 border-dashed border-2 border-slate-200 hover:border-[#052558]/30 hover:bg-[#f0f7ff]/30 transition-all text-slate-400 group">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#052558] group-hover:text-white transition-all">+</div>
          <span className="font-medium group-hover:text-[#052558]">Register New App</span>
        </button>
      </div>
    </div>
  );
}
