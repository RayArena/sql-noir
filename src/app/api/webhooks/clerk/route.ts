import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

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

  if (type === "user.created" || type === "user.updated") {
    const {
      id: clerk_id,
      email_addresses,
      first_name,
      last_name,
      username,
      image_url,
    } = data;

    const primaryEmail =
      email_addresses?.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ??
      email_addresses?.[0]?.email_address ??
      null;

    const full_name =
      [first_name, last_name].filter(Boolean).join(" ").trim() || null;

    const { error } = await supabaseAdmin.from("users").upsert(
      {
        clerk_id,
        email: primaryEmail,
        full_name,
        username: username ?? null,
        avatar_url: image_url ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_id" }
    );

    if (error) {
      console.error("[webhook] upsert user error:", error);
      return new Response("Supabase error", { status: 500 });
    }

    console.log(`[webhook] ${type} synced: ${clerk_id}`);
  }

  if (type === "user.deleted") {
    const { id: clerk_id } = data;
    if (clerk_id) {
      // Delete user — game_progress cascades automatically
      const { error } = await supabaseAdmin
        .from("users")
        .delete()
        .eq("clerk_id", clerk_id);

      if (error) {
        console.error("[webhook] delete user error:", error);
        return new Response("Supabase error", { status: 500 });
      }
      console.log(`[webhook] user.deleted synced: ${clerk_id}`);
    }
  }

  return new Response("OK", { status: 200 });
}
