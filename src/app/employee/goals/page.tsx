import { GoalForm } from "@/components/pms/goal-form";
import { PageHeader } from "@/components/pms/page-header";
import { StatusBadge } from "@/components/pms/status-badge";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function EmployeeGoalsPage() {
  const actor = await requireRole("employee");
  const { goals } = await loadScopedData(actor);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Goal setting"
        title="KRAs, KPIs, and OKRs"
        description="Create a goal and send it to your manager. It remains invisible to HR reports until it is approved."
      />
      <GoalForm />
      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{goal.type}</p>
                <h2 className="font-serif text-xl">{goal.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{goal.description}</p>
              </div>
              <StatusBadge value={goal.status} />
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>
                  {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} />
            </div>
            {goal.managerComment ? (
              <p className="mt-3 text-sm text-slate-500">Manager: {goal.managerComment}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
