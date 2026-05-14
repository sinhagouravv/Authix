'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import { today, getLocalTimeZone } from '@internationalized/date';
import { useCalendar } from '@/context/CalendarContext';
import { useAlert } from '@/context/AlertContext';

interface ExportOptions {
  logs: any[];
  handleDownloadPDF: (filteredLogs: any[]) => void;
  title?: string;
}

interface ExportContextType {
  openExport: (options: ExportOptions) => void;
  closeExport: () => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export const useExport = () => {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error('useExport must be used within an ExportProvider');
  }
  return context;
};

export const ExportProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<ExportOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { triggerAlert } = useAlert();

  // Modal Internal State
  const [vendor, setVendor] = useState('');
  const [portal, setPortal] = useState<'ALL' | 'frontend' | 'vendor'>('ALL');
  const [date, setDate] = useState('');
  const [vendorMode, setVendorMode] = useState<'ALL' | 'custom'>('ALL');
  const [portalMode, setPortalMode] = useState<'ALL' | 'custom'>('ALL');
  const [dateMode, setDateMode] = useState<'ALL' | 'custom'>('ALL');
  
  const { openCalendar } = useCalendar();
  const dateButtonRef = React.useRef<HTMLButtonElement>(null);

  const openExport = useCallback((opts: ExportOptions) => {
    setOptions(opts);
    setIsOpen(true);
    // Reset modal state when opening
    setVendor('');
    setPortal('ALL');
    setDate('');
    setVendorMode('ALL');
    setPortalMode('ALL');
    setDateMode('ALL');
  }, []);

  const closeExport = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDateClick = () => {
    if (dateButtonRef.current) {
      openCalendar({
        selected: date ? new Date(date) : undefined,
        onSelect: (d) => {
          const offset = d.getTimezoneOffset();
          const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
          setDate(adjustedDate.toISOString().split('T')[0]);
        },
        anchorRect: dateButtonRef.current.getBoundingClientRect(),
        maxValue: today(getLocalTimeZone())
      });
    }
  };

  const handleExport = () => {
    if (!options) return;
    let filtered = [...options.logs];
    
    if (vendorMode === 'custom' && vendor) {
      filtered = filtered.filter(l => 
        l.vendorId?.toLowerCase().includes(vendor.toLowerCase()) || 
        l.vendorEmail?.toLowerCase().includes(vendor.toLowerCase())
      );
    }
    
    if (portalMode === 'custom' && portal !== 'ALL') {
      filtered = filtered.filter(l => l.portal === portal);
    }
    
    if (dateMode === 'custom' && date) {
      filtered = filtered.filter(l => {
        const d = new Date(l.createdAt || l.timestamp).toISOString().split('T')[0];
        return d === date;
      });
    }

    if (filtered.length === 0) {
      triggerAlert("There is no log for the selected date", "error");
      return;
    }

    options.handleDownloadPDF(filtered);
    closeExport();
  };

  return (
    <ExportContext.Provider value={{ openExport, closeExport }}>
      {children}
      
      {isOpen && options && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#011023]/10 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeExport}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#e6f0fa] flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
              <div className="w-10"></div>
              <div className="flex-1 text-center">
                <h3 className="text-xl uppercase font-bold text-[#052558]">{options.title || "Export Authentication Logs"}</h3>
              </div>
              <button onClick={closeExport} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-3 gap-6">
              {/* Column 1: Vendor Selection */}
              <div className="space-y-4 flex flex-col">
                <label className="text-[13px] font-bold uppercase text-center tracking-widest text-gray-400">Vendor</label>
                <select 
                  value={vendorMode}
                  onChange={(e) => setVendorMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-center border border-[#052558]/10 rounded-xl text-[13px] uppercase font-semibold text-[#052558] outline-none transition-all appearance-none shadow-sm focus:border-[#052558]/10"
                >
                  <option value="ALL">All</option>
                  <option value="custom">Custom</option>
                </select>
                
                <input
                  type="text"
                  value={vendor}
                  disabled={vendorMode === 'ALL'}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setVendor(val);
                  }}
                  className={`w-full px-3.5 py-2.5 text-center border border-[#052558]/10 rounded-xl text-[13px] uppercase font-semibold text-[#052558] outline-none transition-all shadow-sm ${vendorMode === 'ALL' ? 'cursor-not-allowed bg-slate-50/50' : 'focus:bg-white focus:border-[#052558]/10'}`}
                />
              </div>

              {/* Column 2: Portal Source */}
              <div className="space-y-4 flex flex-col">
                <label className="text-[13px] font-bold uppercase text-center tracking-widest text-gray-400">Source</label>
                <select 
                  value={portalMode}
                  onChange={(e) => setPortalMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-center border border-[#052558]/10 rounded-xl text-[13px] uppercase font-semibold text-[#052558] outline-none transition-all appearance-none shadow-sm focus:border-[#052558]/10"
                >
                  <option value="ALL">All</option>
                  <option value="custom">Custom</option>
                </select>
                
                <select 
                  value={portal}
                  disabled={portalMode === 'ALL'}
                  onChange={(e) => setPortal(e.target.value as any)}
                  className={`w-full px-3.5 py-2.5 text-center border border-[#052558]/10 rounded-xl text-[13px] uppercase font-semibold text-[#052558] outline-none transition-all appearance-none shadow-sm ${portalMode === 'ALL' ? 'cursor-not-allowed bg-slate-50/50' : 'focus:bg-white focus:border-[#052558]/10'}`}
                >
                  <option value=""></option>
                  <option value="frontend">Frontend Application</option>
                  <option value="vendor">Vendor Dashboard</option>
                </select>
              </div>

              {/* Column 3: Target Date */}
              <div className="space-y-4 flex flex-col">
                <label className="text-[13px] font-bold uppercase text-center tracking-widest text-gray-400">Date</label>
                <select 
                  value={dateMode}
                  onChange={(e) => setDateMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-center border border-[#052558]/10 rounded-xl text-[13px] uppercase font-semibold text-[#052558] outline-none transition-all appearance-none shadow-sm focus:border-[#052558]/10"
                >
                  <option value="ALL">All</option>
                  <option value="custom">Custom</option>
                </select>
                
                <button
                  ref={dateButtonRef}
                  disabled={dateMode === 'ALL'}
                  onClick={handleDateClick}
                  className={`w-full px-3.5 py-2 text-center border border-[#052558]/10 rounded-xl text-[13px] uppercase font-semibold text-[#052558] outline-none transition-all shadow-sm min-h-[41px] ${dateMode === 'ALL' ? 'cursor-not-allowed bg-slate-50/50' : 'focus:bg-white focus:border-[#052558]/10 bg-white'}`}
                >
                  {date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : (dateMode === 'ALL' ? '\u00A0' : 'Select Date')}
                </button>
              </div>

              <div className="col-span-3">
                <button
                  onClick={handleExport}
                  className="w-full py-4 bg-[#052558] text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 transition-all mt-4 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Download size={16} /> Export Selected Logs
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ExportContext.Provider>
  );
};
