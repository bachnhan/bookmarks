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
    let updatedId: string | null = null;

    // We process each valid update field separately to maintain safety with Neon's template literal syntax
    // This is more robust for serverless environments than manual dynamic query building
    
    if (updates.title !== undefined) {
      const res = await sql`UPDATE bookmarks SET title = ${updates.title} WHERE id = ${id} AND user_id = ${user.id} RETURNING id`;
      if (res.length > 0) updatedId = res[0].id;
    }
    if (updates.description !== undefined) {
      const res = await sql`UPDATE bookmarks SET description = ${updates.description} WHERE id = ${id} AND user_id = ${user.id} RETURNING id`;
      if (res.length > 0) updatedId = res[0].id;
    }
    if (updates.url !== undefined) {
      const res = await sql`UPDATE bookmarks SET url = ${updates.url} WHERE id = ${id} AND user_id = ${user.id} RETURNING id`;
      if (res.length > 0) updatedId = res[0].id;
    }
    if (updates.folder_id !== undefined) {
      // Allow moving to null (Unsorted)
      const res = await sql`UPDATE bookmarks SET folder_id = ${updates.folder_id} WHERE id = ${id} AND user_id = ${user.id} RETURNING id`;
      if (res.length > 0) updatedId = res[0].id;
    }
    if (updates.isStarred !== undefined) {
      const res = await sql`UPDATE bookmarks SET is_starred = ${updates.isStarred} WHERE id = ${id} AND user_id = ${user.id} RETURNING id`;
      if (res.length > 0) updatedId = res[0].id;
    }
    if (updates.isArchived !== undefined) {
      const res = await sql`UPDATE bookmarks SET is_archived = ${updates.isArchived} WHERE id = ${id} AND user_id = ${user.id} RETURNING id`;
      if (res.length > 0) updatedId = res[0].id;
    }

    if (!updatedId) {
      return errorResponse(404, 'Bookmark not found, unauthorized, or no valid updates provided');
    }

    return jsonResponse(200, { success: true, id: updatedId });
  } catch (error) {
    console.error('updateBookmark error:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};
