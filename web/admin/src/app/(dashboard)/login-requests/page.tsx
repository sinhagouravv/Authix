import React from 'react';

export default function LoginRequestsPage() {
  const requests = [
    { id: 'req_1', user: 'gourav@example.com', device: 'MacBook Pro', location: 'Delhi, IN', time: 'Just now', status: 'Approved' },
    { id: 'req_2', user: 'admin@root.com', device: 'iPhone 15', location: 'London, UK', time: '5m ago', status: 'Pending' },
    { id: 'req_3', user: 'user_88@test.com', device: 'Windows PC', location: 'Unknown', time: '12m ago', status: 'Denied' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Login Requests</h1>
        <p className="text-slate-500 mt-2">Monitor and audit incoming authentication attempts.</p>
      </div>

      <div className="glass-card overflow-hidden bg-white/60 border-slate-200 shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">User</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Device</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Location</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Time</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{req.user}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{req.device}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{req.location}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{req.time}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
