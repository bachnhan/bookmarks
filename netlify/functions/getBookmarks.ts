import { neon } from '@neondatabase/serverless';
import { createClient } from '@supabase/supabase-js';

// Define CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

/**
 * Netlify Function handler to retrieve bookmarks.
 * It verifies the user session via Supabase and returns only bookmarks belonging to that user.
 */
export const handler = async (event) => {
  // Handle Preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers: CORS_HEADERS, 
      body: 'Method Not Allowed' 
    };
  }

  try {
    // 1. Initialize Supabase client
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );

    // 2. Extract and verify JWT token from Authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        statusCode: 401, 
        headers: CORS_HEADERS, 
        body: JSON.stringify({ error: 'Missing or invalid authorization header' }) 
      };
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('[Auth Error]', authError?.message);
      return { 
        statusCode: 401, 
        headers: CORS_HEADERS, 
        body: JSON.stringify({ error: 'Unauthorized session' }) 
      };
    }

    // 3. Initialize Neon DB client and fetch data
    const sql = neon(process.env.DATABASE_URL!);
    
    // Filter bookmarks strictly by the verified user_id
    const bookmarks = await sql`
      SELECT * FROM bookmarks 
      WHERE user_id = ${user.id}
      ORDER BY addedat DESC
    `;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(bookmarks),
    };
  } catch (error) {
    console.error('[Server Error] Exception in getBookmarks:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
