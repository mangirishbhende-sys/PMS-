import { MeetingForm } from "@/components/pms/meeting-form";
import { PageHeader } from "@/components/pms/page-header";
import { StatusBadge } from "@/components/pms/status-badge";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function EmployeeMeetingsPage() {
  const actor = await requireRole("employee");
  const { meetings, people } = await loadScopedData(actor);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Review cycle"
        title="Book a 1-on-1"
        description="Pick a time. Northstar generates a mock Google Meet link your manager can join."
      />
      <MeetingForm people={people} defaultEmployeeId={actor.id} />
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">{meeting.title}</h2>
              <StatusBadge value={meeting.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {new Date(meeting.scheduledAt).toLocaleString()} · {meeting.durationMinutes} min
            </p>
            <a className="mt-2 inline-block text-sm text-teal-800 underline" href={meeting.meetUrl}>
              {meeting.meetUrl}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
