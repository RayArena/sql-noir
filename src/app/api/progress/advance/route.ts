import { auth } from "@clerk/nextjs/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { GameProgress } from "@/models/GameProgress";

/** POST /api/progress/advance — advance objective, mark quest/case complete */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { caseId, totalObjectives, questId } = await request.json() as {
    caseId: number;
    totalObjectives: number;
    questId?: string;
  };

  await connectToMongoDB();

  // Get or create document
  let doc = await GameProgress.findOne({ userId });
  if (!doc) {
    doc = new GameProgress({ userId });
  }

  // Advance objective index
  const key = String(caseId);
  const currentIdx = (doc.currentObjectives.get(key) ?? 0);
  const nextIdx = currentIdx + 1;
  doc.currentObjectives.set(key, nextIdx);

  // Mark case complete if all objectives done
  if (nextIdx >= totalObjectives && !doc.completedCases.includes(caseId)) {
    doc.completedCases.push(caseId);
  }

  // Mark quest complete if provided
  if (questId && !doc.completedQuests.includes(questId)) {
    doc.completedQuests.push(questId);
  }

  await doc.save();

  return Response.json({ ok: true });
}
