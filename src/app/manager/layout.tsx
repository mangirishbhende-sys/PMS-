import { RoleShell } from "@/components/pms/role-shell";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="manager">{children}</RoleShell>;
}
