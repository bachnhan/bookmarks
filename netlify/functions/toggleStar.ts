import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS };
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Method Not Allowed');
  }

  try {
    const { user, error: authError } = await getAuthenticatedUser(event);
    if (authError || !user) {
      return errorResponse(401, authError || 'Unauthorized');
    }

    const { bookmarkId, isStarred } = JSON.parse(event.body || '{}');

    if (!bookmarkId) {
      return errorResponse(400, 'Missing bookmarkId');
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Update the is_starred status for the bookmark, ensuring it belongs to the user
    const result = await sql`
      UPDATE bookmarks 
      SET is_starred = ${isStarred}
      WHERE id = ${bookmarkId} AND user_id = ${user.id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return errorResponse(404, 'Bookmark not found or unauthorized');
    }

    return jsonResponse(200, { message: 'Bookmark updated successfully', isStarred });
  } catch (error) {
    console.error('[Server Error] toggleStar:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};

