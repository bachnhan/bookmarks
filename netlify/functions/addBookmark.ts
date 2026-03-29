import { neon } from '@neondatabase/serverless';
import { createClient } from '@supabase/supabase-js';

// Define CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

/**
 * Netlify Function handler to add a new bookmark.
 * This function verifies the user session via Supabase before processing the request.
 * It ensures the bookmark is associated with the authenticated user in the Neon database.
 */
export const handler = async (event) => {
  // Handle Preflight OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS };
  }

  // Only allow POST requests for adding data
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: CORS_HEADERS, 
      body: 'Method Not Allowed' 
    };
  }

  try {
    // 1. Validate Environment Variables
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY || !process.env.DATABASE_URL) {
      throw new Error('Environment variables (Supabase or Neon) are missing.');
    }

    // 2. Initialize Supabase client
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    // 3. Extract and verify JWT token from Authorization header
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
        body: JSON.stringify({ error: 'Unauthorized: Session is invalid or expired' }) 
      };
    }

    // 4. Initialize Neon DB client and parse request body
    const sql = neon(process.env.DATABASE_URL);
    const body = JSON.parse(event.body);

    // We use user.id from the verified session to enforce security
    const userId = user.id;

    // 5. Insert bookmark with the authenticated user's ID
    const result = await sql`
      INSERT INTO bookmarks (url, title, description, user_id, type)
      VALUES (${body.url}, ${body.title}, ${body.description}, ${userId}, ${body.type || 'link'})
      RETURNING *;
    `;

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify(result[0]),
    };
  } catch (error) {
    console.error('[Server Error] Exception in addBookmark:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
