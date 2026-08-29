# Northstar PMS

Performance management for KRAs, KPIs, OKRs, goal setting, 1-on-1 review cycles, and a 1–5 rating scale.

Out of scope (not built): payroll, 360 feedback, bell-curve normalization.

## What you can open right now

The app runs a full **demo directory** (18 people across Finance, IT, Sales, and Marketing) without Clerk or Supabase keys. Department isolation still applies: an IT manager never sees Finance people.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and choose:

- Employee · Aisha Rahman (Finance)
- Manager · Sofia Patel (IT)
- HR · Priya Shah (Finance)

## Phase 1 commands (project already created in this repo)

If you were starting from an empty folder:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --yes
npm install @clerk/nextjs @supabase/supabase-js recharts resend lucide-react class-variance-authority clsx tailwind-merge date-fns
npx shadcn@latest init --yes --defaults --force
npx shadcn@latest add card table badge tabs select textarea input label dialog avatar separator progress sonner dropdown-menu sheet --yes
```

### GitHub + Vercel

```bash
git add .
git commit -m "Initialize Northstar PMS"
git push -u origin HEAD
```

Then in [Vercel](https://vercel.com/new): Import the `PMS-` GitHub repo, framework **Next.js**, and add the environment variables from `.env.example` when you have them. You can deploy the empty-looking shell first; demo mode works without keys.

## Phase 2: Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → run in order:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/seed.sql`
3. Project Settings → API: copy URL, anon key, and **service role** key into `.env.local`.

Row Level Security keeps each manager/HR inside their department. The Next.js server also enforces the same rule, even when it uses the service role.

To connect Clerk JWTs later: Clerk Dashboard → JWT templates → Supabase, then add Clerk as a third-party Auth provider in Supabase. `auth.jwt() ->> 'sub'` must equal `users.clerk_id`.

## Phase 3: Clerk

1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Copy keys into `.env.local` (see `.env.example`).
3. Create users whose **emails match** the seed directory (for example `sofia.patel@northstar.demo`). First login links `clerk_id` automatically.
4. Webhook (optional): `https://YOUR_DOMAIN/api/webhooks/clerk` for `user.created` and `user.updated`. Set `CLERK_WEBHOOK_SECRET`.
5. Session JWT custom claim (optional, for proxy role redirects): `metadata.role` from public metadata. The webhook writes `publicMetadata.role`.

`.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Proxy (`src/proxy.ts`) requires login on `/employee`, `/manager`, and `/hr`, then sends people to the home for their role.

## Phase 4–6 (already in the app)

| Role | Home | Also |
| --- | --- | --- |
| Employee | `/employee` | goals, self-appraisal, 1-on-1s |
| Manager | `/manager` | directory, approvals, reviews, scheduler |
| HR | `/hr` | directory, finalized reports, scheduler |

Meetings mint a mock Google Meet URL (`https://meet.google.com/it-abc-xyz`).

Finalizing a review (HR) calls Resend. Without `RESEND_API_KEY` the send is skipped and logged.

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Northstar PMS <onboarding@resend.dev>
```

Manual test of the email route:

```bash
curl -X POST http://localhost:3000/api/emails/review-finalized \
  -H "Content-Type: application/json" \
  -d '{"to":"maya.chen@northstar.demo","employeeName":"Maya Chen","cycleName":"H2 2026 Mid-Year","managerRating":5}'
```

(Requires an HR demo/Clerk session cookie.)

## Rating scale

1 Needs improvement · 2 Developing · 3 Meets expectations · 4 Exceeds expectations · 5 Outstanding
