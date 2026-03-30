import React, { useState } from 'react';
import { 
  FileText, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Star, 
  Archive, 
  FolderInput, 
  X,
  GripVertical
} from 'lucide-react';
import { Bookmark, Folder } from '../types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface BookmarkCardProps {
  bookmark: Bookmark;
  folders: Folder[];
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onToggleStar?: (e: React.MouseEvent) => void;
  onArchive?: (e: React.MouseEvent) => void;
  onMove?: (folderId: string | null) => void;
}

const CardActions: React.FC<{
  bookmark: Bookmark;
  folders: Folder[];
  showMoveMenu: boolean;
  setShowMoveMenu: (show: boolean) => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onToggleStar?: (e: React.MouseEvent) => void;
  onArchive?: (e: React.MouseEvent) => void;
  onMove?: (folderId: string | null) => void;
}> = ({ bookmark, folders, showMoveMenu, setShowMoveMenu, onEdit, onDelete, onToggleStar, onArchive, onMove }) => {
  const isStarred = bookmark.isStarred;
  const isArchived = bookmark.isArchived;

  return (
    <div className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity relative">
      {onToggleStar && (
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleStar(e); }}
          className={`p-2 rounded-full transition-all duration-200 ${isStarred ? 'text-amber-500 bg-amber-50 shadow-sm' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
          title="Toggle Star"
        >
          <Star size={14} className={isStarred ? 'fill-amber-500 border-none' : ''} />
        </button>
      )}
      
      {onArchive && (
        <button 
          onClick={(e) => { e.stopPropagation(); onArchive(e); }}
          className={`p-2 rounded-full transition-all duration-200 ${isArchived ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          title={isArchived ? "Unarchive" : "Archive"}
        >
          <Archive size={14} />
        </button>
      )}

      {onMove && (
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMoveMenu(!showMoveMenu); }}
            className={`p-2 rounded-full transition-all duration-200 ${showMoveMenu ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
            title="Move to folder"
          >
            <FolderInput size={14} />
          </button>
          
          {showMoveMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 py-2 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 pb-2 mb-1 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400">Move to</span>
                <button onClick={(e) => { e.stopPropagation(); setShowMoveMenu(false); }} className="text-slate-300 hover:text-slate-500">
                  <X size={12} />
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                <button
                  onClick={(e) => { e.stopPropagation(); onMove(null); setShowMoveMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Unsorted
                </button>
                {folders.map(f => (
                  <button
                    key={f.id}
                    onClick={(e) => { e.stopPropagation(); onMove(f.id); setShowMoveMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${bookmark.folder_id === f.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 text-slate-600 hover:text-blue-600'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {onEdit && (
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(e); }}
          className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-blue-600 transition-all duration-200"
        >
          <Edit size={14} />
        </button>
      )}
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(e); }}
          className="p-2 hover:bg-red-50 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-all duration-200"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ 
  bookmark, 
  folders,
  onClick, 
  onEdit, 
  onDelete, 
  onToggleStar,
  onArchive,
  onMove
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: bookmark.id,
    data: {
      type: 'bookmark',
      bookmark
    }
  });

  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const commonHeader = (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div 
          {...attributes} 
          {...listeners}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-grab active:cursor-grabbing text-slate-300 hover:text-blue-500 transition-colors"
        >
          <GripVertical size={14} />
        </div>
        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          {bookmark.faviconUrl ? (
            <img src={bookmark.faviconUrl} alt={bookmark.source} className="w-3 h-3" />
          ) : (
            <FileText size={12} className="text-slate-400" />
          )}
        </div>
        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 group-hover:text-blue-600 transition-colors">
          {bookmark.source}
        </span>
      </div>
      <CardActions 
        bookmark={bookmark} 
        folders={folders}
        showMoveMenu={showMoveMenu}
        setShowMoveMenu={setShowMoveMenu}
        onEdit={onEdit} 
        onDelete={onDelete} 
        onToggleStar={onToggleStar} 
        onArchive={onArchive}
        onMove={(folderId) => {
          if (onMove) onMove(folderId);
          setShowMoveMenu(false);
        }}
      />
    </div>
  );

  return (
    <article 
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      onDoubleClick={() => window.open(bookmark.url, '_blank')}
      className={`bg-white dark:bg-slate-900 rounded-2xl group active:scale-[0.98] transition-all duration-300 cursor-pointer border border-slate-200/60 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-500/20 flex flex-col h-full relative ${showMoveMenu ? 'z-40 shadow-2xl' : 'z-0'} ${isDragging ? 'z-50 shadow-2xl scale-105 opacity-50 ring-2 ring-blue-500/50' : ''}`}
    >
      {/* Container for image - must have overflow hidden for rounded top */}
      <div className="overflow-hidden rounded-t-2xl">
        {bookmark.imageUrl && (
          <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
            <img src={bookmark.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            {bookmark.isStarred && (
              <div className="absolute top-3 left-3 bg-amber-400 text-white p-1 rounded-md shadow-lg">
                <Star size={12} className="fill-white" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 relative">
        {/* Header must NOT have overflow hidden to allow dropdown to pop out */}
        {commonHeader}
        
        {/* Rest of content can be clipped if needed, but relative for layout */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight leading-tight line-clamp-2">
            {bookmark.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {bookmark.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">
              {new Date(bookmark.addedAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-1 text-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black uppercase tracking-wider">Expand</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
