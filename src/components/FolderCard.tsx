import React from 'react';
import { Plus, Palette, Terminal, Utensils, Bolt, BookOpen } from 'lucide-react';
import { Folder } from '../types';
import { cn } from '../lib/utils';

interface FolderCardProps {
  folder?: Folder;
  isNew?: boolean;
  onClick?: () => void;
}

const ICON_MAP: Record<string, any> = {
  palette: Palette,
  terminal: Terminal,
  restaurant: Utensils,
  bolt: Bolt,
  menu_book: BookOpen,
};

export const FolderCard: React.FC<FolderCardProps> = ({ folder, isNew, onClick }) => {
  if (isNew) {
    return (
      <button 
        onClick={onClick}
        className="col-span-1 aspect-square bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center rounded-xl active:scale-95 transition-transform duration-200 group"
      >
        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mb-3 shadow-sm group-hover:bg-[#091426] group-hover:text-white transition-colors">
          <Plus size={24} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#091426] dark:text-white">
          New Folder
        </span>
      </button>
    );
  }

  if (!folder) return null;

  const Icon = ICON_MAP[folder.iconName] || BookOpen;

  if (folder.name === 'Coding') {
    return (
      <div 
        onClick={onClick}
        className="col-span-2 h-40 bg-white dark:bg-slate-900 rounded-xl p-6 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200"
      >
        <div className="absolute top-0 right-0 w-32 h-full opacity-10">
          {folder.bgImageUrl && <img src={folder.bgImageUrl} alt="Code" className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col h-full justify-between relative z-10">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Icon size={20} className="text-[#091426] dark:text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
              {folder.itemCount} Items
            </span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#091426] dark:text-white tracking-tight">
              {folder.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {folder.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (folder.name === 'Deep Research') {
    return (
      <div 
        onClick={onClick}
        className="col-span-2 h-32 bg-white dark:bg-slate-900 rounded-xl p-6 flex items-center gap-6 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer active:scale-[0.98] transition-all duration-200"
      >
        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
          <Icon size={32} className="text-[#091426] dark:text-white" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-lg text-[#091426] dark:text-white tracking-tight">
              {folder.name}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {folder.itemCount} Items
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {folder.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="col-span-1 aspect-square bg-white dark:bg-slate-900 rounded-xl p-5 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer active:scale-[0.98] transition-all duration-200"
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Icon size={20} className="text-[#091426] dark:text-white" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
          {folder.itemCount} Items
        </span>
      </div>
      <div>
        <h3 className="font-bold text-lg text-[#091426] dark:text-white tracking-tight">
          {folder.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {folder.description}
        </p>
      </div>
    </div>
  );
};
