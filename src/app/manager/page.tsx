import { DepartmentBarChart, GoalCompletionPie } from "@/components/pms/charts";
import { PageHeader } from "@/components/pms/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function ManagerDashboard() {
  const actor = await requireRole("manager");
  const { people, goals, reviews, department } = await loadScopedData(actor);
  const team = people.filter((p) => p.role === "employee");
  const bars = team.map((person) => {
    const theirs = goals.filter((g) => g.employeeId === person.id);
    const avg =
      theirs.length === 0
        ? 0
        : Math.round(theirs.reduce((sum, g) => sum + g.progress, 0) / theirs.length);
    return { name: person.fullName.split(" ")[0], score: avg };
  });
  const pie = [
    { name: "Not started", value: reviews.filter((r) => r.status === "not_started").length },
    { name: "In progress", value: reviews.filter((r) => r.status === "self_in_progress").length },
    { name: "Submitted", value: reviews.filter((r) => r.status === "submitted").length },
    { name: "Reviewed", value: reviews.filter((r) => r.status === "manager_reviewed" || r.status === "finalized").length },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={`${department?.name} · Manager`}
        title="Team performance"
        description="You only see employees in your department. Finance data never appears in an IT manager workspace."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Team size</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">{team.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Pending goal approvals</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">
            {goals.filter((g) => g.status === "pending_approval").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Reviews waiting on you</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">
            {reviews.filter((r) => r.status === "submitted").length}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average goal progress</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBarChart data={bars} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appraisal status</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalCompletionPie data={pie} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
