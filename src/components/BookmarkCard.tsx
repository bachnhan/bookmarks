import React from 'react';
import { MoreHorizontal, FileText, ChevronRight } from 'lucide-react';
import { Bookmark } from '../types';
import { cn } from '../lib/utils';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onClick?: () => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onClick }) => {
  if (bookmark.type === 'feature') {
    return (
      <article 
        onClick={onClick}
        className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden group active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {bookmark.faviconUrl ? (
                  <img src={bookmark.faviconUrl} alt={bookmark.source} className="w-4 h-4" />
                ) : (
                  <FileText size={14} className="text-slate-400" />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                {bookmark.source}
              </span>
            </div>
            <MoreHorizontal size={16} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-[#091426] dark:text-white mb-2 tracking-tight leading-tight">
            {bookmark.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {bookmark.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map(tag => (
              <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-medium px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (bookmark.type === 'medium') {
    return (
      <article 
        onClick={onClick}
        className="bg-white dark:bg-slate-900 rounded-xl p-6 group active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {bookmark.faviconUrl ? (
                  <img src={bookmark.faviconUrl} alt={bookmark.source} className="w-3 h-3" />
                ) : (
                  <FileText size={12} className="text-slate-400" />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                {bookmark.source}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#091426] dark:text-white mb-1 tracking-tight">
              {bookmark.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">
              {bookmark.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map(tag => (
                <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-medium px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {bookmark.imageUrl && (
            <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
              <img src={bookmark.imageUrl} alt="Article Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </article>
    );
  }

  if (bookmark.type === 'dense') {
    return (
      <article 
        onClick={onClick}
        className="bg-white dark:bg-slate-900 rounded-xl p-5 group active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-[#091426] dark:text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#091426] dark:text-white tracking-tight">
                {bookmark.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                {bookmark.description}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </div>
      </article>
    );
  }

  if (bookmark.type === 'detailed') {
    return (
      <article 
        onClick={onClick}
        className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden group active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
      >
        <div className="h-32 bg-[#1e293b] relative">
          {bookmark.imageUrl && (
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <img src={bookmark.imageUrl} alt="Code Background" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="absolute bottom-4 left-6">
            <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter text-[#091426]">
              Resource
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            {bookmark.faviconUrl && <img src={bookmark.faviconUrl} alt={bookmark.source} className="w-4 h-4" />}
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              {bookmark.source}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#091426] dark:text-white mb-2 tracking-tight">
            {bookmark.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            {bookmark.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map(tag => (
              <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-medium px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return null;
};
