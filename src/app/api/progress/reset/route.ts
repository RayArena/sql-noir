import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateSupabaseUser } from "@/lib/getOrCreateUser";

/** POST /api/progress/reset — wipe all progress for the current user */
export async function POST() {
  const user = await getOrCreateSupabaseUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { error } = await supabaseAdmin
    .from("game_progress")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("[progress/reset] error:", error);
    return new Response("Supabase error", { status: 500 });
  }

  return Response.json({ success: true });
}
