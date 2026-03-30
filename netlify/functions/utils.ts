import * as jose from 'jose';

/**
 * Standard CORS headers for cross-origin Netlify functions.
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Verify the Neon Auth JWT using the JWKS endpoint.
 */
const JWKS_URL = process.env.NEON_AUTH_JWKS_URL || 'https://ep-cool-base-ajqzxcfn.neonauth.c-3.us-east-2.aws.neon.tech/neondb/auth/.well-known/jwks.json';
const JWKS = jose.createRemoteJWKSet(new URL(JWKS_URL));

export const getAuthenticatedUser = async (event: any) => {
  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Unauthorized: Missing or invalid authorization' };
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the JWT against the Neon Auth JWKS
    const { payload } = await jose.jwtVerify(token, JWKS);
    
    if (!payload || !payload.sub) {
      return { user: null, error: 'Unauthorized: Invalid token payload' };
    }

    // Map Neon payload to the internal user object structure
    // better-auth-style: { id: payload.sub, email: payload.email, ... }
    return { 
      user: { 
        id: payload.sub, 
        email: payload.email as string,
        name: payload.name as string
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Neon Auth Verification Error:', error);
    return { user: null, error: 'Unauthorized: Token verification failed' };
  }
};



export const jsonResponse = (statusCode: number, body: any) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
});

export const errorResponse = (statusCode: number, message: string) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify({ error: message }),
});
