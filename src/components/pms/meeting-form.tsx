import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scheduleMeetingAction } from "@/lib/actions";
import type { DirectoryUser } from "@/lib/types";

export function MeetingForm({
  people,
  defaultEmployeeId,
}: {
  people: DirectoryUser[];
  defaultEmployeeId?: string;
}) {
  const employees = people.filter((p) => p.role === "employee");
  return (
    <form action={scheduleMeetingAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee</Label>
          <select
            id="employeeId"
            name="employeeId"
            required
            defaultValue={defaultEmployeeId ?? employees[0]?.id}
            className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {employees.map((person) => (
              <option key={person.id} value={person.id}>
                {person.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Start time</Label>
          <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue="Appraisal 1-on-1" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
      >
        Book meeting and generate Meet link
      </button>
    </form>
  );
}
