import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

// Initialize the Neon Auth client with the React adapter to enable hooks like useSession
export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
    adapter: BetterAuthReactAdapter()
});

// Export convenience hooks/methods for ease of use across the frontend
export const { 
    signIn, 
    signOut, 
    signUp, 
    useSession 
} = authClient;

