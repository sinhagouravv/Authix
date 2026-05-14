'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar-rac';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { createPortal } from 'react-dom';

interface CalendarOptions {
  selected?: Date;
  onSelect: (date: Date) => void;
  anchorRect?: DOMRect;
  maxValue?: any;
  minValue?: any;
}

interface CalendarContextType {
  openCalendar: (options: CalendarOptions) => void;
  closeCalendar: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<CalendarOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCalendar = useCallback((opts: CalendarOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeCalendar = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CalendarContext.Provider value={{ openCalendar, closeCalendar }}>
      {children}
      
      {isOpen && options && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10001] pointer-events-auto" onClick={closeCalendar}>
          <div 
            className="absolute" 
            style={{ 
              top: options.anchorRect ? options.anchorRect.bottom + window.scrollY + 8 : '50%',
              left: options.anchorRect ? options.anchorRect.left + window.scrollX : '50%',
              transform: options.anchorRect ? 'none' : 'translate(-50%, -50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              selected={options.selected}
              maxValue={options.maxValue}
              minValue={options.minValue}
              onSelect={(date) => {
                if (date) {
                  options.onSelect(date);
                  closeCalendar();
                }
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </CalendarContext.Provider>
  );
};
