import { supabase } from '../lib/supabase';

/**
 * Service to handle bookmark operations via Netlify Functions.
 * This ensures that sensitive database logic (Neon) is handled on the server
 * while maintaining security via Supabase JWT verification.
 */
export const bookmarkService = {
  /**
   * Fetch bookmarks for the currently authenticated user.
   * Sends the Supabase access token in the Authorization header.
   */
  async getBookmarks() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    const response = await fetch('/api/getBookmarks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch bookmarks');
    }

    return response.json();
  },

  /**
   * Add a new bookmark for the currently authenticated user.
   * Sends the Supabase access token for server-side registration of the user ID.
   */
  async addBookmark(bookmark: { url: string; title?: string; description?: string; type?: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    const response = await fetch('/api/addBookmark', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookmark),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add bookmark');
    }

    return response.json();
  }
};
