'use client';

import React from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';

const stats = [
  {
    name: 'Total Revenue',
    value: '$128,430.00',
    change: '+12.5%',
    trend: 'up',
    icon: CreditCard,
    color: 'text-[#052558]',
    bg: 'bg-[#f0f7ff]'
  },
  {
    name: 'Active Subscriptions',
    value: '2,840',
    change: '+3.2%',
    trend: 'up',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    name: 'Pending Payments',
    value: '$12,450.00',
    change: '-2.4%',
    trend: 'down',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    name: 'Failed Transactions',
    value: '12',
    change: '+1.2%',
    trend: 'up',
    icon: AlertCircle,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  }
];

const transactions = [
  { id: 'TX-9284', user: 'Alex Rivera', email: 'alex@example.com', amount: '$120.00', status: 'Success', date: '2024-04-29' },
  { id: 'TX-9283', user: 'Sarah Chen', email: 'sarah.c@gmail.com', amount: '$45.00', status: 'Success', date: '2024-04-29' },
  { id: 'TX-9282', user: 'Marcus Wright', email: 'm.wright@company.io', amount: '$299.00', status: 'Pending', date: '2024-04-28' },
  { id: 'TX-9281', user: 'Elena Gilbert', email: 'elena.g@mystic.com', amount: '$12.00', status: 'Failed', date: '2024-04-28' },
  { id: 'TX-9280', user: 'David Miller', email: 'davidm@tech.com', amount: '$85.00', status: 'Success', date: '2024-04-27' },
  { id: 'TX-9279', user: 'Sophia Loren', email: 'sophia@fashion.it', amount: '$150.00', status: 'Success', date: '2024-04-27' },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments</h1>
          <p className="text-slate-500 mt-1">Manage transactions, subscriptions, and financial metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#052558] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#052558]/20">
            <TrendingUp className="w-4 h-4" />
            Payouts
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 flex flex-col gap-4 group hover:border-[#052558]/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40">
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="pl-10 pr-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#052558]/10 outline-none w-full md:w-64 transition-all"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/20">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-[#052558] bg-[#f0f7ff] px-2 py-1 rounded">
                      {tx.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{tx.user}</span>
                      <span className="text-xs text-slate-500">{tx.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{tx.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      tx.status === 'Success' ? 'bg-emerald-50 text-emerald-700' :
                      tx.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {tx.status === 'Success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {tx.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {tx.status === 'Failed' && <AlertCircle className="w-3.5 h-3.5" />}
                      {tx.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 group-hover:text-slate-600 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-sm text-slate-500">Showing 6 of 148 transactions</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-all disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
