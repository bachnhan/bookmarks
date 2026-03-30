import { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { AddBookmarkScreen } from './screens/AddBookmarkScreen';
import { AuthScreen } from './screens/AuthScreen';
import { MainLayout } from './components/MainLayout';
import { Bookmark } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { LogOut, User } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'add' | 'profile'>('home');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isArchivedView, setIsArchivedView] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeScreen 
            folderId={selectedFolderId}
            isArchived={isArchivedView}
            onAddClick={() => setCurrentView('add')}
            onEditClick={(bm) => {
              setEditingBookmark(bm);
              setCurrentView('add');
            }}
          />
        );
      case 'add':
        return (
          <AddBookmarkScreen 
            initialBookmark={editingBookmark}
            onClose={() => {
              setEditingBookmark(null);
              setCurrentView('home');
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
              onClick={() => supabase.auth.signOut()}
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
