import React from 'react';
import { Sun, Code, Briefcase, BookOpen, GraduationCap, Share2, Archive, User, Folder as FolderIcon } from 'lucide-react';
import { Folder } from '../types';

interface FolderBadgeProps {
  name: string;
  icon: React.ReactNode;
  count: number;
}

const FolderBadge: React.FC<FolderBadgeProps> = ({ name, icon, count }) => (
  <button className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-black/5 active:scale-95 transition-all text-left group w-full">
    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#091426] group-hover:text-white transition-colors flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-bold text-[#091426] dark:text-white truncate tracking-tight">{name}</h4>
      <p className="text-[10px] text-slate-400 font-medium">{count} items</p>
    </div>
  </button>
);

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'sun': return <Sun size={14} />;
    case 'tool': case 'code': return <Code size={14} />;
    case 'briefcase': return <Briefcase size={14} />;
    case 'book-open': case 'book': return <BookOpen size={14} />;
    case 'graduation-cap': return <GraduationCap size={14} />;
    case 'share-2': return <Share2 size={14} />;
    case 'archive': return <Archive size={14} />;
    case 'user': return <User size={14} />;
    default: return <FolderIcon size={14} />;
  }
};

interface CoreFoldersProps {
  folders: Folder[];
}

export const CoreFolders: React.FC<CoreFoldersProps> = ({ folders }) => {
  // We only show the main 6 core folders on the home screen
  const displayFolders = folders.slice(0, 6);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">
          Core Folders / 1-Click
        </h3>
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-900 ml-4"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {displayFolders.map(folder => (
          <FolderBadge 
            key={folder.id} 
            name={folder.name} 
            icon={getIcon(folder.iconName)} 
            count={folder.itemCount} 
          />
        ))}
        {displayFolders.length === 0 && (
          <p className="col-span-2 text-center py-4 text-xs text-slate-400 italic">No folders found</p>
        )}
      </div>
    </section>
  );
};
