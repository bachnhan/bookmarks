import { Bookmark, Folder } from '../types';
import { authClient } from '../lib/auth';

class BookmarkService {
  private async getAuthToken(): Promise<string | undefined> {
    const { data } = await authClient.getSession();
    return data?.session?.token;
  }


  async getFolders(): Promise<Folder[]> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/getFolders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch folders');
    return response.json();
  }

  async getBookmarks(folderId?: string, isArchived?: boolean): Promise<Bookmark[]> {
    const token = await this.getAuthToken();
    let url = '/api/getBookmarks';
    const params = new URLSearchParams();
    if (folderId) params.append('folderId', folderId);
    if (isArchived) params.append('isArchived', 'true');
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch bookmarks');
    return response.json();
  }

  async addBookmark(bookmark: Omit<Bookmark, 'id' | 'addedAt'>): Promise<Bookmark> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/addBookmark', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookmark),
    });
    if (!response.ok) throw new Error('Failed to add bookmark');
    return response.json();
  }

  async deleteBookmark(id: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/deleteBookmark', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('Failed to delete bookmark');
  }

  async toggleStar(bookmarkId: string, isStarred: boolean): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/updateBookmark', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: bookmarkId, updates: { isStarred } }),
    });
    if (!response.ok) throw new Error('Failed to toggle star');
  }

  async updateBookmark(id: string, updates: Partial<Omit<Bookmark, 'id' | 'addedAt'>>): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/updateBookmark', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, updates }),
    });
    if (!response.ok) throw new Error('Failed to update bookmark');
  }

  async addFolder(name: string, parent_id?: string): Promise<Folder> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/addFolder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, parent_id }),
    });
    if (!response.ok) throw new Error('Failed to add folder');
    return response.json();
  }

  async deleteFolder(id: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/deleteFolder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('Failed to delete folder');
  }

  async updateFolder(id: string, updates: Partial<Folder>): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/updateFolder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, updates }),
    });
    if (!response.ok) throw new Error('Failed to update folder');
  }

  async updateFolderOrder(folderOrders: { id: string; sortOrder: number }[]): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch('/api/updateFolderOrder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ folderOrders }),
    });
    if (!response.ok) throw new Error('Failed to update folder order');
  }
}

export const bookmarkService = new BookmarkService();
