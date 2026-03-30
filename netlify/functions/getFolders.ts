import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

/**
 * Netlify Function handler to retrieve folders.
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

    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch all folders for the user with dynamic itemCount calculation
    const folders = await sql`
      SELECT 
        f.id, 
        f.name, 
        f.description, 
        (SELECT COUNT(*) FROM bookmarks b WHERE b.folder_id = f.id) as "itemCount", 
        f.iconname as "iconName", 
        f.bgimageurl as "bgImageUrl", 
        f.parent_id,
        f.sort_order as "sortOrder"
      FROM folders f
      WHERE f.user_id = ${user.id}
      ORDER BY f.sort_order ASC, f.name ASC
    `;

    return jsonResponse(200, folders);
  } catch (error) {
    console.error('[Server Error] getFolders:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};

