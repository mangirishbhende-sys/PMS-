import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { getDirectoryUserByEmail, linkClerkId } from "@/lib/repository";

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }
  const event = await verifyWebhook(request);
  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ ok: true });
  }
  const email = event.data.email_addresses?.[0]?.email_address?.toLowerCase();
  if (!email) return NextResponse.json({ ok: true });
  const directoryUser = await getDirectoryUserByEmail(email);
  if (!directoryUser) {
    return NextResponse.json({ unmatched: true });
  }
  await linkClerkId(directoryUser.id, event.data.id);
  const client = await clerkClient();
  await client.users.updateUserMetadata(event.data.id, {
    publicMetadata: { role: directoryUser.role, departmentId: directoryUser.departmentId },
  });
  return NextResponse.json({ linked: directoryUser.id });
}
