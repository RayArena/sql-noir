import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("CLERK_WEBHOOK_SECRET is not set", { status: 500 });
  }

  // Get Svix headers
  const headerList = await headers();
  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = evt;

  // ── user.created / user.updated ────────────────────────────────────────────
  if (type === "user.created" || type === "user.updated") {
    const {
      id: clerk_id,
      email_addresses,
      phone_numbers,
      first_name,
      last_name,
      username,
      image_url,
      created_at,
    } = data;

    const primaryEmail =
      email_addresses?.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ??
      email_addresses?.[0]?.email_address ??
      null;

    const primaryPhone =
      phone_numbers?.find((p) => p.id === data.primary_phone_number_id)
        ?.phone_number ??
      phone_numbers?.[0]?.phone_number ??
      null;

    const full_name =
      [first_name, last_name].filter(Boolean).join(" ").trim() || null;

    const now = new Date().toISOString();
    const created_at_iso =
      type === "user.created" && created_at
        ? new Date(created_at).toISOString()
        : now;

    try {
      await sql`
        INSERT INTO users (clerk_id, email, full_name, username, avatar_url, phone_number, created_at, updated_at)
        VALUES (
          ${clerk_id}, ${primaryEmail}, ${full_name},
          ${username ?? null}, ${image_url ?? null}, ${primaryPhone},
          ${created_at_iso}, ${now}
        )
        ON CONFLICT (clerk_id) DO UPDATE SET
          email        = ${primaryEmail},
          full_name    = ${full_name},
          username     = ${username ?? null},
          avatar_url   = ${image_url ?? null},
          phone_number = ${primaryPhone},
          updated_at   = ${now}
      `;
    } catch (err) {
      console.error("[webhook] upsert user error:", err);
      return new Response("Database error", { status: 500 });
    }

    console.log(`[webhook] ${type} synced: ${clerk_id}`);
  }

  // ── session.created → update last_sign_in_at ───────────────────────────────
  if (type === "session.created") {
    const { user_id: clerk_id } = data as { user_id: string };
    const now = new Date().toISOString();

    try {
      await sql`UPDATE users SET last_sign_in_at = ${now} WHERE clerk_id = ${clerk_id}`;
    } catch (err) {
      console.error("[webhook] session.created update error:", err);
      return new Response("Database error", { status: 500 });
    }

    console.log(`[webhook] session.created synced: ${clerk_id}`);
  }

  // ── user.deleted ───────────────────────────────────────────────────────────
  if (type === "user.deleted") {
    const { id: clerk_id } = data;
    if (clerk_id) {
      // Delete user — game_progress cascades automatically
      try {
        await sql`DELETE FROM users WHERE clerk_id = ${clerk_id}`;
      } catch (err) {
        console.error("[webhook] delete user error:", err);
        return new Response("Database error", { status: 500 });
      }
      console.log(`[webhook] user.deleted synced: ${clerk_id}`);
    }
  }

  return new Response("OK", { status: 200 });
}
