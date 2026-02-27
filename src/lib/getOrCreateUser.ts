import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Returns the Supabase user row for the currently authenticated Clerk user.
 * If the row doesn't exist yet, it is created automatically.
 * This removes the need for a Clerk webhook during development.
 */
export async function getOrCreateSupabaseUser(): Promise<{ id: string } | null> {
  const user = await currentUser();
  if (!user) return null;

  // Try to find existing row
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", user.id)
    .single();

  if (existing) return existing as { id: string };

  // Auto-create on first access (replaces webhook for local dev)
  const primaryEmail =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    null;

  const full_name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null;

  const { data: created } = await supabaseAdmin
    .from("users")
    .insert({
      clerk_id: user.id,
      email: primaryEmail,
      full_name,
      username: user.username ?? null,
      avatar_url: user.imageUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  return created as { id: string } | null;
}
