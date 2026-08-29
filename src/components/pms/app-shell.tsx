"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Target,
  Users,
} from "lucide-react";
import { clearDemoSession } from "@/lib/actions";
import type { DirectoryUser, Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";

const NAV: Record<Role, { href: string; label: string; icon: typeof Target }[]> = {
  employee: [
    { href: "/employee", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employee/goals", label: "Goals", icon: Target },
    { href: "/employee/appraisal", label: "Self-appraisal", icon: ClipboardCheck },
    { href: "/employee/meetings", label: "1-on-1s", icon: CalendarDays },
  ],
  manager: [
    { href: "/manager", label: "Dashboard", icon: LayoutDashboard },
    { href: "/manager/directory", label: "Team directory", icon: Users },
    { href: "/manager/goals", label: "Goal approvals", icon: Target },
    { href: "/manager/reviews", label: "Manager reviews", icon: ClipboardCheck },
    { href: "/manager/meetings", label: "Review cycle", icon: CalendarDays },
  ],
  hr: [
    { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr/directory", label: "Employee directory", icon: Users },
    { href: "/hr/reviews", label: "Finalized reports", icon: ClipboardCheck },
    { href: "/hr/meetings", label: "Review cycle", icon: CalendarDays },
  ],
};

export function AppShell({
  actor,
  departmentName,
  clerkEnabled,
  children,
}: {
  actor: DirectoryUser;
  departmentName: string;
  clerkEnabled: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV[actor.role];

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-[#0b1b2b] text-slate-200 lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300">
            Northstar
          </p>
          <p className="mt-1 font-serif text-2xl text-white">Performance</p>
          <p className="mt-3 text-xs text-slate-400">
            {departmentName} · {actor.role}
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const active =
              item.href === `/${actor.role}`
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="text-sm font-medium text-white">{actor.fullName}</p>
          <p className="truncate text-xs text-slate-400">{actor.jobTitle}</p>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div>
            <p className="text-sm font-medium text-slate-900">{actor.fullName}</p>
            <p className="text-xs text-slate-500">
              {actor.jobTitle} · Isolated to {departmentName}
            </p>
          </div>
          {clerkEnabled ? (
            <SignOutButton>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                <LogOut className="size-4" />
                Sign out
              </button>
            </SignOutButton>
          ) : (
            <form action={clearDemoSession}>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                <LogOut className="size-4" />
                Exit demo
              </button>
            </form>
          )}
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
