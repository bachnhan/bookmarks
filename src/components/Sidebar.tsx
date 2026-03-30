import React, { useState, useEffect } from 'react';
import { 
  Folder as FolderIcon, 
  ChevronDown, 
  ChevronRight, 
  Layers,
  Archive,
  Menu,
  X,
  Inbox,
  Trash2,
  FolderPlus
} from 'lucide-react';
import { Folder } from '../types';
import { bookmarkService } from '../services/bookmarkService';
import { 
  useSortable, 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove 
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
  onSelectFolder: (folderId: string | null) => void;
  onSelectArchived: () => void;
  activeFolderId: string | null;
  isArchivedActive: boolean;
  folders: Folder[];
  onFoldersChange: (newFolders: Folder[]) => void;
}

interface SortableFolderItemProps {
  folder: Folder;
  isActive: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  level: number;
  onSelect: (id: string) => void;
  onToggle: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const SortableFolderItem: React.FC<SortableFolderItemProps> = ({
  folder, isActive, isExpanded, hasChildren, level, onSelect, onToggle, onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: folder.id,
    data: {
      type: 'folder',
      folder
    }
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: folder.id,
    data: {
      type: 'folder',
      folder
    }
  });

  // Combine refs
  const setCombinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDropRef(node);
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    paddingLeft: `${(level * 12) + 12}px`,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setCombinedRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(folder.id)}
      className={`
        group flex items-center justify-between px-3 py-2 rounded-xl cursor-grab transition-all duration-200 relative
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none font-bold' 
          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium'}
        ${isOver && !isActive ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/50' : ''}
      `}
    >
      <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
        <div className="flex items-center justify-center w-4 h-4 pointer-events-auto">
          {hasChildren && (
            <button 
              onClick={(e) => onToggle(e, folder.id)}
              className={`p-0.5 rounded transition-colors ${isActive ? 'hover:bg-blue-500 text-blue-100' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400'}`}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
        <FolderIcon size={18} className={isActive ? 'text-white' : 'text-blue-500/60'} />
        <span className="text-[14px] truncate">{folder.name}</span>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => onDelete(e, folder.id)}
          className={`p-1 rounded-md transition-colors pointer-events-auto ${isActive ? 'hover:bg-blue-500 text-blue-100' : 'hover:bg-red-50 text-red-400'}`}
        >
          <Trash2 size={14} />
        </button>
        <span className={`text-[11px] px-1.5 py-0.5 rounded ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
          {folder.itemCount}
        </span>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  onSelectFolder, 
  onSelectArchived,
  activeFolderId,
  isArchivedActive,
  folders,
  onFoldersChange
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(true);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const { setNodeRef: setUnsortedDropRef, isOver: isOverUnsorted } = useDroppable({
    id: 'null',
    data: { type: 'folder', folder: { id: null, name: 'Unsorted' } }
  });

  const toggleFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    const newSet = new Set(expandedFolders);
    if (newSet.has(folderId)) {
      newSet.delete(folderId);
    } else {
      newSet.add(folderId);
    }
    setExpandedFolders(newSet);
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await bookmarkService.addFolder(newFolderName);
      setNewFolderName('');
      setIsAddingFolder(false);
      // Parent will refresh folders via subscription or refetch
    } catch (err) {
      console.error('Failed to add folder:', err);
    }
  };

  const handleDeleteFolder = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this folder? Bookmarks will be moved to Unsorted.')) return;
    try {
      await bookmarkService.deleteFolder(id);
      if (activeFolderId === id) onSelectFolder(null);
    } catch (err) {
      console.error('Failed to delete folder:', err);
    }
  };

  const renderFolderItems = (parentId: string | null = null, level: number = 0) => {
    const items = folders.filter(f => f.parent_id === parentId);
    
    return (
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-0.5">
          {items.map(folder => {
            const hasChildren = folders.some(f => f.parent_id === folder.id);
            const isExpanded = expandedFolders.has(folder.id);
            const isActive = activeFolderId === folder.id;

            return (
              <React.Fragment key={folder.id}>
                <SortableFolderItem 
                  folder={folder}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  hasChildren={hasChildren}
                  level={level}
                  onSelect={onSelectFolder}
                  onToggle={toggleFolder}
                  onDelete={handleDeleteFolder}
                />
                {hasChildren && isExpanded && renderFolderItems(folder.id, level + 1)}
              </React.Fragment>
            );
          })}
        </div>
      </SortableContext>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <Layers size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">ARCHIVIST</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          <div className="pb-2 px-3">
            <h3 className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.2em]">System</h3>
          </div>

          <div 
            ref={setUnsortedDropRef}
            onClick={() => onSelectFolder('__unsorted__')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 relative ${activeFolderId === '__unsorted__' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'} ${isOverUnsorted ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/50' : ''}`}
          >
            <Inbox size={18} className={activeFolderId === '__unsorted__' ? 'text-white' : 'text-blue-500/60'} />
            <span className="text-[14px]">Unsorted</span>
          </div>

          <div 
            onClick={onSelectArchived}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isArchivedActive ? 'bg-slate-900 text-white shadow-lg font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'}`}
          >
            <Archive size={18} className={isArchivedActive ? 'text-white' : 'text-slate-400'} />
            <span className="text-[14px]">Archived</span>
          </div>

          <div className="pt-8 pb-3 px-3 flex items-center justify-between group/header">
            <h3 className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.2em]">Folders</h3>
            <button 
              onClick={() => setIsAddingFolder(true)}
              className="p-1 hover:bg-blue-50 text-blue-600 rounded-md transition-colors opacity-0 group-hover/header:opacity-100"
            >
              <FolderPlus size={16} />
            </button>
          </div>

          {isAddingFolder && (
            <div className="px-3 mb-2">
              <input
                autoFocus
                className="w-full bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl px-3 py-2 text-sm font-bold outline-none"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFolder();
                  if (e.key === 'Escape') setIsAddingFolder(false);
                }}
                onBlur={() => {
                  if (!newFolderName) setIsAddingFolder(false);
                }}
              />
            </div>
          )}
          
          <div className="space-y-0.5">
            {renderFolderItems()}
          </div>
        </div>
      </aside>
    </>
  );
};
