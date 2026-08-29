import { ManagerReviewForm } from "@/components/pms/manager-review-form";
import { PageHeader } from "@/components/pms/page-header";
import { StatusBadge } from "@/components/pms/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function ManagerReviewsPage() {
  const actor = await requireRole("manager");
  const { reviews, directoryById } = await loadScopedData(actor);
  const actionable = reviews.filter((r) =>
    ["submitted", "manager_reviewed", "finalized"].includes(r.status),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Core flow"
        title="Manager reviews"
        description="Rate submitted self-appraisals. HR can open the file after you save a rating."
      />
      {actionable.length === 0 ? (
        <p className="text-sm text-slate-500">No submitted appraisals yet.</p>
      ) : (
        actionable.map((review) => (
          <Card key={review.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{directoryById[review.employeeId]?.fullName}</CardTitle>
                <p className="text-sm text-slate-500">{review.cycleName}</p>
              </div>
              <StatusBadge value={review.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-4 text-sm">
                <p className="font-medium">Self-appraisal · {review.selfRating ?? "—"}/5</p>
                <p className="mt-1 text-slate-600">{review.selfComments}</p>
              </div>
              <ManagerReviewForm review={review} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
