
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejktvezquzuoizjqcixe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqa3R2ZXpxdXp1b2l6anFjaXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjkzNjMsImV4cCI6MjA1MjQ0NTM2M30.yBYRhjTNGdlQfM10f1r2eP9V1-R8nRZJ_hJnDdCpX4U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
