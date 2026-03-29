import { betterAuth } from 'better-auth';
import { neon } from '@neondatabase/serverless';

// Initialize Neon database client for auth storage
const sql = neon(process.env.DATABASE_URL!);

// Configure Better-Auth with Neon adapter and email/password support
export const auth = betterAuth({
    database: sql,
    emailAndPassword: {
        enabled: true,
    },
    // Define trusted origins for security
    trustedOrigins: [process.env.APP_URL || 'http://localhost:3000', 'https://localhost', 'http://localhost:8888'],
});

// Edge function handler for authentication requests
export default async (req: Request) => {
    return auth.handler(req);
};

// Route configuration for the auth endpoint
export const config = {
    path: '/api/auth/*',
};
