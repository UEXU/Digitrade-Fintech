import { createClient } from '@supabase/supabase-js';

// Fallback logic to prevent crash while allowing the app to run in demo mode
const DEFAULT_URL = 'https://placeholder.supabase.co';
const DEFAULT_KEY = 'placeholder-key';

let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim() || DEFAULT_KEY;

// Robust URL cleaning: remove common API path suffixes that the SDK adds automatically
if (rawUrl.endsWith('/rest/v1')) {
  rawUrl = rawUrl.replace('/rest/v1', '');
}
if (rawUrl.endsWith('/auth/v1')) {
  rawUrl = rawUrl.replace('/auth/v1', '');
}

// Ensure URL starts with protocol
const supabaseUrl = rawUrl.includes('://') 
  ? rawUrl 
  : rawUrl 
    ? `https://${rawUrl}` 
    : DEFAULT_URL;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
