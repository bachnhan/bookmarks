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
      <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-slate-950">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-slate-400 hover:text-blue-600 transition-colors">
              <X size={22} />
            </button>
            <h1 className="font-black tracking-tight text-xl text-slate-900 dark:text-slate-100">
              {title}
            </h1>
          </div>
          <button onClick={onConfirm} className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-90">
            <Check size={20} strokeWidth={3} />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-slate-950">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="text-slate-400 hover:text-blue-600 transition-colors">
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h1>
        </div>
        <button onClick={onAddClick} className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all duration-300 active:scale-90">
          <PlusCircle size={20} />
        </button>
      </div>
    </header>
  );
};
