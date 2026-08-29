import { PageHeader } from "@/components/pms/page-header";
import { StatusBadge } from "@/components/pms/status-badge";
import { Input } from "@/components/ui/input";
import { decideGoalAction } from "@/lib/actions";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function ManagerGoalsPage() {
  const actor = await requireRole("manager");
  const { goals, directoryById } = await loadScopedData(actor);
  const pending = goals.filter((g) => g.status === "pending_approval");
  const rest = goals.filter((g) => g.status !== "pending_approval");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Approvals"
        title="Team goals"
        description="Approve KRAs/KPIs/OKRs before they become part of the official cycle."
      />
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Waiting on you</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">No pending goals.</p>
        ) : (
          pending.map((goal) => (
            <div key={goal.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-amber-800">{goal.type}</p>
                  <h3 className="font-serif text-xl">{goal.title}</h3>
                  <p className="text-sm text-slate-600">
                    {directoryById[goal.employeeId]?.fullName} · {goal.description}
                  </p>
                </div>
                <StatusBadge value={goal.status} />
              </div>
              <form action={decideGoalAction} className="mt-4 flex flex-col gap-3 md:flex-row">
                <input type="hidden" name="id" value={goal.id} />
                <Input name="comment" placeholder="Optional comment" className="bg-white" />
                <button
                  name="decision"
                  value="approve"
                  type="submit"
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
                >
                  Approve
                </button>
                <button
                  name="decision"
                  value="reject"
                  type="submit"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-white px-3 text-sm font-medium"
                >
                  Reject
                </button>
              </form>
            </div>
          ))
        )}
      </section>
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">All team goals</h2>
        {rest.map((goal) => (
          <div key={goal.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <p className="font-medium">{goal.title}</p>
              <p className="text-xs text-slate-500">{directoryById[goal.employeeId]?.fullName}</p>
            </div>
            <StatusBadge value={goal.status} />
          </div>
        ))}
      </section>
    </div>
  );
}
