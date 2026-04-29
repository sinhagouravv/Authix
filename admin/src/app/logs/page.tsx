import React from 'react';

export default function LogsPage() {
  const logs = [
    { time: '14:22:01', event: 'DB_CONNECTION_ESTABLISHED', level: 'INFO', message: 'Successfully connected to Cluster1' },
    { time: '14:21:45', event: 'AUTH_FAILED', level: 'WARN', message: 'Failed login attempt for user: admin@root.com' },
    { time: '14:20:12', event: 'SERVER_START', level: 'INFO', message: 'Next.js dev server ready on port 3001' },
    { time: '14:18:59', event: 'API_KEY_REVOKED', level: 'ERROR', message: 'Key ax_live_...1e0d revoked by user_99' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Logs</h1>
        <p className="text-slate-500 mt-2">Real-time monitoring of system events and operations.</p>
      </div>

      <div className="glass-card p-6 bg-slate-900 font-mono text-sm leading-relaxed overflow-x-auto shadow-xl">
        <div className="flex flex-col gap-2">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 border-b border-white/5 pb-2">
              <span className="text-slate-500 shrink-0">{log.time}</span>
              <span className={`font-bold shrink-0 ${log.level === 'INFO' ? 'text-blue-400' : log.level === 'WARN' ? 'text-yellow-400' : 'text-red-400'}`}>
                [{log.level}]
              </span>
              <span className="text-[#527FB0] shrink-0">{log.event}</span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
          <div className="animate-pulse text-[#527FB0] font-bold mt-2">_ Monitoring active...</div>
        </div>
      </div>
    </div>
  );
}
