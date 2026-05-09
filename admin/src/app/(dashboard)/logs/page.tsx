'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, Trash2, Download, FolderDown, X, Shield, Globe, ChevronLeft, Monitor, Clock } from 'lucide-react';
import { getLogs, deleteLog } from './actions';
import { useAlert } from '@/context/AlertContext';
import { useDeleteModal } from '@/context/DeleteModalContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LogsPage() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [lastRefreshed, setLastRefreshed] = React.useState<Date | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [isBulkExportOpen, setIsBulkExportOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<any>(null);
  
  // Bulk Export Filters
  const [bulkVendor, setBulkVendor] = React.useState('');
  const [bulkPortal, setBulkPortal] = React.useState<'ALL' | 'frontend' | 'vendor'>('ALL');
  const [bulkDate, setBulkDate] = React.useState('');
  const { triggerAlert } = useAlert();
  const { confirmDelete } = useDeleteModal();

  React.useEffect(() => {
    setMounted(true);
    async function loadLogs() {
      const data = await getLogs();
      setLogs(data);
      setLastRefreshed(new Date());
      setIsLoading(false);
    }
    
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const [filter, setFilter] = React.useState<'ALL' | 'FRONTEND' | 'VENDOR_PANEL'>('ALL');
  const [limit, setLimit] = React.useState<'ALL' | '25' | '50' | '75' | '100'>('ALL');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'FAILED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'LOGOUT': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPortalColor = (portal: string) => {
    switch (portal) {
      case 'vendor': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'frontend': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleDownloadPDF = (data: any | any[]) => {
    const doc = new jsPDF();
    const isArray = Array.isArray(data);
    
    doc.setFontSize(20);
    doc.setTextColor(5, 37, 88);
    doc.text(isArray ? 'Authix Bulk Audit Report' : 'Authix Log Entry Details', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 28);

    if (isArray) {
      const head = [['Vendor', 'Action', 'Source', 'IP', 'OS/Browser', 'Date']];
      const body = data.map(log => [
        `${log.vendorEmail}\n(${log.vendorId})`,
        log.action,
        log.portal,
        log.ip,
        `${log.os}\n${log.browser}`,
        new Date(log.createdAt).toLocaleString('en-IN')
      ]);

      autoTable(doc, {
        head: head,
        body: body,
        startY: 35,
        theme: 'striped',
        headStyles: { fillColor: [5, 37, 88], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 3 }
      });
    } else {
      const tableData = [
        ['Vendor ID', data.vendorId || '—'],
        ['Vendor Name', data.vendorName || '—'],
        ['Vendor Email', data.vendorEmail],
        ['Action', data.action],
        ['Portal', data.portal],
        ['Status', data.status],
        ['IP Address', data.ip],
        ['OS', data.os],
        ['Browser', data.browser],
        ['Date', new Date(data.createdAt).toLocaleDateString('en-IN')],
        ['Time', new Date(data.createdAt).toLocaleTimeString('en-IN')]
      ];

      autoTable(doc, {
        head: [['Field', 'Value']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [5, 37, 88], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
      });
    }

    doc.save(`Authix_Audit_${new Date().getTime()}.pdf`);
    triggerAlert('Log Report generated successfully', 'success');
  };

  const handleDeleteLog = (id: string) => {
    const log = logs.find(l => l._id === id);
    if (!log) return;

    confirmDelete({
      title: 'Delete Log Entry',
      itemName: log.vendorEmail,
      message: (
        <>
          This will permanently remove the log record for <span className="text-[#052558] font-bold uppercase">{log.vendorEmail}</span>. <br/>
          This action <span className="text-rose-600 font-bold uppercase">cannot be undone</span>.
        </>
      ),
      onConfirm: async () => {
        try {
          const result = await deleteLog(id);
          if (result.success) {
            setLogs(prev => prev.filter(l => l._id !== id));
            triggerAlert(`Log entry for ${log.vendorId} deleted successfully`, 'success');
          } else {
            triggerAlert(result.error || 'Failed to delete log entry', 'error');
          }
        } catch (error) {
          console.error('Delete error:', error);
          triggerAlert('An error occurred during deletion', 'error');
        }
      }
    });
  };

  return (
    <>
      <div className="space-y-5 pb-0.25 px-0.25">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold uppercase">Authentication Logs</h1>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-white/10 backdrop-blur-xl border border-white rounded-xl shadow-sm shadow-[#052558]/25 px-3.5 py-1 text-[12px] font-semibold  outline-none cursor-pointer w-auto transition-all duration-300 appearance-none text-center uppercase  hover:bg-white/80"
              >
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'FRONTEND', label: 'Frontend' },
                  { id: 'VENDOR_PANEL', label: 'Vendor' }
                ].map((opt) => (
                  <option key={opt.id} value={opt.id} className="font-bold text-[#052558] bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value as any)}
                className="bg-white/10 backdrop-blur-xl border border-white rounded-xl shadow-sm shadow-[#052558]/25 px-3.5 py-1 text-[12px] font-semibold  outline-none cursor-pointer w-auto transition-all duration-300 appearance-none text-center uppercase  hover:bg-white/80"
              >
                {['ALL', '25', '50', '75', '100'].map((val) => (
                  <option key={val} value={val} className="font-bold text-[#052558] text-center bg-white">
                    {val === 'ALL' ? 'All' : `Latest ${val}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsBulkExportOpen(true)}
              className="px-4 py-1 bg-white/10 backdrop-blur-xl border border-white rounded-xl shadow-sm shadow-[#052558]/25 text-[#052558] hover:bg-white/80 transition-all duration-300"
              title="Bulk Export Logs"
            >
              <FolderDown size={18} />
            </button>
          </div>
        </div>
        <div className="text-[12.5px] uppercase text-gray-500 font-semibold self-end md:self-center mb-1 h-5">
          {mounted && lastRefreshed
            ? `Last refreshed | ${lastRefreshed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | ${lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            : 'Loading…'}
        </div>
      </div>

      {/* Logs Table Section */}
      <div className="glass-card overflow-auto h-[54.75rem] no-scrollbar border-l border-gray-200">
        <table className="w-full text-center border-collapse">
          <thead className="sticky top-0 z-20 pt-0.25 bg-[#f8fafc] shadow-sm">
            <tr className="text-[16px] uppercase text-gray-600 font-semibold border-gray-100">
              <th className="p-4.75 font-semibold w-[9%] text-mono">Vendor ID</th>
              <th className="p-4.75 font-semibold w-[14%] text-mono">Vendor Email</th>
              <th className="p-4.75 font-semibold w-[8%] text-mono">Source</th>
              <th className="p-4.75 font-semibold w-[9%] text-mono">IP</th>
              <th className="p-4.75 font-semibold w-[10%] text-mono">OS</th>
              <th className="p-4.75 font-semibold w-[10.5%] text-mono">Browser</th>
              {/* <th className="p-4.75 font-semibold w-[14%] text-mono">Date & Time</th> */}
              <th className="p-4.75 font-semibold w-[7.5%] text-mono">Action</th>
              <th className="p-4.75 font-semibold w-[5%] text-mono">Status</th>
              <th className="p-4.75 font-semibold w-[6%] text-mono">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[13px]">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="py-16 text-gray-400 text-sm text-mono">Loading logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-gray-400 text-sm text-mono">No logs found.</td>
              </tr>
            ) : logs
                .filter(log => {
                  if (filter === 'ALL') return true;
                  if (filter === 'VENDOR_PANEL') return log.portal === 'vendor';
                  if (filter === 'FRONTEND') return log.portal === 'frontend';
                  return true;
                })
                .slice(0, limit === 'ALL' ? undefined : Number(limit))
                .map((log: any) => (
              <tr key={log._id} className="transition-all uppercase duration-1000 hover:bg-blue-50/30">
                <td className="p-4">
                  <div className="font-semibold text-gray-600 text-[13.5px]">{log.vendorId || '—'}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-600 text-[13.5px]">{log.vendorEmail}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[11.25px] font-semibold uppercase border ${getPortalColor(log.portal)}`}>
                    {log.portal === 'vendor' ? 'VENDOR' : 'FRONTEND'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-[13.5px] text-gray-600 font-semibold">{log.ip}</div>
                </td>
                <td className="p-4">
                  <div className="text-[13.5px] text-gray-600 font-semibold">{log.os}</div>
                </td>
                <td className="p-4">
                  <div className="text-[13.5px] text-gray-600 font-semibold">{log.browser}</div>
                </td>
                {/* <td className="p-4">
                  <div className="text-[13.5px] text-gray-600 font-semibold whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    <span className="mx-1.5">|</span>
                    {new Date(log.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </div>
                </td> */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[11.25px] font-semibold uppercase border ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[11.25px] font-semibold uppercase border ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => {
                        setSelectedLog(log);
                        setIsViewModalOpen(true);
                      }} 
                      className="text-gray-400 hover:text-indigo-600 p-1.5 transition-colors"
                    >
                      <Eye size={17} />
                    </button>
                    <button onClick={() => handleDownloadPDF(log)} className="text-gray-400 hover:text-black p-1.5 transition-colors">
                      <Download size={17} />
                    </button>
                    <button onClick={() => handleDeleteLog(log._id)} className="text-gray-400 hover:text-red-500 p-1.5 transition-colors">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {isViewModalOpen && selectedLog && createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#011023]/10 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsViewModalOpen(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-[950px] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#e6f0fa] flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-white">
            <div>
              <h3 className="text-xl uppercase font-bold text-[#052558]">Log Activity Details</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">ID: <span className="font-semibold text-gray-700">{selectedLog.vendorId}</span></p> 
                <button 
                  onClick={() => handleDownloadPDF(selectedLog)}
                  className="pl-2 text-gray-500 hover:text-[#052558]  rounded-full transition-colors"
                >
                  <Download size={15} /> 
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
            {/* Info Grid */}
            <div className="flex flex-col md:flex-row gap-6 w-full">
              {/* Vendor Section as 'Customer Info' */}
              <div className="space-y-4 w-full md:w-[46%]">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Vendor Info</h4>
                <div className="pt-4 rounded-xl uppercase space-y-2">
                  <p className="text-sm flex"><span className="text-gray-500 w-16 shrink-0">Name:</span> <span className="font-semibold text-[#011023] truncate" title={selectedLog.vendorName}>{selectedLog.vendorName || 'N/A'}</span></p>
                  <p className="text-sm flex"><span className="text-gray-500 w-16 shrink-0">Phone:</span> <span className="font-semibold text-gray-800 truncate">{selectedLog.vendorPhone || 'N/A'}</span></p>
                  <p className="text-sm flex"><span className="text-gray-500 w-16 shrink-0">Email:</span> <span className="font-semibold text-gray-800 truncate " title={selectedLog.vendorEmail}>{selectedLog.vendorEmail || 'N/A'}</span></p>
                </div>
              </div>

              {/* Device Section as 'Vehicle Info' */}
              <div className="space-y-4 w-full md:w-[28%]">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Device Info</h4>
                <div className="pt-4 rounded-xl uppercase space-y-2">
                  <p className="text-sm"><span className="text-gray-500 w-16 inline-block">OS:</span> <span className="font-semibold text-[#011023]">{selectedLog.os || 'N/A'}</span></p>
                  <p className="text-sm"><span className="text-gray-500 w-16 inline-block">Browser:</span> <span className="font-semibold text-gray-800 truncate">{selectedLog.browser || 'N/A'}</span></p>
                  <p className="text-sm"><span className="text-gray-500 w-16 inline-block">IP:</span> <span className="font-semibold text-gray-800">{selectedLog.ip || 'N/A'}</span></p>
                </div>
              </div>

              {/* Status Section as 'Other Details' */}
              <div className="flex flex-col gap-4.5 w-full md:w-[35%]">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Security Details</h4>
                  <div className="flex items-center mt-7 gap-3">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider w-24">Status</h4>
                    <div className="flex uppercase items-center gap-2">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border border-transparent ${getStatusColor(selectedLog.status)}`}>
                        {selectedLog.status}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl flex items-center gap-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Source</h4>
                    <span className={`text-xs ml-5 font-bold px-3 py-1 rounded-full uppercase border ${getPortalColor(selectedLog.portal)}`}>
                      {selectedLog.portal === 'vendor' ? 'Vendor Portal' : 'Frontend'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Action At</h4>
                    <span className="text-xs ml-2 font-bold text-gray-600 uppercase">
                      {new Date(selectedLog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | 
                      {new Date(selectedLog.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Summary as 'Service Details' */}
            <div className="space-y-4"> 
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Activity Summary</h4>
              <div className="bg-white border border-[#e6f0fa] p-4 gap-5 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <h5 className="font-bold text-[#052558] uppercase text-[15.5px]">{selectedLog.action} Attempt</h5>
                  <p className="text-sm uppercase text-gray-500 mt-1">Originating from: <span className="font-semibold text-gray-700">{selectedLog.portal === 'vendor' ? 'Official Vendor Dashboard' : 'Authix Frontend Application'}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  
                </div>
              </div>
            </div>

            {/* Technical Context */}
            {/* <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Technical Context</h4>
              <div className="w-full bg-white border border-[#e6f0fa] p-5 rounded-xl shadow-sm uppercase">
                <p className="text-xs font-bold text-gray-400 tracking-tight mb-2">Raw User Agent String</p>
                <div className="p-3 bg-slate-50 rounded-lg text-[11px] font-mono text-gray-500 break-all leading-relaxed border border-slate-100">
                  {selectedLog.userAgent}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>,
      document.body
    )}
    {isBulkExportOpen && (
      <BulkExportModal 
        isOpen={isBulkExportOpen}
        onClose={() => setIsBulkExportOpen(false)}
        logs={logs}
        handleDownloadPDF={handleDownloadPDF}
      />
    )}
    </>
  );
}

// Bulk Export Modal Component (Simplified for integration)
function BulkExportModal({ 
  isOpen, 
  onClose, 
  logs, 
  handleDownloadPDF 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  logs: any[],
  handleDownloadPDF: (log: any | any[]) => void 
}) {
  const [vendor, setVendor] = React.useState('');
  const [portal, setPortal] = React.useState<'ALL' | 'frontend' | 'vendor'>('ALL');
  const [date, setDate] = React.useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    let filtered = [...logs];
    
    if (vendor) {
      filtered = filtered.filter(l => 
        l.vendorId?.toLowerCase().includes(vendor.toLowerCase()) || 
        l.vendorEmail?.toLowerCase().includes(vendor.toLowerCase())
      );
    }
    
    if (portal !== 'ALL') {
      filtered = filtered.filter(l => l.portal === portal);
    }
    
    if (date) {
      filtered = filtered.filter(l => {
        const d = new Date(l.createdAt).toISOString().split('T')[0];
        return d === date;
      });
    }

    if (filtered.length === 0) {
      alert('No logs found matching these criteria');
      return;
    }

    handleDownloadPDF(filtered);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#011023]/10 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-[#e6f0fa] flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-white">
          <div>
            <h3 className="text-xl uppercase font-bold text-[#052558]">Bulk Export Logs</h3>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-tighter">Configure Export Criteria</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Specific Vendor (ID/Email)</label>
            <input 
              type="text" 
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="All Vendors"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-[#052558]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Portal Source</label>
            <select 
              value={portal}
              onChange={(e) => setPortal(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white outline-none transition-all font-bold text-[#052558] appearance-none"
            >
              <option value="ALL">All Portals</option>
              <option value="frontend">Frontend Application</option>
              <option value="vendor">Vendor Dashboard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Target Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white outline-none transition-all font-bold text-[#052558]"
            />
          </div>

          <button
            onClick={handleExport}
            className="w-full py-4 bg-[#052558] text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-[#011023] transition-all mt-4 flex items-center justify-center gap-2"
          >
            <Download size={16} /> Export Selected Logs
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
