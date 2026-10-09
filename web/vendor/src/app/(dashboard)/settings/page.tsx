'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, Globe, Save, CheckCircle2 } from 'lucide-react';

export default function VendorSettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your vendor organization, security policies, and webhook preferences.</p>
      </div>

      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        {/* Organization Info */}
        <div className="glass-card p-8 bg-white border-slate-200 shadow-sm rounded-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Organization Profile</h2>
              <p className="text-xs text-slate-500">Public metadata and vendor application details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Vendor / Company Name</label>
              <input
                type="text"
                defaultValue="Acme Security Corp"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#052558]/20 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Support / Security Email</label>
              <input
                type="email"
                defaultValue="security@acme.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#052558]/20 transition"
              />
            </div>
          </div>
        </div>

        {/* Security & 3FA Preferences */}
        <div className="glass-card p-8 bg-white border-slate-200 shadow-sm rounded-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">3FA Security Policy</h2>
              <p className="text-xs text-slate-500">Enforcement rules for factor authentication verification challenges.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">Enforce 3FA On All Client Logins</p>
                <p className="text-xs text-slate-500">Require TOTP and Mobile Biometric confirmation on every authentication attempt.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#052558] cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">Push Notification Timeout</p>
                <p className="text-xs text-slate-500">Maximum time allowed for user to approve biometric notification on mobile.</p>
              </div>
              <select defaultValue="60" className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none">
                <option value="30">30 Seconds</option>
                <option value="60">60 Seconds (Default)</option>
                <option value="120">120 Seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Webhooks & Alerts */}
        <div className="glass-card p-8 bg-white border-slate-200 shadow-sm rounded-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Webhooks & Notifications</h2>
              <p className="text-xs text-slate-500">Dispatch live auth events to your backend service.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Webhook Endpoint URL</label>
            <input
              type="url"
              placeholder="https://your-api.com/webhooks/authix"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#052558]/20 transition"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          {isSaved ? (
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase">
              <CheckCircle2 size={16} />
              <span>Settings saved successfully!</span>
            </div>
          ) : <div />}

          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-[#052558] hover:bg-[#0a3a8a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-950/20"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
