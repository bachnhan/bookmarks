import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

/**
 * Netlify Function handler to retrieve bookmarks.
 */
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS };
  }

  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Method Not Allowed');
  }

  try {
    const { user, error: authError } = await getAuthenticatedUser(event);
    if (authError || !user) {
      return errorResponse(401, authError || 'Unauthorized');
    }

    const folderId = event.queryStringParameters?.folderId;
    const isArchived = event.queryStringParameters?.isArchived === 'true';
    
    const sql = neon(process.env.DATABASE_URL!);
    
    let bookmarks;
    // Strict user_id check to ensure privacy
    if (isArchived) {
      bookmarks = await sql`
        SELECT 
          id, title, description, url, source, faviconurl as "faviconUrl", 
          imageurl as "imageUrl", tags, addedat as "addedAt", type, 
          folder_id, is_starred as "isStarred", is_archived as "isArchived"
        FROM bookmarks 
        WHERE user_id = ${user.id}
          AND is_archived = TRUE
        ORDER BY is_starred DESC, addedat DESC
      `;
    } else if (folderId === '__unsorted__') {
      bookmarks = await sql`
        SELECT 
          id, title, description, url, source, faviconurl as "faviconUrl", 
          imageurl as "imageUrl", tags, addedat as "addedAt", type, 
          folder_id, is_starred as "isStarred", is_archived as "isArchived"
        FROM bookmarks 
        WHERE user_id = ${user.id}
          AND folder_id IS NULL
          AND is_archived = FALSE
        ORDER BY is_starred DESC, addedat DESC
      `;
    } else if (folderId) {
      bookmarks = await sql`
        SELECT 
          id, title, description, url, source, faviconurl as "faviconUrl", 
          imageurl as "imageUrl", tags, addedat as "addedAt", type, 
          folder_id, is_starred as "isStarred", is_archived as "isArchived"
        FROM bookmarks 
        WHERE user_id = ${user.id}
          AND folder_id = ${folderId}
          AND is_archived = FALSE
        ORDER BY is_starred DESC, addedat DESC
      `;
    } else {
      // Default view: All non-archived, stars first
      bookmarks = await sql`
        SELECT 
          id, title, description, url, source, faviconurl as "faviconUrl", 
          imageurl as "imageUrl", tags, addedat as "addedAt", type, 
          folder_id, is_starred as "isStarred", is_archived as "isArchived"
        FROM bookmarks 
        WHERE user_id = ${user.id}
          AND is_archived = FALSE
        ORDER BY is_starred DESC, addedat DESC
      `;
    }

    return jsonResponse(200, bookmarks);
  } catch (error) {
    console.error('[Server Error] getBookmarks:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};

