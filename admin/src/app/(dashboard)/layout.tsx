'use client';

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className={`flex-grow ${isCollapsed ? 'ml-24' : 'ml-64'} p- pt-26 relative overflow-x-hidden transition-all duration-300 bg-slate-50`}>
          {/* Subtle decorative elements for the light theme */}
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-[#527FB0]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-[1500px] mx-auto overflow-y-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}
