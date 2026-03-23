import React from 'react';
import { Bookmark, Folder, Search, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const items = [
    { id: 'home', label: 'Home', icon: Bookmark },
    { id: 'folders', label: 'Folders', icon: Folder },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-[0_-4px_32px_rgba(9,20,38,0.04)]">
      <div className="flex justify-around items-center h-20 px-4 w-full">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-150 active:scale-90",
              activeScreen === id 
                ? "text-[#091426] dark:text-white scale-110" 
                : "text-[#45474c] dark:text-slate-500 hover:text-[#091426] dark:hover:text-white"
            )}
          >
            <Icon 
              size={24} 
              className={cn("mb-1", activeScreen === id && "fill-current")} 
            />
            <span className="font-['Inter'] text-[10px] font-medium tracking-widest uppercase">
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
