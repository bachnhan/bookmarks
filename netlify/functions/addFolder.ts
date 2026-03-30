import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUser, jsonResponse, errorResponse, CORS_HEADERS } from './utils';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS };
  if (event.httpMethod !== 'POST') return errorResponse(405, 'Method Not Allowed');

  try {
    const { user, error: authError } = await getAuthenticatedUser(event);
    if (authError || !user) return errorResponse(401, authError || 'Unauthorized');

    const { name, parent_id } = JSON.parse(event.body || '{}');
    if (!name) return errorResponse(400, 'Missing folder name');

    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`
      INSERT INTO folders (name, user_id, parent_id, iconname)
      VALUES (${name}, ${user.id}, ${parent_id || null}, 'Folder')
      RETURNING id, name, parent_id, iconname as "iconName"
    `;

    return jsonResponse(201, result[0]);
  } catch (error) {
    console.error('addFolder error:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};
