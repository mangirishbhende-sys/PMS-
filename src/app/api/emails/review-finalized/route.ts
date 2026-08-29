import { NextResponse } from "next/server";
import { sendReviewFinalizedEmail } from "@/lib/email";
import { getActor } from "@/lib/session";

export async function POST(request: Request) {
  const actor = await getActor();
  if (!actor || actor.role !== "hr") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await request.json()) as {
    to: string;
    employeeName: string;
    cycleName: string;
    managerRating: number | null;
  };
  const result = await sendReviewFinalizedEmail(body);
  return NextResponse.json(result);
}
