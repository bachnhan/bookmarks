import React, { useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { FolderCard } from '../components/FolderCard';
import { supabase } from '../lib/supabase';
import { Folder } from '../types';
import { Loader2 } from 'lucide-react';

export const FoldersScreen: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('folders')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      const mappedFolders: Folder[] = (data || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        description: f.description,
        itemCount: f.itemcount || 0,
        iconName: f.iconname,
        bgImageUrl: f.bgimageurl
      }));

      setFolders(mappedFolders);
    } catch (err: any) {
      console.error('Error fetching folders:', err);
      setError(err.message || 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 pb-24">
      <TopBar title="The Archivist" />
      
      <main className="px-6 py-8 max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#091426] dark:text-white tracking-tight mb-2">Folders</h2>
          <p className="text-slate-500 dark:text-slate-400">Organize your thoughts into curated spaces.</p>
        </div>

        {/* Collections Bento-ish Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" />
            <p className="text-sm">Mapping your spaces...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center">
            <p className="font-medium mb-4">{error}</p>
            <button 
              onClick={fetchFolders}
              className="bg-white px-6 py-2 rounded-full shadow-sm text-sm"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            <FolderCard isNew />
            {folders.map(folder => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
