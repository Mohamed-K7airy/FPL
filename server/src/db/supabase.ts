import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  logger.warn('Supabase URL or Service Role Key is missing in environment variables. Database calls will fail until configured.');
}

// Service role client bypasses RLS for backend API service operations
export const supabase = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  config.supabase.serviceRoleKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
