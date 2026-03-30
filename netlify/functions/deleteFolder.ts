import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS };
  if (event.httpMethod !== 'POST') return errorResponse(405, 'Method Not Allowed');

  try {
    const { user, error: authError } = await getAuthenticatedUser(event);
    if (authError || !user) return errorResponse(401, authError || 'Unauthorized');

    const { id } = JSON.parse(event.body || '{}');
    if (!id) return errorResponse(400, 'Missing folder id');

    const sql = neon(process.env.DATABASE_URL!);
    
    // Begin "transactional" update: Orphan bookmarks first. 
    // We only update bookmarks belonging to the user.
    await sql`
      UPDATE bookmarks 
      SET folder_id = NULL 
      WHERE folder_id = ${id} AND user_id = ${user.id}
    `;

    // Delete the folder
    const result = await sql`
      DELETE FROM folders 
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return errorResponse(404, 'Folder not found or unauthorized');
    }

    return jsonResponse(200, { success: true });
  } catch (error) {
    console.error('deleteFolder error:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};

