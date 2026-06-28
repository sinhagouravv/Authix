'use client';

import React from 'react';
import { UserSquare2, Search, Filter, ShieldCheck, Star, Eye, Download, UserX, Trash2 } from 'lucide-react';
import { getVendors, deleteVendor } from './actions';

export default function VendorsPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [highlightedRow, setHighlightedRow] = React.useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = React.useState<Date | null>(null);

  const [banUser, setBanUser] = React.useState<any>(null);
  const [banReason, setBanReason] = React.useState('');
  const [banSuccess, setBanSuccess] = React.useState('');

  React.useEffect(() => {
    async function loadVendors() {
      // Only show loading on initial fetch to avoid flickering during auto-refresh
      const data = await getVendors();
      setUsers(data);
      setLastRefreshed(new Date());
      setIsLoading(false);
    }
    
    loadVendors();
    const interval = setInterval(loadVendors, 5000);
    return () => clearInterval(interval);
  }, []);


  const formatDate = (dateString: string, includeTime = false) => {
    const date = new Date(dateString);
    if (includeTime) {
      return date.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleViewUser = (user: any) => console.log('View user:', user);
  const handleDownloadPDF = (user: any) => console.log('Download PDF:', user);

  const handleDeleteVendor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      const result = await deleteVendor(id);
      if (result.success) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        alert(result.error || 'Failed to delete vendor');
      }
    }
  };

  return (

    <div className="space-y-5 pb-0.25 px-0.25">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold uppercase">Vendors</h1>
        </div>
        <div className="text-[12.5px] uppercase text-gray-500 font-semibold self-end md:self-center mb-1">
          {lastRefreshed
            ? `Last refreshed | ${lastRefreshed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | ${lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            : 'Loading…'}
        </div>
      </div>



      {/* Vendors Table Section */}
      <div className="glass-card overflow-auto h-[54.75rem] no-scrollbar border-l border-gray-200">
          <table className="w-full text-center border-collapse">
            <thead className="sticky top-0 z-20 pt-0.25 bg-[#f8fafc] shadow-sm">
              <tr className="text-[16px] uppercase text-gray-600 font-semibold border-gray-100">
                <th className="p-4.75 font-semibold w-[10%] text-mono">Vendor ID</th>
                <th className="p-4.75 font-semibold w-[12%] text-mono">Vendor</th>
                <th className="p-4.75 font-semibold w-[13%] text-mono">Phone</th>
                <th className="p-4.75 font-semibold w-[22%] text-mono">Email</th>
                <th className="p-4.75 font-semibold w-[10%] text-mono">Join Date</th>
                <th className="p-4.75 font-semibold w-[10%] text-mono">Join Time</th>
                <th className="p-4.75 font-semibold w-[9%] text-mono">Status</th>
                <th className="p-4.75 font-semibold w-[10%] text-mono">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-gray-400 text-sm text-mono">Loading vendors...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-gray-400 text-sm text-mono">No vendors found.</td>
                </tr>
              ) : users.map((user: any) => {
                const rowId = user.vendorId || user._id;
                return (
                  <tr key={user._id} id={`row-${rowId}`} className={`transition-all uppercase duration-1000 ${highlightedRow === rowId ? 'bg-emerald-100/60 rounded-2xl relative z-20 scale-[1.01]' : 'hover:bg-blue-50/30'}`}>
                    <td className="p-4">
                      <div className="font-semibold text-gray-600 text-[13.5px]">{user.vendorId || '—'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-600 text-[13.5px]">{user.name || user.email.split('@')[0]}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[13.5px] text-gray-600 font-semibold">{user.phone || '—'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[13.5px] text-gray-600 font-semibold">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-[13.5px] font-semibold text-gray-600 text-mono">
                        {formatDate(user.createdAt, false)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[13.5px] font-semibold text-gray-600 text-mono">
                        {new Date(user.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                      </span>
                    </td>


                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[11.5px] font-semibold uppercase border ${getStatusColor(user.isVerified ? 'Verified' : 'Pending')}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleViewUser(user)} className="text-gray-400 hover:text-black p-1.5">
                          <Eye size={17} />
                        </button>
                        <button onClick={() => handleDownloadPDF(user)} className="text-gray-400 hover:text-black p-1.5">
                          <Download size={17} />
                        </button>
                        <button onClick={() => { setBanUser(user); setBanReason(''); setBanSuccess(''); }} className="text-gray-400 hover:text-black p-1.5">
                          <UserX size={17} />
                        </button>
                        <button onClick={() => handleDeleteVendor(user._id)} className="text-gray-400 hover:text-red-500 p-1.5">
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>
    </div>
  );
}
