import React from 'react';
import { Search as SearchIcon, Compass } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { BookmarkCard } from '../components/BookmarkCard';
import { RECENT_ADDITIONS } from '../data';

export const SearchScreen: React.FC = () => {
  const popularTags = ['Architecture', 'Typography', 'AI Research', 'Minimalism', 'Philosophy'];

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 pb-24">
      <TopBar title="The Archivist" />
      
      <main className="px-6 pt-6 max-w-2xl mx-auto">
        {/* Search Input */}
        <section className="mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-slate-300" />
            </div>
            <input 
              className="w-full h-14 bg-slate-100 dark:bg-slate-900 rounded-sm pl-12 pr-4 border-none focus:ring-0 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_0_0_1px_rgba(9,20,38,0.2)] transition-all text-[#091426] dark:text-white placeholder:text-slate-300 font-body" 
              placeholder="Search your library..." 
              type="text"
            />
          </div>
        </section>

        {/* Suggested Tags / Trending */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400">Popular Explorations</h2>
            <span className="text-[10px] font-medium uppercase text-[#091426] dark:text-white cursor-pointer tracking-wider">Clear history</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <button 
                key={tag}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Search Results List */}
        <section>
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-6">Recent Additions</h2>
          <div className="space-y-6">
            {RECENT_ADDITIONS.map(bookmark => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        </section>

        {/* Empty State Visual Subtle Anchor */}
        <div className="mt-16 flex flex-col items-center opacity-10">
          <Compass size={64} className="text-[#091426] dark:text-white" />
          <p className="font-bold text-lg tracking-tight mt-2 text-[#091426] dark:text-white">Curate Your Knowledge</p>
        </div>
      </main>
    </div>
  );
};
