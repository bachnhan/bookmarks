import React, { useEffect, useState } from 'react';
import { Search, Plus, Loader2, Star, Folder as FolderIcon, LayoutList, Archive } from 'lucide-react';
import { BookmarkCard } from '../components/BookmarkCard';
import { bookmarkService } from '../services/bookmarkService';
import { Bookmark, Folder } from '../types';

interface HomeScreenProps {
  onAddClick: () => void;
  onEditClick: (bookmark: Bookmark) => void;
  folderId: string | null;
  isArchived: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onAddClick, 
  onEditClick,
  folderId,
  isArchived
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [folderId, isArchived]);

  const loadFolders = async () => {
    try {
      const fData = await bookmarkService.getFolders();
      setFolders(fData);
    } catch (err) {
      console.error('Error loading folders:', err);
    }
  };

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const bData = await bookmarkService.getBookmarks(folderId || undefined, isArchived);
      setBookmarks(bData);
    } catch (err: any) {
      console.error('Error loading bookmarks:', err);
      setError(err.message || 'Failed to sync with Neon');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;
    try {
      await bookmarkService.deleteBookmark(id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting bookmark:', err);
    }
  };

  const handleToggleStar = async (bookmarkId: string, currentStarred: boolean) => {
    try {
      const nextState = !currentStarred;
      await bookmarkService.toggleStar(bookmarkId, nextState);
      setBookmarks(prev => prev.map(b => b.id === bookmarkId ? { ...b, isStarred: nextState } : b));
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  const handleArchive = async (bookmarkId: string, currentArchived: boolean) => {
    try {
      const nextState = !currentArchived;
      await bookmarkService.updateBookmark(bookmarkId, { isArchived: nextState });
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (err) {
      console.error('Error archiving bookmark:', err);
    }
  };

  const handleMove = async (bookmarkId: string, newFolderId: string | null) => {
    try {
      await bookmarkService.updateBookmark(bookmarkId, { folder_id: newFolderId });
      if (folderId !== newFolderId) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      }
    } catch (err) {
      console.error('Error moving bookmark:', err);
    }
  };

  const filteredBookmarks = bookmarks.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q)
    );
  });

  const getActiveTitle = () => {
    if (isArchived) return 'Archived';
    if (folderId === '__unsorted__') return 'Unsorted';
    if (folderId) return folders.find(f => f.id === folderId)?.name || 'Folder';
    return 'All Library';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-full bg-slate-50/50">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600/60 mb-1">
            {isArchived ? <Archive size={14} /> : <LayoutList size={14} />}
            <span className="text-[10px] font-black tracking-widest uppercase">
              {isArchived ? 'Retention' : 'Collection'}
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {getActiveTitle()}
          </h1>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full md:w-72 transition-all shadow-sm"
            />
          </div>
          {!isArchived && (
            <button 
              onClick={onAddClick}
              className="p-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all duration-300 hover:-translate-y-1 active:scale-95 shrink-0"
            >
              <Plus size={22} strokeWidth={3} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-32 text-slate-400">
          <Loader2 className="animate-spin mb-4" />
          <p className="text-sm font-medium">Curating your knowledge...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 text-red-600 p-8 rounded-2xl text-center border border-red-100 dark:border-red-900/20">
          <p className="font-medium mb-4">{error}</p>
          <button 
            onClick={loadBookmarks}
            className="bg-white dark:bg-slate-900 px-6 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-sm font-bold"
          >
            Try again
          </button>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-32 text-center">
          <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-50 dark:shadow-none text-blue-100">
            <FolderIcon size={48} strokeWidth={1.5} className="text-blue-500/20" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No match for "{searchQuery}"</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs leading-relaxed">
            Try a different search term or explore another folder.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map(bookmark => (
            <BookmarkCard 
              key={bookmark.id} 
              bookmark={bookmark} 
              folders={folders}
              onEdit={() => onEditClick(bookmark)}
              onDelete={() => handleDeleteBookmark(bookmark.id)}
              onToggleStar={() => handleToggleStar(bookmark.id, !!bookmark.isStarred)}
              onArchive={() => handleArchive(bookmark.id, !!bookmark.isArchived)}
              onMove={(newFolderId) => handleMove(bookmark.id, newFolderId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
