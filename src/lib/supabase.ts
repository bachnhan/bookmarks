import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables (configured in .env or Netlify)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize and export the Supabase client for use throughout the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
