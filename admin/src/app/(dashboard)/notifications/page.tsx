'use client';

import React from 'react';
import { 
  Bell, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  UserPlus, 
  CreditCard,
  MoreVertical,
  Search
} from 'lucide-react';

const notifications = [
  { 
    id: 1, 
    type: 'security', 
    title: 'New login from unknown device', 
    description: 'A new login was detected on device "MacBook Pro 16" in London, UK.', 
    time: '2 mins ago', 
    unread: true, 
    icon: ShieldCheck, 
    color: 'text-rose-600', 
    bg: 'bg-rose-50' 
  },
  { 
    id: 2, 
    type: 'success', 
    title: 'Deployment successful', 
    description: 'System update v2.4.0 has been successfully deployed to all regions.', 
    time: '45 mins ago', 
    unread: true, 
    icon: CheckCircle2, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50' 
  },
  { 
    id: 3, 
    type: 'user', 
    title: 'New client registration', 
    description: 'Enterprise client "Nexus Core" has completed the onboarding process.', 
    time: '2 hours ago', 
    unread: false, 
    icon: UserPlus, 
    color: 'text-[#052558]', 
    bg: 'bg-[#f0f7ff]' 
  },
  { 
    id: 4, 
    type: 'payment', 
    title: 'Subscription renewed', 
    description: 'Monthly subscription for "Blue Horizon" was renewed successfully.', 
    time: '5 hours ago', 
    unread: false, 
    icon: CreditCard, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50' 
  },
  { 
    id: 5, 
    type: 'warning', 
    title: 'API rate limit warning', 
    description: 'Client "AlphaStream" has reached 90% of their daily API quota.', 
    time: '1 day ago', 
    unread: false, 
    icon: AlertTriangle, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50' 
  }
];

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with system events and security alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100/50 rounded-xl w-fit">
          <button className="px-5 py-2 bg-[#f0f7ff] text-[#052558] rounded-lg shadow-sm">All</button>
          <button className="px-5 py-2 text-slate-500 font-bold text-xs hover:text-slate-700">Unread</button>
          <button className="px-5 py-2 text-slate-500 font-bold text-xs hover:text-slate-700">Security</button>
          <button className="px-5 py-2 text-slate-500 font-bold text-xs hover:text-slate-700">System</button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            className="pl-10 pr-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#052558]/10 outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      {/* Notification List */}
      <div className="glass-card divide-y divide-slate-100">
        <div className="p-4 flex items-center justify-between bg-slate-50/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</span>
          <button className="text-[10px] font-bold text-[#052558] uppercase tracking-widest hover:opacity-80">Mark all as read</button>
        </div>
        
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-6 flex gap-4 hover:bg-slate-50/50 transition-all group relative ${notif.unread ? 'bg-white/60' : 'bg-white/20'}`}>
            {notif.unread && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#052558] rounded-r-full" />
            )}
            
            <div className={`p-3 rounded-2xl ${notif.bg} ${notif.color} h-fit flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <notif.icon className="w-6 h-6" />
            </div>
            
            <div className="flex-grow space-y-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm ${notif.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                {notif.description}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button className="text-[10px] font-bold text-[#052558] hover:underline uppercase tracking-wider">View Details</button>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider">Dismiss</button>
              </div>
            </div>
            
            <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:bg-slate-100 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          Load Earlier Notifications
        </button>
      </div>
    </div>
  );
}
