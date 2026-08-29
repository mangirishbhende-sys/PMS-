import { PageHeader } from "@/components/pms/page-header";
import { SelfAppraisalForm } from "@/components/pms/self-appraisal-form";
import { StatusBadge } from "@/components/pms/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function EmployeeAppraisalPage() {
  const actor = await requireRole("employee");
  const { reviews } = await loadScopedData(actor);
  const review = reviews[0];

  return (
    <div>
      <PageHeader
        eyebrow="Core flow"
        title="Self-appraisal"
        description="Rate your cycle, then submit. Your manager reviews next. HR only sees the file after the manager rating is in, and the official report after HR finalizes."
      />
      {!review ? (
        <p className="text-sm text-slate-500">No review cycle has been opened for you yet.</p>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{review.cycleName}</CardTitle>
            <StatusBadge value={review.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            {review.managerRating ? (
              <p className="rounded-lg bg-slate-50 p-3 text-sm">
                Manager rating: <strong>{review.managerRating}/5</strong>
                {review.managerComments ? ` — ${review.managerComments}` : ""}
              </p>
            ) : null}
            {review.hrNotes ? (
              <p className="rounded-lg bg-teal-50 p-3 text-sm">HR: {review.hrNotes}</p>
            ) : null}
            <SelfAppraisalForm review={review} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
