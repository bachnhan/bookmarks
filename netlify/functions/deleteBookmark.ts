import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

/**
 * Netlify Function handler to delete a bookmark.
 */
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS };
  }

  // We use POST since some clients/proxies can have issues with DELETE bodies
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Method Not Allowed');
  }

  try {
    const { user, error: authError } = await getAuthenticatedUser(event);
    if (authError || !user) {
      return errorResponse(401, authError || 'Unauthorized');
    }

    const body = JSON.parse(event.body || '{}');
    const id = body.id;

    if (!id) {
      return errorResponse(400, 'Missing bookmark ID');
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Strict ownership check
    const result = await sql`
      DELETE FROM bookmarks 
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return errorResponse(404, 'Bookmark not found or unauthorized');
    }

    return jsonResponse(200, { success: true });
  } catch (error) {
    console.error('[Server Error] deleteBookmark:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};

