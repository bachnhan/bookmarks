import React from 'react';
import { Menu, PlusCircle, X, Check } from 'lucide-react';

interface TopBarProps {
  title: string;
  onAddClick?: () => void;
  onMenuClick?: () => void;
  variant?: 'default' | 'modal';
  onClose?: () => void;
  onConfirm?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  onAddClick, 
  onMenuClick, 
  variant = 'default',
  onClose,
  onConfirm
}) => {
  if (variant === 'modal') {
    return (
      <header className="w-full sticky top-0 z-40 bg-[#f9f9f9] dark:bg-slate-950">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-[#091426] dark:text-slate-100 hover:opacity-70 transition-opacity">
              <X size={24} />
            </button>
            <h1 className="font-['Inter'] font-semibold tracking-tight text-lg text-[#091426] dark:text-slate-100">
              {title}
            </h1>
          </div>
          <button onClick={onConfirm} className="text-[#091426] dark:text-slate-100 hover:opacity-70 transition-opacity">
            <Check size={24} />
          </button>
        </div>
        <div className="bg-[#eeeeee] dark:bg-slate-900 h-px w-full" />
      </header>
    );
  }

  return (
    <header className="w-full sticky top-0 z-40 bg-[#f9f9f9] dark:bg-slate-950">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="text-[#091426] dark:text-slate-100 hover:opacity-70 transition-opacity">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-[#091426] dark:text-slate-100 tracking-tighter">
            {title}
          </h1>
        </div>
        <button onClick={onAddClick} className="text-[#091426] dark:text-slate-100 hover:opacity-70 transition-opacity scale-95 duration-200">
          <PlusCircle size={24} />
        </button>
      </div>
      <div className="bg-[#eeeeee] dark:bg-slate-900 h-px w-full" />
    </header>
  );
};
