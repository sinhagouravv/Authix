'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface DeleteModalOptions {
  title: string;
  message: ReactNode;
  itemName: string;
  onConfirm: () => Promise<void>;
}

interface DeleteModalContextType {
  confirmDelete: (options: DeleteModalOptions) => void;
}

const DeleteModalContext = createContext<DeleteModalContextType | undefined>(undefined);

export const useDeleteModal = () => {
  const context = useContext(DeleteModalContext);
  if (!context) {
    throw new Error('useDeleteModal must be used within a DeleteModalProvider');
  }
  return context;
};

export const DeleteModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DeleteModalOptions | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = (opts: DeleteModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (!options) return;
    setDeleting(true);
    try {
      await options.onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error('Global Delete Modal Error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return;
    setIsOpen(false);
    setOptions(null);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || deleting) return;
      if (e.key === 'Enter') {
        handleConfirm();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, deleting, options]);

  return (
    <DeleteModalContext.Provider value={{ confirmDelete }}>
      {children}
      
      {isOpen && options && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#011023]/10 backdrop-blur-sm transition-all duration-300"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center uppercase space-y-4">
              <h3 className="text-2xl font-bold text-[#011023] uppercase tracking-tighter mb-9">{options.title}</h3>
              <div className="text-[13px] text-gray-500 font-medium leading-relaxed">
                {options.message}
              </div>
            </div>
            <div className="p-2 bg-gray-50/80 border-t border-gray-100 grid grid-cols-2 gap-3 pb-8 px-8">
              <button 
                onClick={handleClose}
                disabled={deleting}
                className="px-4 py-3.5 bg-white border border-gray-200 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-gray-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                disabled={deleting}
                className="px-4 py-3.5 bg-rose-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </DeleteModalContext.Provider>
  );
};
