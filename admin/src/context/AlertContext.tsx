'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type AlertType = 'success' | 'error';
type AlertPhase = 'hidden' | 'ball-top' | 'ball-center' | 'line';

interface AlertState {
  show: boolean;
  message: string;
  phase: AlertPhase;
  type: AlertType;
}

interface AlertContextType {
  triggerAlert: (msg: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<AlertState>({ 
    show: false, 
    message: '', 
    phase: 'hidden', 
    type: 'error' 
  });

  const triggerAlert = useCallback((msg: string, type: AlertType = 'error') => {
    // Simple mechanism to prevent overlapping alerts
    setAlertState(prev => {
      if (prev.show) return prev;
      return { show: true, message: msg, phase: 'ball-top', type };
    });

    setTimeout(() => setAlertState({ show: true, message: msg, phase: 'ball-center', type }), 50);
    setTimeout(() => setAlertState({ show: true, message: msg, phase: 'line', type }), 500);
    setTimeout(() => setAlertState({ show: true, message: msg, phase: 'ball-center', type }), 5500);
    setTimeout(() => setAlertState({ show: true, message: msg, phase: 'ball-top', type }), 6000);
    setTimeout(() => setAlertState({ show: false, message: '', phase: 'hidden', type }), 6500);
  }, []);

  return (
    <AlertContext.Provider value={{ triggerAlert }}>
      {children}
      
      {/* Global Custom Animated Alert */}
      {alertState.show && typeof document !== 'undefined' && createPortal(
        <div className={`fixed inset-x-0 top-14 z-[9999] flex justify-center pointer-events-none`}>
          <div 
            className={`${alertState.type === 'success' ? 'bg-emerald-100 border-emerald-200 shadow-emerald-500/10' : 'bg-rose-100 border-rose-200 shadow-rose-500/10'} border flex items-center justify-center transition-all duration-[500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden
              ${alertState.phase === 'ball-top' ? 'max-w-[40px] min-w-[40px] px-0 h-10 rounded-full -translate-y-24 opacity-0 scale-50' : ''}
              ${alertState.phase === 'ball-center' ? 'max-w-[40px] min-w-[40px] px-0 h-10 rounded-full translate-y-0 opacity-100 scale-100' : ''}
              ${alertState.phase === 'line' ? 'max-w-[600px] min-w-[100px] px-8 h-11 rounded-full translate-y-0 opacity-100 scale-100' : ''}
            `}
          >
            <span className={`${alertState.type === 'success' ? 'text-emerald-500' : 'text-rose-500'} font-semibold text-[13px] tracking-widest uppercase transition-opacity duration-300 whitespace-nowrap
              ${alertState.phase === 'line' ? 'opacity-100 delay-300' : 'opacity-0'}
            `}>
              {alertState.message}
            </span>
          </div>
        </div>,
        document.body
      )}
    </AlertContext.Provider>
  );
};
