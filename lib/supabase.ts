import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Declare global variable for Supabase client
declare global {
    var supabase: SupabaseClient | undefined;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = global.supabase || createClient(supabaseUrl, supabaseKey);

// Set the Supabase client in the global context during development
if (process.env.NODE_ENV === 'development') {
    global.supabase = supabase;
}

export default supabase;