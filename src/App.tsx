/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { FoldersScreen } from './screens/FoldersScreen';
import { SearchScreen } from './screens/SearchScreen';
import { AddBookmarkScreen } from './screens/AddBookmarkScreen';
import { AuthScreen } from './screens/AuthScreen';
import { BottomNav } from './components/BottomNav';
import { Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950" />;
  }

  if (!session) {
    return <AuthScreen />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onAddClick={() => setActiveScreen('add')} />;
      case 'folders':
        return <FoldersScreen />;
      case 'search':
        return <SearchScreen />;
      case 'add':
        return <AddBookmarkScreen onClose={() => setActiveScreen('home')} />;
      case 'profile':
        return (
          <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 flex flex-col items-center justify-center p-6 pb-24">
            <div className="w-full max-w-sm">
              <div className="text-center mb-10">
                <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-semibold text-slate-500 dark:text-slate-400">
                    {session.user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#091426] dark:text-white mb-2">Profile</h2>
                <p className="text-slate-500 dark:text-slate-400 break-all">{session.user.email}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-2 overflow-hidden">
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-red-600 dark:text-red-400 transition-colors"
                >
                  <span className="font-medium text-[15px]">Sign Out</span>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <HomeScreen onAddClick={() => setActiveScreen('add')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 font-sans selection:bg-[#091426]/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      
      {activeScreen !== 'add' && (
        <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      )}
    </div>
  );
}
