import { Bookmark, Folder } from './types';

export const MOCK_FOLDERS: Folder[] = [
  {
    "id": "folder-daily",
    "name": "[Daily]",
    "description": "Daily essentials and routines",
    "itemCount": 3,
    "iconName": "sun"
  },
  {
    "id": "folder-projects",
    "name": "Projects",
    "description": "Active project resources",
    "itemCount": 8,
    "iconName": "briefcase"
  },
  {
    "id": "folder-arch-res",
    "name": "Architecture",
    "description": "Architectural inspiration and research",
    "itemCount": 5,
    "iconName": "home",
    "parent_id": "folder-projects"
  },
  {
    "id": "folder-cinematography",
    "name": "Cinematography",
    "description": "Cinematographic effects and editing",
    "itemCount": 3,
    "iconName": "video",
    "parent_id": "folder-arch-res"
  },
  {
    "id": "folder-web-design",
    "name": "Web Design",
    "description": "UI/UX and Web Design inspiration",
    "itemCount": 4,
    "iconName": "layout",
    "parent_id": "folder-projects"
  },
  {
    "id": "folder-tools",
    "name": "[Tools]",
    "description": "Development and productivity utilities",
    "itemCount": 5,
    "iconName": "tool"
  },
  {
    "id": "folder-docs",
    "name": "[Docs]",
    "description": "Technical documentation and APIs",
    "itemCount": 4,
    "iconName": "book-open"
  },
  {
    "id": "folder-personal",
    "name": "[Personal]",
    "description": "Non-work-related bookmarks",
    "itemCount": 4,
    "iconName": "user"
  }
];

export const MOCK_BOOKMARKS: Bookmark[] = [
  {
    "id": "bm-landscape",
    "title": "Landscape photography",
    "description": "Cinematography techniques for landscape",
    "url": "https://example.com/landscape",
    "source": "Cinematography",
    "tags": ["PHOTOS", "INSPIRATION"],
    "addedAt": new Date().toISOString(),
    "type": "detailed",
    "folder_id": "folder-cinematography",
    "isStarred": true
  },
  {
    "id": "bm-cinematic",
    "title": "Cinematic effects",
    "description": "Modern cinematography editing tips",
    "url": "https://example.com/cinematic",
    "source": "Editing",
    "tags": ["EDITING", "DESIGN"],
    "addedAt": new Date().toISOString(),
    "type": "detailed",
    "folder_id": "folder-cinematography",
    "isStarred": true
  },
  {
    "id": "bm-smart-ui",
    "title": "Smart UI components",
    "description": "Next generation web components",
    "url": "https://example.com/smart-ui",
    "source": "Web Design",
    "tags": ["UI DESIGN", "DESIGN"],
    "addedAt": new Date().toISOString(),
    "type": "detailed",
    "folder_id": "folder-web-design",
    "isStarred": true
  },
  {
    "id": "bm-interior",
    "title": "Interior architecture",
    "description": "Minimalist interior design research",
    "url": "https://example.com/interior",
    "source": "Architecture",
    "tags": ["INSPIRATION"],
    "addedAt": new Date().toISOString(),
    "type": "detailed",
    "folder_id": "folder-arch-res",
    "isStarred": false
  },
  {
    "id": "bm-off-grid",
    "title": "Off Grid living",
    "description": "Sustainable architecture research",
    "url": "https://example.com/off-grid",
    "source": "Architecture",
    "tags": ["INSPIRATION"],
    "addedAt": new Date().toISOString(),
    "type": "detailed",
    "folder_id": "folder-arch-res",
    "isStarred": false
  }
];
