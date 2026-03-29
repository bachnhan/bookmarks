import React, { useState } from 'react';
import { Folder, X, Loader2 } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { supabase } from '../lib/supabase';

interface AddBookmarkScreenProps {
  onClose: () => void;
}

export const AddBookmarkScreen: React.FC<AddBookmarkScreenProps> = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to add bookmarks');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('bookmarks').insert({
        url,
        title: title || url,
        description,
        user_id: user.id, // Associated with the authenticated user
        type: 'link', // Default type
        addedat: new Date().toISOString()
      });

      if (insertError) throw insertError;
      
      onClose();
    } catch (err: any) {
      console.error('Error saving bookmark:', err);
      setError(err.message || 'Failed to save bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 pb-24">
      <TopBar 
        title="Add Bookmark" 
        variant="modal" 
        onClose={onClose} 
        onConfirm={handleSave}
      />
      
      <main className="px-6 py-8 max-w-md mx-auto space-y-10">
        {/* URL Input Section */}
        <section className="space-y-3">
          <label className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Destination</label>
          <div className="bg-slate-100 dark:bg-slate-900 rounded-sm group focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors border border-transparent focus-within:border-[#091426]/20">
            <textarea 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border-none focus:ring-0 p-4 rounded-sm font-body text-[#091426] dark:text-white placeholder:text-slate-300 focus:bg-white dark:focus:bg-slate-800 transition-colors" 
              placeholder="E.g. The Future of Typography" 
              type="text"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border-none focus:ring-0 p-4 rounded-sm font-body text-[#091426] dark:text-white placeholder:text-slate-300 resize-none h-32 focus:bg-white dark:focus:bg-slate-800 transition-colors" 
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
        <section className="pt-4">
          <button 
            onClick={handleSave}
            disabled={loading || !url}
            className="w-full bg-gradient-to-br from-[#091426] to-[#1e293b] text-white py-5 rounded-md text-sm font-bold tracking-widest uppercase shadow-2xl shadow-[#091426]/10 active:scale-95 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Save to Archive'}
          </button>
        </section>
      </main>
    </div>
  );
};
