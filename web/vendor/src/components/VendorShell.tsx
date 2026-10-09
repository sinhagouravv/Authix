'use client';

import React from 'react';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { usePathname } from "next/navigation";

function VendorContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  // If on login page, render full screen without Sidebar and Header
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className={`flex-grow ${isCollapsed ? 'ml-24' : 'ml-64'} p-8 pt-28 relative min-h-screen transition-all duration-300 bg-[#f8fafc]`}>
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-[1500px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function VendorShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <VendorContent>
        {children}
      </VendorContent>
    </SidebarProvider>
  );
}
