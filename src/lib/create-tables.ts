import "dotenv/config";
import { sql } from "./db";

async function main() {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT,
      email TEXT,
      full_name TEXT,
      username TEXT,
      avatar_url TEXT,
      phone_number TEXT,
      last_sign_in_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS game_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      case_id INTEGER NOT NULL,
      objective_idx INTEGER NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      completed_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT game_progress_user_case_unique UNIQUE (user_id, case_id)
    );
  `;

  console.log("Tables ensured.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});