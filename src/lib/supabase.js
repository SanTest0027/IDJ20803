import { createClient } from '@supabase/supabase-js';

// Sanitize Supabase URL (strips /rest/v1 if accidentally copied from Supabase dashboard)
export const cleanSupabaseUrl = (url) => {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/rest\/?$/i, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
};

// Get Supabase credentials from environment or localStorage
export const getSupabaseConfig = () => {
  const envUrl = cleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const localUrl = cleanSupabaseUrl(localStorage.getItem('grade_sync_supabase_url'));
  const localKey = (localStorage.getItem('grade_sync_supabase_anon_key') || '').trim();

  const supabaseUrl = envUrl || localUrl || '';
  const supabaseAnonKey = envKey || localKey || '';

  return { supabaseUrl, supabaseAnonKey };
};

export const setSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('grade_sync_supabase_url', cleanSupabaseUrl(url));
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
