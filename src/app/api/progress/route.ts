import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

/** GET /api/progress — fetch the current user's game progress */
export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const rows = await sql`
    SELECT case_id, objective_idx, completed
    FROM game_progress
    WHERE user_id = ${user.id}
  ` as { case_id: number; objective_idx: number; completed: boolean }[];

  const completedCases: number[] =
    rows.filter((r) => r.completed).map((r) => r.case_id);

  const currentObjectives: Record<number, number> = Object.fromEntries(
    rows.map((r) => [r.case_id, r.objective_idx])
  );

  return Response.json({ completedCases, currentObjectives });
}
