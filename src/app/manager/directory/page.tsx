import { DirectoryTable } from "@/components/pms/directory-table";
import { PageHeader } from "@/components/pms/page-header";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";

export default async function ManagerDirectoryPage() {
  const actor = await requireRole("manager");
  const { people } = await loadScopedData(actor);
  const managerNameById = Object.fromEntries(people.map((p) => [p.id, p.fullName]));

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Your department"
        description="This list is scoped to your department. You cannot open another function's employees."
      />
      <DirectoryTable people={people} managerNameById={managerNameById} />
    </div>
  );
}
