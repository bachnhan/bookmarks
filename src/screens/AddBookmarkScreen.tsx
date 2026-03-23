import React from 'react';
import { Folder, X } from 'lucide-react';
import { TopBar } from '../components/TopBar';

interface AddBookmarkScreenProps {
  onClose: () => void;
}

export const AddBookmarkScreen: React.FC<AddBookmarkScreenProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 pb-24">
      <TopBar 
        title="Add Bookmark" 
        variant="modal" 
        onClose={onClose} 
        onConfirm={onClose}
      />
      
      <main className="px-6 py-8 max-w-md mx-auto space-y-10">
        {/* URL Input Section */}
        <section className="space-y-3">
          <label className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Destination</label>
          <div className="bg-slate-100 dark:bg-slate-900 rounded-sm group focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors border border-transparent focus-within:border-[#091426]/20">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 p-4 font-body text-[#091426] dark:text-white placeholder:text-slate-300 resize-none h-24" 
              placeholder="Paste your URL here..."
            />
          </div>
        </section>

        {/* Meta Information Section */}
        <section className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Title (Optional)</label>
            <input 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none focus:ring-0 p-4 rounded-sm font-body text-[#091426] dark:text-white placeholder:text-slate-300 focus:bg-white dark:focus:bg-slate-800 transition-colors" 
              placeholder="E.g. The Future of Typography" 
              type="text"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Description</label>
            <textarea 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none focus:ring-0 p-4 rounded-sm font-body text-[#091426] dark:text-white placeholder:text-slate-300 resize-none h-32 focus:bg-white dark:focus:bg-slate-800 transition-colors" 
              placeholder="Add a personal note or summary..."
            />
          </div>
        </section>

        {/* Organization Section */}
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Select Folder</label>
              <button className="text-[#091426] dark:text-white text-[10px] font-medium uppercase tracking-widest">+ New Folder</button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2 group hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Folder size={14} />
                <span className="text-xs font-medium">Research</span>
              </button>
              <button className="bg-[#1e293b] text-white px-4 py-2 rounded-full flex items-center gap-2">
                <Folder size={14} className="fill-current" />
                <span className="text-xs font-medium">Inspiration</span>
              </button>
              <button className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2 group hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Folder size={14} />
                <span className="text-xs font-medium">Reading List</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Tags</label>
            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-sm flex flex-wrap gap-2 items-center">
              <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">#design</span>
                <button className="hover:text-red-500 transition-colors"><X size={12} /></button>
              </div>
              <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">#architecture</span>
                <button className="hover:text-red-500 transition-colors"><X size={12} /></button>
              </div>
              <input 
                className="bg-transparent border-none focus:ring-0 p-1 text-xs placeholder:text-slate-300 flex-grow" 
                placeholder="Add tag..." 
                type="text"
              />
            </div>
          </div>
        </section>

        {/* Save Action */}
        <section className="pt-4">
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-br from-[#091426] to-[#1e293b] text-white py-5 rounded-md text-sm font-bold tracking-widest uppercase shadow-2xl shadow-[#091426]/10 active:scale-95 transition-transform duration-150"
          >
            Save to Archive
          </button>
        </section>
      </main>
    </div>
  );
};
