import { DirectoryTable } from "@/components/pms/directory-table";
import { PageHeader } from "@/components/pms/page-header";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function HrDirectoryPage() {
  const actor = await requireRole("hr");
  const { people, department } = await loadScopedData(actor);
  const managerNameById = Object.fromEntries(people.map((p) => [p.id, p.fullName]));

  return (
    <div>
      <PageHeader
        eyebrow="Employee directory"
        title={`${department?.name} directory`}
        description="HR sees every role in their own department and nobody outside it."
      />
      <DirectoryTable people={people} managerNameById={managerNameById} />
    </div>
  );
}
