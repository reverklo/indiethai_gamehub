import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://caeclftaffwnorfargsi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZWNsZnRhZmZ3bm9yZmFyZ3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MTcyMjksImV4cCI6MjExMDQ5MzIyOX0.U-XDTqmeTcAyyCY6Z1zYVAbR_TX9PG_8Yy1e4KE-a3s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
