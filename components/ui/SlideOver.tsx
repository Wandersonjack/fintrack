import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, title, description, children }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent scrolling on body when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end isolate">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm animate-fade-in transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div className="relative w-full md:w-3/5 lg:w-1/2 bg-white h-full shadow-2xl flex flex-col animate-slide-in-right sm:rounded-l-2xl border-l border-zinc-100 z-10">
        <div className="flex items-start justify-between p-6 pb-0 shrink-0">
          <div className="space-y-1">
             <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>
             {description && <p className="text-zinc-500 text-sm">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};