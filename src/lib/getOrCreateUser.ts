import { currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

/**
 * Returns the Neon DB user row for the currently authenticated Clerk user.
 * If the row doesn't exist yet, it is created automatically.
 * This removes the need for a Clerk webhook during development.
 */
export async function getOrCreateUser(): Promise<{ id: string } | null> {
  const user = await currentUser();
  if (!user) {
    console.warn("[getOrCreateUser] no Clerk session — returning null");
    return null;
  }

  console.log("[getOrCreateUser] clerk_id:", user.id);

  // Try to find existing row
  let existing: { id: string }[] = [];
  try {
    existing = await sql`SELECT id FROM users WHERE clerk_id = ${user.id}` as { id: string }[];
  } catch (err) {
    console.error("[getOrCreateUser] select error:", err);
    return null;
  }

  if (existing.length > 0) {
    console.log("[getOrCreateUser] found existing user:", existing[0].id);
    return existing[0];
  }

  // Auto-create on first access (replaces webhook for local dev)
  console.log("[getOrCreateUser] creating new user for clerk_id:", user.id);

  const primaryEmail =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    null;

  const full_name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null;

  const primaryPhone =
    user.phoneNumbers?.find((p) => p.id === user.primaryPhoneNumberId)
      ?.phoneNumber ??
    user.phoneNumbers?.[0]?.phoneNumber ??
    null;

  const now = new Date().toISOString();
  let created: { id: string }[] = [];
  try {
    created = await sql`
      INSERT INTO users (clerk_id, email, full_name, username, avatar_url, phone_number, last_sign_in_at, updated_at)
      VALUES (
        ${user.id}, ${primaryEmail}, ${full_name},
        ${user.username ?? null}, ${user.imageUrl ?? null},
        ${primaryPhone}, ${now}, ${now}
      )
      ON CONFLICT (clerk_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        username = EXCLUDED.username,
        avatar_url = EXCLUDED.avatar_url,
        phone_number = EXCLUDED.phone_number,
        last_sign_in_at = EXCLUDED.last_sign_in_at,
        updated_at = EXCLUDED.updated_at
      RETURNING id
    ` as { id: string }[];
  } catch (err) {
    console.error("[getOrCreateUser] insert error:", err);
    return null;
  }

  if (!created.length) {
    console.error("[getOrCreateUser] insert returned no rows");
    return null;
  }

  console.log("[getOrCreateUser] created user:", created[0].id);
  return created[0];
}
