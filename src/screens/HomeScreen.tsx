import React, { useEffect, useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { BookmarkCard } from '../components/BookmarkCard';
import { supabase } from '../lib/supabase';
import { Bookmark } from '../types';

interface HomeScreenProps {
  onAddClick: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onAddClick }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .order('addedat', { ascending: false });

      if (fetchError) throw fetchError;

      // Map DB fields to application Bookmark type if they differ
      const mappedBookmarks: Bookmark[] = (data || []).map((b: any) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        url: b.url,
        source: b.source || new URL(b.url).hostname,
        faviconUrl: b.faviconurl,
        imageUrl: b.imageurl,
        tags: b.tags || [],
        addedAt: b.addedat,
        type: b.type || 'medium'
      }));

      setBookmarks(mappedBookmarks);
    } catch (err: any) {
      console.error('Error fetching bookmarks:', err);
      setError(err.message || 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" />
            <p className="text-sm">Retrieving your knowledge...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center">
            <p className="font-medium mb-4">{error}</p>
            <button 
              onClick={fetchBookmarks}
              className="bg-white px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow text-sm"
            >
              Try again
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-slate-300">
              <Plus size={32} />
            </div>
            <p className="text-slate-500 mb-6">Your archive is empty</p>
            <button 
              onClick={onAddClick}
              className="bg-[#091426] dark:bg-white text-white dark:text-[#091426] px-8 py-3 rounded-md text-sm font-bold tracking-widest uppercase transition-all hover:opacity-80 active:scale-95"
            >
              Add First Bookmark
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookmarks.map(bookmark => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
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
