import { StatusBadge } from "@/components/pms/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DirectoryUser } from "@/lib/types";

export function DirectoryTable({
  people,
  managerNameById,
}: {
  people: DirectoryUser[];
  managerNameById: Record<string, string>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell className="font-medium">{person.fullName}</TableCell>
              <TableCell>
                <StatusBadge value={person.role} />
              </TableCell>
              <TableCell>{person.jobTitle}</TableCell>
              <TableCell>
                {person.managerId ? managerNameById[person.managerId] ?? "—" : "—"}
              </TableCell>
              <TableCell className="text-slate-500">{person.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
