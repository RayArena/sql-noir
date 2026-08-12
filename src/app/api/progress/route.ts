import { auth } from "@clerk/nextjs/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { GameProgress } from "@/models/GameProgress";

/** GET /api/progress — fetch the current user's game progress */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  await connectToMongoDB();

  const doc = await GameProgress.findOne({ userId }).lean();

  if (!doc) {
    return Response.json({ completedCases: [], completedQuests: [], currentObjectives: {} });
  }

  // Convert Map to plain object for JSON serialization
  const currentObjectives: Record<number, number> = {};
  if (doc.currentObjectives) {
    for (const [k, v] of Object.entries(doc.currentObjectives)) {
      currentObjectives[Number(k)] = v as number;
    }
  }

  return Response.json({
    completedCases: doc.completedCases ?? [],
    completedQuests: doc.completedQuests ?? [],
    currentObjectives,
  });
}
