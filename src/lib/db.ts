import postgres from "postgres";

// Supabase PostgreSQL client via postgres.js — uses DATABASE_URL from environment
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

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
