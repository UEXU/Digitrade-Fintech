import { createClient } from '@supabase/supabase-js';

// Fallback URL to prevent initialization crash when environment variables are missing.
// The code handles empty/invalid results gracefully in the components.
const DEFAULT_URL = 'https://placeholder.supabase.co';
const DEFAULT_KEY = 'placeholder-key';

let rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

// Clean up the URL: strip trailing slashes and common API suffixes
rawUrl = rawUrl.trim().replace(/\/+$/, '');
if (rawUrl.endsWith('/rest/v1')) {
  rawUrl = rawUrl.replace('/rest/v1', '');
}

// Ensure URL starts with https:// if it looks like a hostname
const supabaseUrl = rawUrl.includes('://') 
  ? rawUrl 
  : rawUrl 
    ? `https://${rawUrl}` 
    : DEFAULT_URL;

if (!rawUrl || rawUrl === 'https://your-project.supabase.co') {
  console.warn('Supabase URL is missing or default. App will run in demo/read-only mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
