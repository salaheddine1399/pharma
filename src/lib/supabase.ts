
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Fetch Supabase URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY; // Fetch Supabase Key

// Ensure the variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
