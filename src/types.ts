export interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  faviconUrl?: string;
  imageUrl?: string;
  tags: string[];
  addedAt: string;
  type: 'feature' | 'medium' | 'dense' | 'detailed';
  folder_id?: string;
  isStarred?: boolean;
  isArchived?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  iconName: string;
  bgImageUrl?: string;
  parent_id?: string;
  sortOrder?: number;
}

export type Screen = 'home' | 'folders' | 'search' | 'profile' | 'add';
