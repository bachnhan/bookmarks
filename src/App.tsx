/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { FoldersScreen } from './screens/FoldersScreen';
import { SearchScreen } from './screens/SearchScreen';
import { AddBookmarkScreen } from './screens/AddBookmarkScreen';
import { BottomNav } from './components/BottomNav';
import { Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

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
          <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#091426] dark:text-white mb-2">Profile</h2>
              <p className="text-slate-500 dark:text-slate-400">User profile settings and preferences.</p>
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

