'use client';

import React from 'react';
import { 
  UserSquare2, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';

const stats = [
  {
    name: 'Total Vendors',
    value: '842',
    change: '+5.4%',
    trend: 'up',
    icon: UserSquare2,
    color: 'text-[#052558]',
    bg: 'bg-[#f0f7ff]'
  },
  {
    name: 'Active Partnerships',
    value: '728',
    change: '+12.1%',
    trend: 'up',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    name: 'Pending Verification',
    value: '24',
    change: '-2',
    trend: 'down',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    name: 'Avg. Trust Score',
    value: '9.4/10',
    change: '+0.2',
    trend: 'up',
    icon: Star,
    color: 'text-[#527FB0]',
    bg: 'bg-blue-50'
  }
];

const vendors = [
  { id: 'VEN-001', name: 'Global Tech Solutions', category: 'Infrastructure', status: 'Verified', trustScore: 9.8, joined: '2024-01-15' },
  { id: 'VEN-002', name: 'Nexus Security Group', category: 'Cybersecurity', status: 'Verified', trustScore: 9.6, joined: '2024-02-02' },
  { id: 'VEN-003', name: 'AlphaStream Media', category: 'Content Delivery', status: 'Pending', trustScore: 8.4, joined: '2024-04-20' },
  { id: 'VEN-004', name: 'CloudPeak Systems', category: 'Storage', status: 'Verified', trustScore: 9.2, joined: '2023-11-10' },
  { id: 'VEN-005', name: 'Innovate AI', category: 'Artificial Intelligence', status: 'Flagged', trustScore: 6.5, joined: '2024-03-25' },
  { id: 'VEN-006', name: 'Horizon Logistics', category: 'Supply Chain', status: 'Verified', trustScore: 9.0, joined: '2024-01-30' },
];

export default function VendorsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#052558] tracking-tight">Vendors</h1>
          <p className="text-slate-500 mt-1">Manage external partnerships, service providers, and trust levels.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#052558] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#052558]/20">
          <Plus className="w-4 h-4" />
          Add New Vendor
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 flex flex-col gap-4 group hover:border-[#052558]/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-[#052558] mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vendors Table Section */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40">
          <h3 className="text-lg font-bold text-[#052558]">Partner Network</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search partners..." 
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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name & Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trust Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/20">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-[#052558] bg-[#f0f7ff] px-2 py-1 rounded">
                      {vendor.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#052558]">{vendor.name}</span>
                      <span className="text-[10px] font-bold text-[#527FB0] uppercase tracking-wider">{vendor.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            vendor.trustScore >= 9 ? 'bg-emerald-500' :
                            vendor.trustScore >= 8 ? 'bg-[#527FB0]' :
                            'bg-amber-500'
                          }`}
                          style={{ width: `${vendor.trustScore * 10}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{vendor.trustScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                      vendor.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                      vendor.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {vendor.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                      {vendor.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {vendor.status === 'Flagged' && <AlertCircle className="w-3 h-3" />}
                      {vendor.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {vendor.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-[#f0f7ff] rounded-lg text-[#527FB0] transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 group-hover:text-slate-600 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-medium text-slate-500">Showing 6 of 842 vendors</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-white transition-all disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-white transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
