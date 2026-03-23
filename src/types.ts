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
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  iconName: string;
  bgImageUrl?: string;
}

export type Screen = 'home' | 'folders' | 'search' | 'profile' | 'add';
