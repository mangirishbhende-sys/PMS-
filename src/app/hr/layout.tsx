import { RoleShell } from "@/components/pms/role-shell";

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="hr">{children}</RoleShell>;
}
