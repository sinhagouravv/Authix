import React from 'react';

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Gourav Sinha', email: 'gourav@example.com', role: 'Admin', status: 'Verified', factors: '3/3' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@skynet.com', role: 'User', status: 'Pending', factors: '1/3' },
    { id: 3, name: 'John Doe', email: 'john@gmail.com', role: 'User', status: 'Verified', factors: '2/3' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-2">Manage user accounts and verification states.</p>
        </div>
        <button className="bg-[#052558] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#052558]/20">
          Invite User
        </button>
      </div>

      <div className="glass-card overflow-hidden bg-white/60 border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Factors</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{user.role}</td>
                <td className="px-6 py-4 text-sm text-[#052558] font-medium">{user.factors}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <button className="text-[#052558] hover:opacity-80 font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
