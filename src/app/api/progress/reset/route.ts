import { auth } from "@clerk/nextjs/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { GameProgress } from "@/models/GameProgress";

/** POST /api/progress/reset — delete user's entire progress document */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  await connectToMongoDB();
  await GameProgress.deleteOne({ userId });

  return Response.json({ ok: true });
}
