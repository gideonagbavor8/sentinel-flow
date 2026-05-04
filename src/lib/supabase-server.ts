import { createClient } from '@supabase/supabase-js';

// Force disable TLS rejection for local development to fix "fetch failed" caused by self-signed certificates.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase URL or Service Role Key is missing. Storage operations will fail.");
}

// This client bypasses RLS policies entirely. NEVER use this on the client-side.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
