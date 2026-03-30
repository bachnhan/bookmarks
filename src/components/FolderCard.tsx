import React from 'react';
import { Plus, Palette, Terminal, Utensils, Bolt, BookOpen, Sun, Code, Briefcase, GraduationCap, Share2, Archive, User } from 'lucide-react';
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
  'book-open': BookOpen,
  sun: Sun,
  tool: Code,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  'share-2': Share2,
  archive: Archive,
  user: User
};

export const FolderCard: React.FC<FolderCardProps> = ({ folder, isNew, onClick }) => {
  if (isNew) {
    return (
      <button 
        onClick={onClick}
        className="col-span-1 aspect-square bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center rounded-xl active:scale-95 transition-transform duration-200 group border-2 border-dashed border-slate-200 dark:border-slate-800"
      >
        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mb-3 shadow-sm group-hover:bg-[#091426] group-hover:text-white transition-colors">
          <Plus size={24} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#091426] dark:group-hover:text-white">
          New Workspace
        </span>
      </button>
    );
  }

  if (!folder) return null;

  const Icon = ICON_MAP[folder.iconName] || BookOpen;

  return (
    <div 
      onClick={onClick}
      className="col-span-1 aspect-square bg-white dark:bg-slate-900 rounded-xl p-5 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer active:scale-[0.98] transition-all duration-200 hover:shadow-xl hover:shadow-black/5 group"
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#091426] group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/50 px-2 py-1 rounded-sm">
          {folder.itemCount} Items
        </span>
      </div>
      <div>
        <h3 className="font-bold text-sm text-[#091426] dark:text-white tracking-tight">
          {folder.name}
        </h3>
        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {folder.description}
        </p>
      </div>
    </div>
  );
};

