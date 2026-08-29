import { GoalCompletionPie, DepartmentBarChart } from "@/components/pms/charts";
import { PageHeader } from "@/components/pms/page-header";
import { StatusBadge } from "@/components/pms/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function EmployeeDashboard() {
  const actor = await requireRole("employee");
  const { goals, reviews, meetings, department } = await loadScopedData(actor);
  const pie = [
    { name: "Approved", value: goals.filter((g) => g.status === "approved" || g.status === "completed").length },
    { name: "Pending", value: goals.filter((g) => g.status === "pending_approval").length },
    { name: "Rejected", value: goals.filter((g) => g.status === "rejected").length },
  ];
  const bars = goals.map((g) => ({ name: g.title.slice(0, 18), score: g.progress }));
  const review = reviews[0];

  return (
    <div>
      <PageHeader
        eyebrow={`${department?.name} · Employee`}
        title={`Good morning, ${actor.fullName.split(" ")[0]}`}
        description="Your KRAs, KPIs, and OKRs for the H2 2026 cycle. Your manager must approve new goals before they count toward the review."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Goals</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">{goals.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Appraisal</CardTitle>
          </CardHeader>
          <CardContent>
            {review ? <StatusBadge value={review.status} /> : "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Upcoming 1-on-1s</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">{meetings.length}</CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goal completion mix</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalCompletionPie data={pie} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress by goal</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBarChart data={bars} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
