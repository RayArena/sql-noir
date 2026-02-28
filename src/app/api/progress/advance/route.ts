import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

/** POST /api/progress/advance — advance the current objective for a case */
export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { caseId, totalObjectives } = (await req.json()) as {
    caseId: number;
    totalObjectives: number;
  };

  // Read current progress
  const current = await sql`
    SELECT objective_idx FROM game_progress
    WHERE user_id = ${user.id} AND case_id = ${caseId}
  ` as { objective_idx: number }[];

  const currentIdx = current[0]?.objective_idx ?? 0;
  const nextIdx = currentIdx + 1;
  const completed = nextIdx >= totalObjectives;
  const now = new Date().toISOString();

  try {
    await sql`
      INSERT INTO game_progress (user_id, case_id, objective_idx, completed, completed_at, updated_at)
      VALUES (${user.id}, ${caseId}, ${nextIdx}, ${completed}, ${completed ? now : null}, ${now})
      ON CONFLICT (user_id, case_id) DO UPDATE SET
        objective_idx = ${nextIdx},
        completed = ${completed},
        completed_at = ${completed ? now : null},
        updated_at = ${now}
    `;
  } catch (err) {
    console.error("[progress/advance] error:", err);
    return new Response("Database error", { status: 500 });
  }

  return Response.json({ success: true, nextIdx, completed });
}
