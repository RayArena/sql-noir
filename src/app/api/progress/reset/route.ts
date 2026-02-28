import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

/** POST /api/progress/reset — wipe all progress for the current user */
export async function POST() {
  const user = await getOrCreateUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  try {
    await sql`DELETE FROM game_progress WHERE user_id = ${user.id}`;
  } catch (err) {
    console.error("[progress/reset] error:", err);
    return new Response("Database error", { status: 500 });
  }

  return Response.json({ success: true });
}
