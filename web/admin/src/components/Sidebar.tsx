'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, AppWindow, Key, FileText, Shield, Database, 
  BarChart3, Settings, History, ChevronLeft, ChevronRight, CreditCard, 
  Mail, Star, Bell, UserSquare2, LogOut, Lock, LockKeyholeOpen, Loader2,
  ShieldAlert
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useVault } from '@/context/VaultContext';
import { startAuthentication } from '@simplewebauthn/browser';

const publicItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Payments', icon: CreditCard, href: '/payments' },
  { name: 'Vendors', icon: UserSquare2, href: '/vendors' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Clients (Apps)', icon: AppWindow, href: '/clients' },
  { name: 'Security', icon: Shield, href: '/security' },
  { name: 'System Logs', icon: Database, href: '/system-logs' },
];

const logItems = [
  { name: 'Authentication Logs', icon: History, href: '/logs' },
  { name: 'Activity Logs', icon: FileText, href: '/activity-logs' },
  { name: 'Security Logs', icon: ShieldAlert, href: '/security-logs' },
];

const protectedItems = [
  { name: 'API Keys', icon: Key, href: '/api-keys' },
];

const bottomItems = [
  { name: 'Messages', icon: Mail, href: '/messages' },
  { name: 'Reviews', icon: Star, href: '/reviews' },
  { name: 'Notifications', icon: Bell, href: '/notifications' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { isUnlocked: isLogsUnlocked, setIsUnlocked: setIsLogsUnlocked, triggerVault } = useVault();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleSignOut = () => {
    // Clear the auth cookie
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  // Auto-lock Logs Vault logic
  useEffect(() => {
    const isLogPath = logItems.some(item => pathname === item.href) || pathname === '/vault';
    
    // If we're unlocked but navigate to a non-log path, lock it again
    if (isLogsUnlocked && !isLogPath) {
      setIsLogsUnlocked(false);
    }
  }, [pathname, isLogsUnlocked, setIsLogsUnlocked]);

  // Auto-lock Security logic (existing)
  useEffect(() => {
    const isProtectedPath = protectedItems.some(item => pathname === item.href);
    if (!isProtectedPath && isUnlocked && pathname !== '/dashboard') {
      setIsUnlocked(false);
    }
  }, [pathname, isUnlocked]);

  const handleUnlock = async () => {
    if (isUnlocked) return;
    
    setAuthLoading(true);
    try {
      const optionsRes = await fetch('/api/auth/webauthn/login');
      
      const contentType = optionsRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned HTML instead of JSON. Please refresh and try again.`);
      }

      const options = await optionsRes.json();

      if (!optionsRes.ok) {
        if (options.error === 'No passkeys registered') {
          return await handleRegister();
        }
        throw new Error(options.error || 'Failed to start authentication');
      }

      // 2. Data Safety: Ensure all binary fields are Base64URL strings
      const toBase64URL = (obj: any) => {
        const bytes = new Uint8Array(Object.values(obj));
        return btoa(String.fromCharCode(...bytes))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };

      if (typeof options.challenge !== 'string') {
        options.challenge = toBase64URL(options.challenge);
      }
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred: any) => ({
          ...cred,
          id: typeof cred.id === 'string' ? cred.id : toBase64URL(cred.id)
        }));
      }

      const authResponse = await startAuthentication(options);
      const verifyRes = await fetch('/api/auth/webauthn/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authResponse }),
      });

      const result = await verifyRes.json();
      if (result.verified) {
        setIsUnlocked(true);
      } else {
        throw new Error('Verification failed');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message !== 'Registration triggered') {
        alert(err.message || 'Verification failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      const confirmReg = confirm("No passkey is registered for this account. Would you like to register this device now to unlock the vault?");
      if (!confirmReg) throw new Error('Registration cancelled');

      const optionsRes = await fetch('/api/auth/webauthn/enroll');
      const options = await optionsRes.json();
      if (!optionsRes.ok) throw new Error(options.error);

      const { startRegistration } = await import('@simplewebauthn/browser');
      
      // Data Safety: Ensure all binary fields are Base64URL strings
      const toBase64URL = (obj: any) => {
        const bytes = new Uint8Array(Object.values(obj));
        return btoa(String.fromCharCode(...bytes))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };

      if (typeof options.challenge !== 'string') {
        options.challenge = toBase64URL(options.challenge);
      }
      if (options.user && typeof options.user.id !== 'string') {
        options.user.id = toBase64URL(options.user.id);
      }

      const registrationResponse = await startRegistration(options);

      const verifyRes = await fetch('/api/auth/webauthn/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationResponse }),
      });

      const result = await verifyRes.json();
      if (result.verified) {
        setIsUnlocked(true);
        alert('Biometric registration successful! The security vault is now unlocked.');
      } else {
        throw new Error(result.error || 'Registration verification failed');
      }
    } catch (err: any) {
      alert('Registration error: ' + err.message);
    }
  };

  const renderItem = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
          isActive 
            ? 'bg-white text-[#011023] shadow-md shadow-[#052558]/20 border border-slate-100' 
            : 'text-slate-500 hover:text-[#052558] hover:bg-[#f8fafc]'
        } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
      >
        <item.icon size={isCollapsed ? 20 : 18} className={isActive ? 'text-[#011023]' : 'text-slate-500 group-hover:text-[#052558] transition-colors'} />
        {!isCollapsed && <span className="text-xs uppercase font-bold tracking-tight">{item.name}</span>}
        {isActive && !isCollapsed && (
          <div className="absolute right-3 w-1.5 h-1.5 bg-[#052558] rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-22' : 'w-64'} bg-white border-r border-[#e6f0fa] flex flex-col z-50 shadow-sm transition-all duration-300`}>
      {/* Header Section */}
      <div className={`pt-6 px-[18px] border-b border-[#e6f0fa] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative pb-6`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : 'flex'}`}>
              <Image src="/AuthixLogo.svg" alt="Authix Logo" width={32} height={32} className="w-8 h-8 object-contain" />
              <div>
                  <h1 className="text-xl font-bold text-[#052558] tracking-tight">AUTHIX</h1>
              </div>
          </div>
          
          {isCollapsed && (
              <Image
                  src="/AuthixLogo.svg"
                  alt="Authix Logo"
                  width={32}
                  height={32}
                  className="w-10 h-8 object-contain cursor-pointer hover:scale-105 transition-transform"
                  onClick={toggleSidebar}
              />
          )}

          {!isCollapsed && (
              <button
                  onClick={toggleSidebar}
                  className="bg-white border border-[#e6f0fa] text-[#052558] rounded-full p-1.5 shadow-sm hover:bg-[#f0f7ff] transition-all cursor-pointer"
              >
                  <ChevronLeft size={14} />
              </button>
          )}
      </div>

      <nav className={`flex-grow flex flex-col gap-1.5 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'} custom-scrollbar p-4`}> 
        
        {/* Public Items */}
        {publicItems.map((item, index) => (
            <React.Fragment key={item.name}>
                {renderItem(item)}

                {/* Insert Logs Vault after Clients (Apps) */}
                {item.name === 'Clients (Apps)' && (
                    <div className="">
                        {!isLogsUnlocked ? (
                            <div className={`relative flex items-center justify-center ${isCollapsed ? 'py-' : 'py-'}`}>
                                <button
                                onClick={() => {
                                    router.push('/vault');
                                    triggerVault();
                                }}
                                className={`flex items-center gap-3 transition-all duration-200 group relative
                                    ${pathname === '/vault' 
                                        ? 'bg-white border border-slate-100 shadow-sm shadow-[#052558]/30 text-slate-500' 
                                        : ' text-slate-500 bg-transparent border-transparent'}
                                    hover:text-[#052558] 
                                    ${isCollapsed ? 'h-11 w-11 rounded-[14px] justify-center' : 'w-full px-3 py-3 rounded-xl'}`}
                                >
                                <Lock size={isCollapsed ? 20 : 18} className={`${pathname === '/vault' ? 'text-[#052558]' : 'text-slate-400'} `} />
                                {!isCollapsed && <span className="text-xs uppercase font-bold tracking-tight">Logs Vault</span>}
                                </button>
                            </div>
                        ) : isCollapsed ? (
                            <div className="relative flex items-center justify-center py-1 group">
                                <Link
                                    href="/vault"
                                    className={`flex items-center justify-center h-11 w-11 rounded-[14px] transition-all duration-200 relative bg-white border border-slate-100 shadow-sm shadow-[#052558]/30 text-[#052558] hover:text-[#052558]`}
                                >
                                    <LockKeyholeOpen size={20} />
                                </Link>
                                {/* Vertical Flyout - Appears further to the right */}
                                <div className="absolute left-[calc(100%+32px)] flex flex-col gap-1 p-2.5 bg-white/95 backdrop-blur-md border border-[#e6f0fa] rounded-2xl shadow-md shadow-[#052558]/10 animate-in fade-in slide-in-from-left-4 duration-500 z-[60]">
                                    {/* Arrow pointing to lock icon */}
                                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-[#e6f0fa] rotate-45" />
                                    
                                    {logItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200 relative group/item ${
                                            isActive 
                                            ? 'bg-white text-[#011023] shadow-sm shadow-[#052558]/20 border border-slate-100' 
                                            : 'text-slate-500 hover:text-[#052558] hover:bg-[#f8fafc] '
                                        }`}
                                        >
                                        <item.icon size={20} className={isActive ? 'text-[#011023]' : 'text-slate-500 group-hover/item:text-[#052558] transition-colors'} />
                                        </Link>
                                    );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-300">
                            <Link 
                                href="/vault"
                                className={`flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl transition-all border bg-white shadow-md shadow-[#052558]/10 border-slate-100 ${
                                    pathname === '/vault' ? 'text-[#052558]' : 'text-[#052558]'
                                }`}
                            >
                                <LockKeyholeOpen size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Logs Unlocked</span>
                            </Link>
                            {logItems.map(renderItem)}
                            <div className="h-px bg-slate-100 my-4 mx-2" />
                            </div>
                        )}
                    </div>
                )}
            </React.Fragment>
        ))}

        <div className=" border-t border-slate-50" />

        {/* Bottom Items */}
        {bottomItems.map(renderItem)}

        {/* Lock Section */}
        <div className="border-t border-slate-50">
          {!isUnlocked ? (
            <button
              onClick={handleUnlock}
              disabled={authLoading}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative w-full
                bg-slate-50 text-slate-400 hover:text-[#052558] hover:bg-[#f0f7ff]
                ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
            >
              {authLoading ? (
                <Loader2 className="animate-spin text-[#527FB0]" size={isCollapsed ? 20 : 18} />
              ) : (
                <Lock size={isCollapsed ? 20 : 18} className="group-hover:text-[#052558] transition-colors" />
              )}
              {!isCollapsed && (
                <span className="text-xs uppercase font-bold tracking-tight">
                  {authLoading ? 'Verifying...' : 'Security Vault'}
                </span>
              )}
            </button>
          ) : (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <div className={`flex items-center gap-3 px-3 py-2 text-[#527FB0] mb-1 ${isCollapsed ? 'justify-center' : ''}`}>
                <LockKeyholeOpen size={18} />
                {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">Unlocked</span>}
              </div>
              {protectedItems.map(renderItem)}
            </div>
          )}
        </div>

        {/* Settings */}
        {renderItem({ name: 'Settings', icon: Settings, href: '/settings' })}
      </nav>

      <div className={`p-4 flex flex-col gap-1 ${isCollapsed ? 'items-center' : ''} border- border-[#e6f0fa]`}>
        <button 
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-rose-600 transition-all duration-200 w-full ${isCollapsed ? 'justify-center w-11 h-11 p-0' : ''}`}
        >
          <LogOut size={isCollapsed ? 18 : 18} />
          {!isCollapsed && <span className="text-xs uppercase font-bold tracking-tight">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
