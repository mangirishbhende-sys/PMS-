import Link from "next/link";
import { redirect } from "next/navigation";
import { startDemoSession } from "@/lib/actions";
import { isClerkConfigured } from "@/lib/config";
import { DEMO_PRESETS, USERS } from "@/lib/seed-data";
import { getActor } from "@/lib/session";
import { ROLE_HOME } from "@/lib/types";

export default async function HomePage() {
  const actor = await getActor();
  if (actor) redirect(ROLE_HOME[actor.role]);
  const clerkReady = isClerkConfigured();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07131f] text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-indigo-600/20 blur-3xl" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-300">
            Northstar
          </p>
          <p className="font-serif text-xl">Performance Management</p>
        </div>
        {clerkReady ? (
          <Link
            href="/sign-in"
            className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Sign in with Clerk
          </Link>
        ) : null}
      </header>
      <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-teal-200/80">
            KRAs · KPIs · OKRs · Appraisals
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.1] tracking-tight md:text-6xl">
            Fair reviews. Department walls. No payroll noise.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Employees set goals. Managers approve and rate. HR finalizes only inside their
            own function. Finance never sees IT. Built for a clean executive walkthrough.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-slate-300">
            <li>Role-based homes for Employee, Manager, and HR</li>
            <li>1-on-1 scheduler with mock Google Meet links</li>
            <li>18 demo colleagues across Finance, IT, Sales, and Marketing</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="font-serif text-2xl">Open a demo workspace</h2>
          <p className="mt-2 text-sm text-slate-300">
            No API keys needed for this walkthrough. Isolation still applies: IT managers
            cannot open Finance people.
          </p>
          <div className="mt-6 grid gap-3">
            {DEMO_PRESETS.map((preset) => (
              <form key={preset.userId} action={startDemoSession}>
                <input type="hidden" name="userId" value={preset.userId} />
                <button
                  type="submit"
                  className="h-auto w-full justify-start whitespace-normal rounded-lg bg-white px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-teal-50"
                >
                  {preset.label}
                </button>
              </form>
            ))}
          </div>
          <form action={startDemoSession} className="mt-6 space-y-3 border-t border-white/10 pt-6">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Or pick anyone in the directory
            </label>
            <select
              name="userId"
              className="h-10 w-full rounded-lg border border-white/15 bg-[#0b1b2b] px-3 text-sm"
            >
              {USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} · {user.role} · {user.email}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Enter selected workspace
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
