import React from 'react';
import { Search, Plus } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { BookmarkCard } from '../components/BookmarkCard';
import { MOCK_BOOKMARKS } from '../data';

interface HomeScreenProps {
  onAddClick: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onAddClick }) => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 pb-24">
      <TopBar title="The Archivist" onAddClick={onAddClick} />
      
      <main className="px-6 pt-6 max-w-2xl mx-auto">
        {/* Search Section */}
        <section className="mb-8">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-sm flex items-center px-4 py-3 group focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-1 focus-within:ring-[#091426]/20 transition-all">
            <Search size={20} className="text-slate-400 mr-3" />
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-[#091426] dark:text-white placeholder:text-slate-300 font-body" 
              placeholder="Search your knowledge..." 
              type="text"
            />
          </div>
        </section>

        {/* Minimalist Filters */}
        <section className="mb-10 flex gap-6 overflow-x-auto no-scrollbar pb-2">
          <button className="text-[#091426] dark:text-white font-semibold text-sm tracking-tight border-b-2 border-[#091426] dark:border-white pb-1 shrink-0">Recent</button>
          <button className="text-slate-400 font-medium text-sm tracking-tight hover:text-[#091426] dark:hover:text-white transition-colors shrink-0">Folders</button>
          <button className="text-slate-400 font-medium text-sm tracking-tight hover:text-[#091426] dark:hover:text-white transition-colors shrink-0">Tags</button>
          <button className="text-slate-400 font-medium text-sm tracking-tight hover:text-[#091426] dark:hover:text-white transition-colors shrink-0">Favorites</button>
        </section>

        {/* Bento/Editorial Card List */}
        <div className="grid grid-cols-1 gap-6">
          {MOCK_BOOKMARKS.map(bookmark => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </main>

      {/* FAB */}
      <button 
        onClick={onAddClick}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-[#091426] to-[#1e293b] text-white rounded-full shadow-[0_4px_32px_rgba(9,20,38,0.2)] flex items-center justify-center active:scale-90 transition-transform duration-150 z-50"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};
