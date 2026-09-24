import { auth } from "@clerk/nextjs/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { GameProgress } from "@/models/GameProgress";

/** POST /api/progress/lesson — mark a tutorial lesson as completed */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { lessonId } = (await request.json()) as { lessonId: string };
  if (!lessonId) return new Response("Missing lessonId", { status: 400 });

  await connectToMongoDB();

  let doc = await GameProgress.findOne({ userId });
  if (!doc) {
    doc = new GameProgress({ userId });
  }

  if (!doc.completedLessons.includes(lessonId)) {
    doc.completedLessons.push(lessonId);
    await doc.save();
  }

  return Response.json({ ok: true });
}
