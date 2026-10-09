'use client';

import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

const mockNotifications = [
  {
    id: '1',
    title: 'New Application Registered',
    message: 'App "Finance Portal SDK" was successfully provisioned with Client ID authix_cli_demo.',
    time: '10 minutes ago',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: '3FA Challenge Spike Detected',
    message: 'Elevated TOTP factor verification rate observed (24 requests in last 5 minutes).',
    time: '2 hours ago',
    type: 'warning',
    read: false,
  },
  {
    id: '3',
    title: 'Monthly Security Audit Complete',
    message: 'Zero anomalies or unauthorized access attempts found in the last 30 days.',
    time: '1 day ago',
    type: 'info',
    read: true,
  },
];

export default function VendorNotificationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Notifications</h1>
          <p className="text-slate-500 mt-2">Live security audit feeds and system alerts for your vendor account.</p>
        </div>
        <span className="px-3.5 py-1.5 bg-blue-50 text-[#052558] border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider">
          {mockNotifications.filter(n => !n.read).length} New Alerts
        </span>
      </div>

      <div className="max-w-4xl space-y-4">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-6 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
              notification.read 
                ? 'bg-white border-slate-200 opacity-80' 
                : 'bg-white border-blue-200 shadow-sm shadow-blue-500/5'
            }`}
          >
            <div className={`p-3 rounded-xl shrink-0 ${
              notification.type === 'success' 
                ? 'bg-emerald-50 text-emerald-600' 
                : notification.type === 'warning' 
                ? 'bg-amber-50 text-amber-600' 
                : 'bg-blue-50 text-blue-600'
            }`}>
              {notification.type === 'success' ? <ShieldCheck size={20} /> : notification.type === 'warning' ? <AlertTriangle size={20} /> : <Bell size={20} />}
            </div>

            <div className="flex-grow space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{notification.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock size={12} />
                  {notification.time}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
