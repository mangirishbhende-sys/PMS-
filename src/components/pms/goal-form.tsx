import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGoalAction } from "@/lib/actions";

export function GoalForm() {
  return (
    <form action={createGoalAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Goal title</Label>
          <Input id="title" name="title" required placeholder="Increase forecast accuracy to 95%" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            defaultValue="kpi"
            className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="kra">KRA</option>
            <option value="kpi">KPI</option>
            <option value="okr">OKR</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="targetValue">Target</Label>
            <Input id="targetValue" name="targetValue" type="number" step="0.01" defaultValue={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" name="unit" defaultValue="%" />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="How this will be measured and why it matters."
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
      >
        Submit for manager approval
      </button>
    </form>
  );
}
