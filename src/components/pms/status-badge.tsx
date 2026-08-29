import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  approved: "bg-teal-50 text-teal-800 border-teal-200",
  completed: "bg-teal-50 text-teal-800 border-teal-200",
  pending_approval: "bg-amber-50 text-amber-800 border-amber-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  rejected: "bg-rose-50 text-rose-800 border-rose-200",
  not_started: "bg-slate-100 text-slate-700 border-slate-200",
  self_in_progress: "bg-sky-50 text-sky-800 border-sky-200",
  submitted: "bg-indigo-50 text-indigo-800 border-indigo-200",
  manager_reviewed: "bg-violet-50 text-violet-800 border-violet-200",
  finalized: "bg-teal-50 text-teal-900 border-teal-200",
  scheduled: "bg-sky-50 text-sky-800 border-sky-200",
  employee: "bg-slate-100 text-slate-700",
  manager: "bg-indigo-50 text-indigo-800",
  hr: "bg-teal-50 text-teal-800",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", styles[value] ?? "bg-slate-50")}
    >
      {value.replaceAll("_", " ")}
    </Badge>
  );
}
