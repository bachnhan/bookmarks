import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS };
  if (event.httpMethod !== 'POST') return errorResponse(405, 'Method Not Allowed');

  try {
    const { user, error: authError } = await getAuthenticatedUser(event);
    if (authError || !user) return errorResponse(401, authError || 'Unauthorized');

    const { folderOrders } = JSON.parse(event.body || '{}');
    if (!Array.isArray(folderOrders)) return errorResponse(400, 'Invalid input: folderOrders should be an array');

    const sql = neon(process.env.DATABASE_URL!);

    // Batch update sort_order for each folder belonging to the user
    const updatePromises = folderOrders.map(fo => 
      sql`UPDATE folders SET sort_order = ${fo.sortOrder} WHERE id = ${fo.id} AND user_id = ${user.id}`
    );

    await Promise.all(updatePromises);

    return jsonResponse(200, { success: true });
  } catch (error) {
    console.error('updateFolderOrder error:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};
