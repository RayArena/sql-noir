import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateSupabaseUser } from "@/lib/getOrCreateUser";

/** GET /api/progress — fetch the current user's game progress */
export async function GET() {
  const user = await getOrCreateSupabaseUser();
  if (!user) return new Response("Unauthorized", { status: 401 });


  const { data: rows } = await supabaseAdmin
    .from("game_progress")
    .select("case_id, objective_idx, completed")
    .eq("user_id", user.id) as { data: { case_id: number; objective_idx: number; completed: boolean }[] | null; error: unknown };

  const completedCases: number[] =
    rows?.filter((r) => r.completed).map((r) => r.case_id) ?? [];

  const currentObjectives: Record<number, number> = Object.fromEntries(
    rows?.map((r) => [r.case_id, r.objective_idx]) ?? []
  );

  return Response.json({ completedCases, currentObjectives });
}
