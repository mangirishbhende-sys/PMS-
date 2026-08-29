import { Resend } from "resend";
import { isResendConfigured } from "@/lib/config";

export async function sendReviewFinalizedEmail(input: {
  to: string;
  employeeName: string;
  cycleName: string;
  managerRating: number | null;
}) {
  if (!isResendConfigured()) {
    console.info("[resend:skipped]", input);
    return { skipped: true as const };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Northstar PMS <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: `${input.cycleName} review is finalized`,
    html: `
      <div style="font-family:Georgia,serif;color:#122033;line-height:1.6">
        <h1 style="font-size:20px">Your ${input.cycleName} review is complete</h1>
        <p>Hello ${input.employeeName},</p>
        <p>HR has finalized your appraisal. Your manager rating is
        <strong>${input.managerRating ?? "n/a"} / 5</strong>.</p>
        <p>Sign in to Northstar PMS to read the full report.</p>
      </div>
    `,
  });
  if (error) throw error;
  return { skipped: false as const };
}
