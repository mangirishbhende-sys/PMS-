import { DepartmentBarChart, GoalCompletionPie } from "@/components/pms/charts";
import { PageHeader } from "@/components/pms/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function HrDashboard() {
  const actor = await requireRole("hr");
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
    { name: "Open", value: reviews.filter((r) => r.status !== "finalized").length },
    { name: "Finalized", value: reviews.filter((r) => r.status === "finalized").length },
    { name: "Manager done", value: reviews.filter((r) => r.status === "manager_reviewed").length },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={`${department?.name} · HR`}
        title="Department cycle"
        description="Finance HR cannot see IT. This workspace is locked to your department's directory, goals, and appraisals."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">People in view</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">{people.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Ready to finalize</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">
            {reviews.filter((r) => r.status === "manager_reviewed").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Finalized</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">
            {reviews.filter((r) => r.status === "finalized").length}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department goal progress</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBarChart data={bars} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appraisal completion</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalCompletionPie data={pie} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
