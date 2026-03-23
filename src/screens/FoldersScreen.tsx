import React from 'react';
import { TopBar } from '../components/TopBar';
import { FolderCard } from '../components/FolderCard';
import { MOCK_FOLDERS } from '../data';

export const FoldersScreen: React.FC = () => {
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
        <div className="grid grid-cols-2 gap-5">
          <FolderCard isNew />
          {MOCK_FOLDERS.map(folder => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      </main>
    </div>
  );
};
