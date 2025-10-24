import { createClient } from '@supabase/supabase-js';

// It's best practice to validate environment variables on startup.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

// Create and export the Supabase client instance.
// This will now only be created if the environment variables are present.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);