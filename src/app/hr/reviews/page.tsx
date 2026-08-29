import { FinalizeReviewForm } from "@/components/pms/finalize-form";
import { PageHeader } from "@/components/pms/page-header";
import { StatusBadge } from "@/components/pms/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function HrReviewsPage() {
  const actor = await requireRole("hr");
  const { reviews, directoryById } = await loadScopedData(actor);
  const visible = reviews.filter((r) =>
    ["manager_reviewed", "finalized"].includes(r.status),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Core flow"
        title="Finalized reports"
        description="HR steps in after the manager rates. Finalizing sends the Resend notification."
      />
      {visible.length === 0 ? (
        <p className="text-sm text-slate-500">No manager-completed reviews in this department yet.</p>
      ) : (
        visible.map((review) => {
          const employee = directoryById[review.employeeId];
          return (
            <Card key={review.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{employee?.fullName}</CardTitle>
                  <p className="text-sm text-slate-500">
                    {employee?.jobTitle} · {review.cycleName}
                  </p>
                </div>
                <StatusBadge value={review.status} />
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4 text-sm">
                  <p className="font-medium">Self · {review.selfRating ?? "—"}/5</p>
                  <p className="mt-1 text-slate-600">{review.selfComments}</p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-4 text-sm">
                  <p className="font-medium">Manager · {review.managerRating ?? "—"}/5</p>
                  <p className="mt-1 text-slate-600">{review.managerComments}</p>
                </div>
                <div className="md:col-span-2">
                  <FinalizeReviewForm review={review} />
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
