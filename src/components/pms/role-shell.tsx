import { AppShell } from "@/components/pms/app-shell";
import { isClerkConfigured } from "@/lib/config";
import { requireRole } from "@/lib/session";
import { loadScopedData } from "@/lib/workspace";
import type { Role } from "@/lib/types";

export async function RoleShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const actor = await requireRole(role);
  const { department } = await loadScopedData(actor);
  return (
    <AppShell
      actor={actor}
      departmentName={department?.name ?? "Department"}
      clerkEnabled={isClerkConfigured()}
    >
      {children}
    </AppShell>
  );
}
