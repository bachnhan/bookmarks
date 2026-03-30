import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS };
  if (event.httpMethod !== 'POST') return errorResponse(405, 'Method Not Allowed');

  try {
    const { user, error: authError } = await getAuthenticatedUser(event);
    if (authError || !user) return errorResponse(401, authError || 'Unauthorized');

    const { id, updates } = JSON.parse(event.body || '{}');
    if (!id || !updates) return errorResponse(400, 'Missing bookmark id or updates');

    const sql = neon(process.env.DATABASE_URL!);

    // Map frontend camelCase to database snake_case where necessary
    const dbUpdates: Record<string, any> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.folder_id !== undefined) dbUpdates.folder_id = updates.folder_id;
    if (updates.isStarred !== undefined) dbUpdates.is_starred = updates.isStarred;
    if (updates.isArchived !== undefined) dbUpdates.is_archived = updates.isArchived;

    const fields = Object.keys(dbUpdates);
    if (fields.length === 0) return errorResponse(400, 'No valid fields provided for update');

    // Build dynamic UPDATE query for Neon
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE bookmarks SET ${setClause} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING id`;
    const values = [...Object.values(dbUpdates), id, user.id];
    
    // Using (sql as any) to handle parameterized query string
    const result = await (sql as any)(query, values);

    if (result.length === 0) {
      return errorResponse(404, 'Bookmark not found or unauthorized');
    }

    return jsonResponse(200, { success: true });
  } catch (error) {
    console.error('updateBookmark error:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};
