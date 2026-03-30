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
import { Bookmark, Folder } from '../types';

const isDescendant = (folders: Folder[], parentId: string | null, targetId: string): boolean => {
  const children = folders.filter(f => f.parent_id === parentId);
  for (const child of children) {
    if (child.id === targetId) return true;
    if (isDescendant(folders, child.id, targetId)) return true;
  }
  return false;
};

interface MainLayoutProps {
  children: ReactNode;
  onSelectFolder: (folderId: string | null) => void;
  onSelectArchived: () => void;
  activeFolderId: string | null;
  isArchivedActive: boolean;
  folders: Folder[];
  onFoldersChange: (newFolders: Folder[]) => void;
  onRefreshFolders?: () => void;
  onRefreshBookmarks?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  onSelectFolder, 
  onSelectArchived,
  activeFolderId,
  isArchivedActive,
  folders,
  onFoldersChange,
  onRefreshFolders,
  onRefreshBookmarks
}) => {
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null);
  const [processingFolderIds, setProcessingFolderIds] = useState<string[]>([]);

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

    // 1. Handle Bookmark -> Folder Drop
    if (active.data.current?.type === 'bookmark' && over.data.current?.type === 'folder') {
      const bookmarkId = active.id as string;
      const folderId = over.id as string; // 'null' for unsorted
      
      try {
        await bookmarkService.updateBookmark(bookmarkId, { 
          folder_id: folderId === 'null' ? null : folderId 
        });
        if (onRefreshBookmarks) onRefreshBookmarks();
      } catch (err) {
        console.error('Failed to move bookmark via DND:', err);
      }
    }
    
    // 2. Handle Folder -> Folder drop (Reordering or Nesting)
    if (active.data.current?.type === 'folder') {
      const activeId = active.id as string;
      const overId = over.id as string;
      
      if (activeId === overId) return;

      const activeFolder = folders.find(f => f.id === activeId);
      if (!activeFolder) return;

      const isDroppingOnDifferentFolder = over.data.current?.type === 'folder';
      
      if (isDroppingOnDifferentFolder) {
        try {
          if (overId !== null && overId !== 'root' && overId !== 'root-bottom' && isDescendant(folders, activeId, overId)) {
            console.warn('Cannot nest a folder inside one of its own sub-folders');
            return;
          }

          setProcessingFolderIds([activeId]);
          const newParentId = (overId === 'null' || overId === 'root' || overId === 'root-bottom' || overId === 'root-sidebar') ? null : (overId as string);
          
          await bookmarkService.updateFolder(activeId, { 
            parent_id: newParentId 
          });
          if (onRefreshFolders) await onRefreshFolders();
        } catch (err) {
          console.error('Failed to nest folder via DND:', err);
        } finally {
          setProcessingFolderIds([]);
        }
      }
    }
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
          folders={folders}
          onFoldersChange={onFoldersChange}
          onRefreshFolders={onRefreshFolders}
          processingFolderIds={processingFolderIds}
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

