'use client';

import React, { useState } from 'react';
import { Shield, Smartphone, Fingerprint, Plus, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';

export default function SecurityPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  // In a real app, you'd fetch the user's email from session
  const [email, setEmail] = useState('admin@authix.com'); 

  const registerPasskey = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Get registration options from server
      const optionsRes = await fetch(`/api/auth/webauthn/register?email=${email}`);
      const options = await optionsRes.json();

      if (!optionsRes.ok) throw new Error(options.error || 'Failed to get options');

      // 2. Trigger browser WebAuthn API
      const registrationResponse = await startRegistration(options);

      // 3. Send response back to server for verification
      const verifyRes = await fetch('/api/auth/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, registrationResponse }),
      });

      const result = await verifyRes.json();

      if (result.verified) {
        setMessage({ type: 'success', text: 'Passkey registered successfully!' });
      } else {
        throw new Error(result.error || 'Verification failed');
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-[#052558] tracking-tight">Security Settings</h1>
        <p className="text-slate-500 mt-1">Manage your multi-factor authentication and security keys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passkeys Section */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#052558] rounded-xl">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#052558]">Passkeys</h3>
              <p className="text-xs text-slate-500">Use TouchID, FaceID, or security keys to log in.</p>
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <div className="space-y-3">
             {/* Mocking a list of passkeys */}
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center gap-3">
                 <Smartphone className="w-5 h-5 text-slate-400" />
                 <div>
                   <p className="text-sm font-bold text-[#052558]">iPhone 15 Pro</p>
                   <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Added 2 days ago</p>
                 </div>
               </div>
               <button className="text-slate-300 hover:text-rose-500 transition-colors">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>

          <button 
            onClick={registerPasskey}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#052558] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#052558]/20 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Processing...' : 'Register New Passkey'}
          </button>
        </div>

        {/* 2FA Section */}
        <div className="glass-card p-6 space-y-6 opacity-60 grayscale cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#052558]">Two-Factor (TOTP)</h3>
              <p className="text-xs text-slate-500">Authenticator apps like Google or Authy.</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 italic">Authentication factor configuration is currently managed by your organization's root policy.</p>
        </div>
      </div>
    </div>
  );
}
