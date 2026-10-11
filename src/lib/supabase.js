import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or localStorage (for easy testing without restarting dev server)
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('grade_sync_supabase_url');
  const localKey = localStorage.getItem('grade_sync_supabase_anon_key');

  const supabaseUrl = envUrl || localUrl || '';
  const supabaseAnonKey = envKey || localKey || '';

  return { supabaseUrl, supabaseAnonKey };
};

export const setSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('grade_sync_supabase_url', url.trim());
  if (key) localStorage.setItem('grade_sync_supabase_anon_key', key.trim());
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('grade_sync_supabase_url');
  localStorage.removeItem('grade_sync_supabase_anon_key');
  window.location.reload();
};

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;
