import { RoleShell } from "@/components/pms/role-shell";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="employee">{children}</RoleShell>;
}
