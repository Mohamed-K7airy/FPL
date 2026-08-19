import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ncjxczeedvmrfshnbvxv.supabase.co';
const DEFAULT_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5janhjemVlZHZtcmZzaG5idnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzgxNzcsImV4cCI6MjEwMDY1NDE3N30.07S5qjJkSg2G0Fp33J3l-19a9K6p-93j2a10';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
