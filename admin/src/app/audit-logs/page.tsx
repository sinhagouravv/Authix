import React from 'react';

export default function AuditLogsPage() {
  const auditLogs = [
    { id: 1, action: 'REVOKE_API_KEY', user: 'Gourav Sinha', target: 'Prod-Main-API', date: '2024-04-29 14:18' },
    { id: 2, action: 'UPDATE_SECURITY_POLICY', user: 'System', target: 'Enforce 3FA', date: '2024-04-29 12:00' },
    { id: 3, action: 'DELETE_USER', user: 'Admin_99', target: 'scammer@bad.com', date: '2024-04-28 09:30' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-2">Historical record of all administrative actions for compliance and security.</p>
      </div>

      <div className="glass-card overflow-hidden bg-white/60 border-slate-200 shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Action</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Performed By</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Target Object</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-[#052558] font-medium">{log.action}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{log.user}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{log.target}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
