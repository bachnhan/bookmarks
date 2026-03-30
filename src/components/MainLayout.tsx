import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent, 
  DragStartEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { bookmarkService } from '../services/bookmarkService';
import { Bookmark } from '../types';

interface MainLayoutProps {
  children: ReactNode;
  onSelectFolder: (folderId: string | null) => void;
  onSelectArchived: () => void;
  activeFolderId: string | null;
  isArchivedActive: boolean;
  onRefresh?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  onSelectFolder, 
  onSelectArchived,
  activeFolderId,
  isArchivedActive,
  onRefresh
}) => {
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'bookmark') {
      setActiveBookmark(active.data.current.bookmark);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBookmark(null);

    if (!over) return;

    // Handle Bookmark -> Folder Drop
    if (active.data.current?.type === 'bookmark' && over.data.current?.type === 'folder') {
      const bookmarkId = active.id as string;
      const folderId = over.id as string; // 'null' for unsorted
      
      try {
        await bookmarkService.updateBookmark(bookmarkId, { 
          folder_id: folderId === 'null' ? null : folderId 
        });
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error('Failed to move bookmark via DND:', err);
      }
    }
    
    // NOTE: Folder reordering will be handled here as well in the next step
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <Sidebar 
          onSelectFolder={onSelectFolder}
          onSelectArchived={onSelectArchived}
          activeFolderId={activeFolderId}
          isArchivedActive={isArchivedActive}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {children}
        </main>
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeBookmark ? (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-2xl border border-blue-500/30 w-64 opacity-80 cursor-grabbing scale-105 transition-transform">
            <h3 className="font-bold text-sm truncate text-slate-900 dark:text-white">{activeBookmark.title}</h3>
            <p className="text-[10px] text-slate-400 truncate">{activeBookmark.url}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
