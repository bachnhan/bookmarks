import { useState, useEffect, useCallback } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { AddBookmarkScreen } from './screens/AddBookmarkScreen';
import { AuthScreen } from './screens/AuthScreen';
import { MainLayout } from './components/MainLayout';
import { Bookmark, Folder } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, User } from 'lucide-react';
import { bookmarkService } from './services/bookmarkService';
import { useSession, signOut } from './lib/auth';

export default function App() {
  const { data: sessionData, isPending: loading } = useSession();
  const session = sessionData;
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  
  // App State: Folders
  const [folders, setFolders] = useState<Folder[]>([]);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'add' | 'profile'>('home');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isArchivedView, setIsArchivedView] = useState(false);
  const [refreshBookmarksTrigger, setRefreshBookmarksTrigger] = useState(0);

  const fetchFolders = useCallback(async () => {
    try {
      const data = await bookmarkService.getFolders();
      setFolders(data);
    } catch (err) {
      console.error('Failed to fetch folders in App:', err);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchFolders();
    }
  }, [session, fetchFolders]);


  if (loading) {
    return <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
    </div>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  const handleSelectFolder = (id: string | null) => {
    setSelectedFolderId(id);
    setIsArchivedView(false);
    setCurrentView('home');
  };

  const handleSelectArchived = () => {
    setIsArchivedView(true);
    setSelectedFolderId(null);
    setCurrentView('home');
  };

  const handleRefreshBookmarks = () => setRefreshBookmarksTrigger(prev => prev + 1);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeScreen 
            folders={folders}
            folderId={selectedFolderId}
            isArchived={isArchivedView}
            onAddClick={() => setCurrentView('add')}
            onEditClick={(bm) => {
              setEditingBookmark(bm);
              setCurrentView('add');
            }}
            onRefreshFolders={fetchFolders}
            refreshTrigger={refreshBookmarksTrigger}
          />
        );
      case 'add':
        return (
          <AddBookmarkScreen 
            folders={folders}
            initialBookmark={editingBookmark}
            onClose={() => {
              setEditingBookmark(null);
              setCurrentView('home');
              fetchFolders(); // Refresh in case bookmark moved changed item counts
            }} 
          />
        );
      case 'profile':
        return (
          <div className="p-12 max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <User size={40} className="text-slate-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{session.user.email?.split('@')[0]}</h2>
            <p className="text-slate-500 mb-10">{session.user.email}</p>
            
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto py-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>

        );
    }
  };

  return (
    <MainLayout
      onSelectFolder={handleSelectFolder}
      onSelectArchived={handleSelectArchived}
      activeFolderId={selectedFolderId}
      isArchivedActive={isArchivedView}
      folders={folders}
      onFoldersChange={setFolders}
      onRefreshFolders={fetchFolders}
      onRefreshBookmarks={handleRefreshBookmarks}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentView}-${selectedFolderId}-${isArchivedView}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  );
}

