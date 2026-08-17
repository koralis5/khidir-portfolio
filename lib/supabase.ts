import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client using the service_role key. Never import this from a
// client component — RLS is enabled with no public policies, so this key is
// the only thing that can read/write these tables.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
