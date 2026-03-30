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
    
    // Fetch all folders for the user (including parent_id for hierarchy)
    const folders = await sql`
      SELECT 
        id, 
        name, 
        description, 
        itemcount as "itemCount", 
        iconname as "iconName", 
        bgimageurl as "bgImageUrl", 
        parent_id,
        sort_order as "sortOrder"
      FROM folders 
      WHERE user_id = ${user.id}
      ORDER BY sort_order ASC, name ASC
    `;

    return jsonResponse(200, folders);
  } catch (error) {
    console.error('[Server Error] getFolders:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};

