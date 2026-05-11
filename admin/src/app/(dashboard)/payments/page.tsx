'use client';

import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';
import { getPayments, deletePayment } from './actions';

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [lastRefreshed, setLastRefreshed] = React.useState<Date | null>(null);

  React.useEffect(() => {
    async function loadPayments() {
      const data = await getPayments();
      setPayments(data);
      setLastRefreshed(new Date());
      setIsLoading(false);
    }
    
    loadPayments();
    const interval = setInterval(loadPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date, includeTime = false) => {
    if (includeTime) {
      return date.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).replace(',', ' |');
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Failed': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleViewPayment = (payment: any) => console.log('View payment:', payment);
  const handleDownloadInvoice = (payment: any) => console.log('Download Invoice:', payment);

  const handleDeletePayment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      const result = await deletePayment(id);
      if (result.success) {
        setPayments(payments.filter(p => p._id !== id));
      }
    }
  };

  return (
    <div className="space-y-5 pb-0.25 px-0.25">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold uppercase">Payments</h1>
        </div>
        <div className="text-[12.5px] uppercase text-gray-500 font-semibold self-end md:self-center mb-1">
          {lastRefreshed
            ? `Last refreshed | ${lastRefreshed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | ${lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            : 'Loading…'}
        </div>
      </div>

      {/* Payments Table Section */}
      <div className="glass-card overflow-auto h-[54.75rem] no-scrollbar border-l border-gray-200">
        <table className="w-full text-center border-collapse">
          <thead className="sticky top-0 z-20 pt-0.25 bg-[#f8fafc] shadow-sm">
            <tr className="text-[16px] uppercase text-gray-600 font-semibold border-gray-100">
              <th className="p-4.75 font-semibold w-[10%] text-mono">Payment ID</th>
              <th className="p-4.75 font-semibold w-[9%] text-mono">Vendor ID</th>
              <th className="p-4.75 font-semibold w-[13%] text-mono">Vendor Name</th>
              <th className="p-4.75 font-semibold w-[17%] text-mono">Vendor Email</th>
              <th className="p-4.75 font-semibold w-[16%] text-mono">Paid At</th>
              <th className="p-4.75 font-semibold w-[7%] text-mono">Amount</th>
              <th className="p-4.75 font-semibold w-[10%] text-mono">Method</th>
              <th className="p-4.75 font-semibold w-[8%] text-mono">Status</th>
              <th className="p-4.75 font-semibold w-[8%] text-mono">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[13px]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-16 text-gray-400 text-sm text-mono">Loading payments...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-gray-400 text-sm text-mono">No payments found.</td>
              </tr>
            ) : payments.map((payment: any) => (
              <tr key={payment._id} className="transition-all uppercase duration-1000 hover:bg-blue-50/30">
                <td className="p-4">
                  <div className="font-semibold text-gray-600 text-[13.5px]">{payment.paymentId}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-600 text-[13.5px]">{payment.vendorId}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-600 text-[13.5px]">{payment.vendorName}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-600 text-[13.5px]">{payment.vendorEmail}</div>
                </td>
                <td className="p-4">
                  <div className="text-[13.5px] text-gray-600 font-semibold">
                    {formatDate(payment.paidAt, true)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-700 text-[13.5px]">{payment.amount}</div>
                </td>
                <td className="p-4">
                  <div className="text-[13.5px] text-gray-600 font-semibold uppercase">{payment.method}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[11.5px] font-semibold uppercase border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleViewPayment(payment)} className="text-gray-400 hover:text-black p-1.5 transition-colors">
                      <Eye size={17} />
                    </button>
                    <button onClick={() => handleDownloadInvoice(payment)} className="text-gray-400 hover:text-black p-1.5 transition-colors">
                      <Download size={17} />
                    </button>
                    <button onClick={() => handleDeletePayment(payment._id)} className="text-gray-400 hover:text-red-500 p-1.5 transition-colors">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
