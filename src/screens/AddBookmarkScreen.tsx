import React, { useState, useEffect } from 'react';
import { Folder as FolderIcon, X, Loader2, ChevronDown } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { bookmarkService } from '../services/bookmarkService';
import { Bookmark, Folder } from '../types';

interface AddBookmarkScreenProps {
  onClose: () => void;
  initialBookmark?: Bookmark | null; // Existing bookmark to edit
}

export const AddBookmarkScreen: React.FC<AddBookmarkScreenProps> = ({ onClose, initialBookmark }) => {
  const [url, setUrl] = useState(initialBookmark?.url || '');
  const [title, setTitle] = useState(initialBookmark?.title || '');
  const [description, setDescription] = useState(initialBookmark?.description || '');
  const [folderId, setFolderId] = useState(initialBookmark?.folder_id || '');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const data = await bookmarkService.getFolders();
      setFolders(data);
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  };

  const handleSave = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      let source = 'Web';
      try {
        if (url.startsWith('http')) {
          source = new URL(url).hostname.replace('www.', '');
        }
      } catch (e) {
        // Fallback to Web if URL is invalid
      }

      if (initialBookmark) {
        await bookmarkService.updateBookmark(initialBookmark.id, {
          url,
          title: title || url,
          description,
          folder_id: folderId || null
        });
      } else {
        await bookmarkService.addBookmark({
          url,
          title: title || url,
          description,
          source,
          tags: [],
          folder_id: folderId || undefined,
          type: 'medium'
        });
      }
      
      onClose();
    } catch (err: any) {
      console.error('Error saving bookmark:', err);
      setError(err.message || 'Failed to save bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <TopBar 
        title={initialBookmark ? "Edit Bookmark" : "Add Bookmark"} 
        variant="modal" 
        onClose={onClose} 
        onConfirm={handleSave}
      />
      
      <main className="px-6 py-8 max-w-md mx-auto space-y-10">
        {/* URL Input Section */}
        <section className="space-y-3">
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-600/40 ml-1">Destination</label>
          <div className="bg-white dark:bg-slate-900 rounded-2xl group focus-within:bg-white dark:focus-within:bg-slate-800 transition-all border border-slate-200/60 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-sm">
            <textarea 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 p-5 font-medium text-slate-900 dark:text-white placeholder:text-slate-300 resize-none h-28 outline-none" 
              placeholder="Paste your URL here..."
            />
          </div>
        </section>

        {/* Folder Selection Section */}
        <section className="space-y-3">
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-600/40 ml-1">Workspace / Folder</label>
          <div className="relative">
            <select 
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200/60 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 p-5 rounded-2xl font-bold text-slate-900 dark:text-white transition-all shadow-sm outline-none"
            >
              <option value="">Unsorted / Inbox</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
              <ChevronDown size={20} />
            </div>
          </div>
        </section>

        {/* Meta Information Section */}
        <section className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-600/40 ml-1">Title (Optional)</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 p-5 rounded-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 transition-all shadow-sm outline-none" 
              placeholder="E.g. The Future of Typography" 
              type="text"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-600/40 ml-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 p-5 rounded-2xl font-medium text-slate-900 dark:text-white placeholder:text-slate-300 resize-none h-36 transition-all shadow-sm outline-none" 
              placeholder="Add a personal note or summary..."
            />
          </div>
        </section>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Save Action */}
        <section className="pt-6">
          <button 
            onClick={handleSave}
            disabled={loading || !url}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl text-sm font-black tracking-widest uppercase shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : (initialBookmark ? 'Update Bookmark' : 'Save to Archive')}
          </button>
        </section>
      </main>
    </div>
  );
};
