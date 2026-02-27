import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateSupabaseUser } from "@/lib/getOrCreateUser";

/** POST /api/progress/advance  — advance the current objective for a case */
export async function POST(req: Request) {
  const user = await getOrCreateSupabaseUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { caseId, totalObjectives } = (await req.json()) as {
    caseId: number;
    totalObjectives: number;
  };

  // Read current progress
  const { data: current } = await supabaseAdmin
    .from("game_progress")
    .select("objective_idx")
    .eq("user_id", user.id)
    .eq("case_id", caseId)
    .single() as { data: { objective_idx: number } | null; error: unknown };

  const currentIdx = current?.objective_idx ?? 0;
  const nextIdx = currentIdx + 1;
  const completed = nextIdx >= totalObjectives;

  const { error } = await supabaseAdmin.from("game_progress").upsert(
    {
      user_id: user.id,
      case_id: caseId,
      objective_idx: nextIdx,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,case_id" }
  );

  if (error) {
    console.error("[progress/advance] error:", error);
    return new Response("Supabase error", { status: 500 });
  }

  return Response.json({ success: true, nextIdx, completed });
}
