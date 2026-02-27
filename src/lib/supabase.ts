import { createClient } from "@supabase/supabase-js";

// Server-only admin client (uses service role key — never expose to browser)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── Convenience row shapes (for type safety in API routes) ───────────────────
export interface DbUser {
  id: string;
  clerk_id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbGameProgress {
  id: string;
  user_id: string;
  case_id: number;
  objective_idx: number;
  completed: boolean;
  completed_at: string | null;
  updated_at: string;
}

