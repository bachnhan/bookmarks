import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

/**
 * Netlify Function handler to add a new bookmark.
 */
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

    const sql = neon(process.env.DATABASE_URL!);
    const body = JSON.parse(event.body || '{}');

    // Input Validation
    if (!body.url) {
      return errorResponse(400, 'URL is required');
    }

    try {
      new URL(body.url);
    } catch (e) {
      return errorResponse(400, 'Invalid URL format');
    }

    const userId = user.id;

    // Insert bookmark with the authenticated user's ID
    const result = await sql`
      INSERT INTO bookmarks (url, title, description, user_id, type, folder_id)
      VALUES (
        ${body.url}, 
        ${body.title || 'Untitled'}, 
        ${body.description || ''}, 
        ${userId}, 
        ${body.type || 'medium'},
        ${body.folder_id || null}
      )
      RETURNING *;
    `;

    return jsonResponse(201, result[0]);
  } catch (error) {
    console.error('[Server Error] Exception in addBookmark:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};

