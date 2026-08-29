import { MeetingForm } from "@/components/pms/meeting-form";
import { PageHeader } from "@/components/pms/page-header";
import { StatusBadge } from "@/components/pms/status-badge";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function HrMeetingsPage() {
  const actor = await requireRole("hr");
  const { meetings, people, directoryById } = await loadScopedData(actor);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Review cycle"
        title="Department 1-on-1s"
        description="HR can book appraisal meetings for employees in this department only."
      />
      <MeetingForm people={people} />
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">
                {directoryById[meeting.employeeId]?.fullName} · {meeting.title}
              </h2>
              <StatusBadge value={meeting.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {new Date(meeting.scheduledAt).toLocaleString()}
            </p>
            <a className="text-sm text-teal-800 underline" href={meeting.meetUrl}>
              {meeting.meetUrl}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
