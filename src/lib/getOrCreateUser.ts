import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Returns the Supabase user row for the currently authenticated Clerk user.
 * If the row doesn't exist yet, it is created automatically.
 * This removes the need for a Clerk webhook during development.
 */
export async function getOrCreateSupabaseUser(): Promise<{ id: string } | null> {
  const user = await currentUser();
  if (!user) {
    console.warn("[getOrCreateUser] no Clerk session — returning null");
    return null;
  }

  console.log("[getOrCreateUser] clerk_id:", user.id);

  // Try to find existing row
  const { data: existing, error: selectError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", user.id)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116 = "exactly one row expected but 0 found" — normal for new users
    console.error("[getOrCreateUser] select error:", selectError);
    return null;
  }

  if (existing) {
    console.log("[getOrCreateUser] found existing user:", existing.id);
    return existing as { id: string };
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

  const { data: created, error: insertError } = await supabaseAdmin
    .from("users")
    .insert({
      clerk_id: user.id,
      email: primaryEmail,
      full_name,
      username: user.username ?? null,
      avatar_url: user.imageUrl ?? null,
      phone_number: primaryPhone,
      last_sign_in_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[getOrCreateUser] insert error:", insertError);
    return null;
  }

  console.log("[getOrCreateUser] created user:", created?.id);
  return created as { id: string } | null;
}
