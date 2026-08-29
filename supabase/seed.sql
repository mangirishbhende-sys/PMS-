-- Demo directory: 18 people across Finance, IT, Sales, Marketing.
-- clerk_id is left null. On first Clerk login, the app links by email.

insert into public.departments (id, name, code) values
  ('00000000-0000-4000-8000-000000000101', 'Finance', 'FIN'),
  ('00000000-0000-4000-8000-000000000102', 'IT', 'IT'),
  ('00000000-0000-4000-8000-000000000103', 'Sales', 'SAL'),
  ('00000000-0000-4000-8000-000000000104', 'Marketing', 'MKT')
on conflict (id) do update set name = excluded.name, code = excluded.code;

insert into public.users (id, clerk_id, email, full_name, role, department_id, manager_id, job_title) values
  ('00000000-0000-4000-8000-000000000201', null, 'priya.shah@northstar.demo', 'Priya Shah', 'hr', '00000000-0000-4000-8000-000000000101', null, 'HR Business Partner, Finance'),
  ('00000000-0000-4000-8000-000000000202', null, 'david.chen@northstar.demo', 'David Chen', 'manager', '00000000-0000-4000-8000-000000000101', null, 'Finance Manager'),
  ('00000000-0000-4000-8000-000000000203', null, 'aisha.rahman@northstar.demo', 'Aisha Rahman', 'employee', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000202', 'Financial Analyst'),
  ('00000000-0000-4000-8000-000000000204', null, 'marcus.webb@northstar.demo', 'Marcus Webb', 'employee', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000202', 'Senior Accountant'),
  ('00000000-0000-4000-8000-000000000205', null, 'elena.rossi@northstar.demo', 'Elena Rossi', 'employee', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000202', 'FP&A Associate'),
  ('00000000-0000-4000-8000-000000000206', null, 'jordan.blake@northstar.demo', 'Jordan Blake', 'hr', '00000000-0000-4000-8000-000000000102', null, 'HR Business Partner, IT'),
  ('00000000-0000-4000-8000-000000000207', null, 'sofia.patel@northstar.demo', 'Sofia Patel', 'manager', '00000000-0000-4000-8000-000000000102', null, 'Engineering Manager'),
  ('00000000-0000-4000-8000-000000000208', null, 'liam.oconnor@northstar.demo', 'Liam O''Connor', 'employee', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000207', 'Platform Engineer'),
  ('00000000-0000-4000-8000-000000000209', null, 'maya.chen@northstar.demo', 'Maya Chen', 'employee', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000207', 'Product Engineer'),
  ('00000000-0000-4000-8000-000000000210', null, 'noah.kim@northstar.demo', 'Noah Kim', 'employee', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000207', 'Security Engineer'),
  ('00000000-0000-4000-8000-000000000211', null, 'harper.diaz@northstar.demo', 'Harper Diaz', 'manager', '00000000-0000-4000-8000-000000000103', null, 'Sales Manager'),
  ('00000000-0000-4000-8000-000000000212', null, 'sam.okonkwo@northstar.demo', 'Sam Okonkwo', 'employee', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000211', 'Account Executive'),
  ('00000000-0000-4000-8000-000000000213', null, 'riley.park@northstar.demo', 'Riley Park', 'employee', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000211', 'Sales Development Rep'),
  ('00000000-0000-4000-8000-000000000214', null, 'nina.volkov@northstar.demo', 'Nina Volkov', 'employee', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000211', 'Customer Success Manager'),
  ('00000000-0000-4000-8000-000000000215', null, 'ava.thompson@northstar.demo', 'Ava Thompson', 'hr', '00000000-0000-4000-8000-000000000104', null, 'HR Business Partner, Marketing'),
  ('00000000-0000-4000-8000-000000000216', null, 'chris.nguyen@northstar.demo', 'Chris Nguyen', 'manager', '00000000-0000-4000-8000-000000000104', null, 'Marketing Manager'),
  ('00000000-0000-4000-8000-000000000217', null, 'jade.morales@northstar.demo', 'Jade Morales', 'employee', '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000216', 'Content Strategist'),
  ('00000000-0000-4000-8000-000000000218', null, 'ben.foster@northstar.demo', 'Ben Foster', 'employee', '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000216', 'Demand Generation Specialist')
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  department_id = excluded.department_id,
  manager_id = excluded.manager_id,
  job_title = excluded.job_title;

insert into public.goals (id, employee_id, title, description, type, target_value, current_value, unit, progress, status, manager_comment) values
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000203', 'Close books by working day 5', 'Complete monthly close with zero material reconciling items.', 'kra', 5, 4, 'days', 80, 'approved', null),
  ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000203', 'Forecast accuracy', 'Keep rolling 3-month revenue forecast within 5% of actuals.', 'kpi', 95, 91, '%', 96, 'approved', null),
  ('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000203', 'Automate variance commentary', 'Ship a self-serve variance pack for department heads.', 'okr', 100, 40, '%', 40, 'pending_approval', null),
  ('00000000-0000-4000-8000-000000000304', '00000000-0000-4000-8000-000000000204', 'On-time statutory filings', 'File all local returns before statutory deadlines.', 'kra', 100, 100, '%', 100, 'completed', null),
  ('00000000-0000-4000-8000-000000000305', '00000000-0000-4000-8000-000000000204', 'Reduce close journal rework', 'Cut post-close correcting journals by 30%.', 'kpi', 30, 18, '%', 60, 'approved', null),
  ('00000000-0000-4000-8000-000000000306', '00000000-0000-4000-8000-000000000205', 'Driver-based forecast model', 'Replace spreadsheet forecast with driver-based model.', 'okr', 100, 72, '%', 72, 'approved', null),
  ('00000000-0000-4000-8000-000000000307', '00000000-0000-4000-8000-000000000205', 'Budget cycle cycle-time', 'Complete FY27 budget collection in 4 weeks.', 'kpi', 4, 3, 'weeks', 75, 'approved', null),
  ('00000000-0000-4000-8000-000000000308', '00000000-0000-4000-8000-000000000208', 'Platform uptime', 'Maintain 99.9% availability for core APIs.', 'kpi', 99.9, 99.95, '%', 100, 'approved', null),
  ('00000000-0000-4000-8000-000000000309', '00000000-0000-4000-8000-000000000208', 'CI pipeline duration', 'Bring p95 CI runtime under 12 minutes.', 'okr', 12, 14, 'min', 100, 'approved', null),
  ('00000000-0000-4000-8000-000000000310', '00000000-0000-4000-8000-000000000209', 'Checkout conversion experiments', 'Ship 4 A/B tests on checkout with documented learnings.', 'okr', 4, 2, 'tests', 50, 'approved', null),
  ('00000000-0000-4000-8000-000000000311', '00000000-0000-4000-8000-000000000209', 'Bug escape rate', 'Keep Sev-1 production escapes at 0 per quarter.', 'kpi', 0, 0, 'incidents', 100, 'approved', null),
  ('00000000-0000-4000-8000-000000000312', '00000000-0000-4000-8000-000000000210', 'Endpoint MFA coverage', 'Reach 100% MFA on privileged endpoints.', 'kra', 100, 88, '%', 88, 'approved', null),
  ('00000000-0000-4000-8000-000000000313', '00000000-0000-4000-8000-000000000210', 'Vulnerability SLA', 'Remediate critical CVEs within 7 days.', 'kpi', 7, 5, 'days', 71, 'pending_approval', null),
  ('00000000-0000-4000-8000-000000000314', '00000000-0000-4000-8000-000000000212', 'New ARR', 'Close $480k in new ARR this half.', 'kra', 480, 310, 'k USD', 65, 'approved', null),
  ('00000000-0000-4000-8000-000000000315', '00000000-0000-4000-8000-000000000212', 'Win rate', 'Hold qualified win rate at or above 32%.', 'kpi', 32, 29, '%', 91, 'approved', null),
  ('00000000-0000-4000-8000-000000000316', '00000000-0000-4000-8000-000000000213', 'Qualified pipeline', 'Source 90 SQLs per quarter.', 'kpi', 90, 64, 'SQLs', 71, 'approved', null),
  ('00000000-0000-4000-8000-000000000317', '00000000-0000-4000-8000-000000000214', 'Net revenue retention', 'Deliver 112% NRR on the named book.', 'kra', 112, 109, '%', 97, 'approved', null),
  ('00000000-0000-4000-8000-000000000318', '00000000-0000-4000-8000-000000000217', 'Organic sessions', 'Grow organic sessions 25% vs prior half.', 'kpi', 25, 17, '%', 68, 'approved', null),
  ('00000000-0000-4000-8000-000000000319', '00000000-0000-4000-8000-000000000217', 'Flagship campaign launch', 'Launch the Q3 brand campaign on time with full asset kit.', 'okr', 100, 100, '%', 100, 'completed', null),
  ('00000000-0000-4000-8000-000000000320', '00000000-0000-4000-8000-000000000218', 'MQL to SQL conversion', 'Improve MQL→SQL conversion to 22%.', 'kpi', 22, 18, '%', 82, 'approved', null),
  ('00000000-0000-4000-8000-000000000321', '00000000-0000-4000-8000-000000000218', 'Paid CAC efficiency', 'Hold blended CAC under $420.', 'kra', 420, 455, 'USD', 100, 'rejected', 'Recast the mix before approval — current CAC is moving the wrong way.')
on conflict (id) do nothing;

insert into public.reviews (id, employee_id, manager_id, cycle_name, self_rating, self_comments, manager_rating, manager_comments, hr_notes, status) values
  ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000202', 'H2 2026 Mid-Year', 4, 'Close is consistently on WD5. Forecast still has two noisy product lines.', null, null, null, 'self_in_progress'),
  ('00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000202', 'H2 2026 Mid-Year', 4, 'Filings were clean. Rework on journals is down but not at the 30% target yet.', null, null, null, 'submitted'),
  ('00000000-0000-4000-8000-000000000403', '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000202', 'H2 2026 Mid-Year', 5, 'Driver model is in UAT with two departments live.', 4, 'Strong delivery. Stretch: socialize the model with Sales before year-end.', null, 'manager_reviewed'),
  ('00000000-0000-4000-8000-000000000404', '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000207', 'H2 2026 Mid-Year', 4, 'Uptime held. CI is still 2 minutes over the OKR.', null, null, null, 'submitted'),
  ('00000000-0000-4000-8000-000000000405', '00000000-0000-4000-8000-000000000209', '00000000-0000-4000-8000-000000000207', 'H2 2026 Mid-Year', 5, 'Two experiments shipped; zero Sev-1s.', 5, 'Excellent product sense and operational discipline.', 'HR: Ready for senior engineer calibration next cycle.', 'finalized'),
  ('00000000-0000-4000-8000-000000000406', '00000000-0000-4000-8000-000000000210', '00000000-0000-4000-8000-000000000207', 'H2 2026 Mid-Year', null, null, null, null, null, 'not_started'),
  ('00000000-0000-4000-8000-000000000407', '00000000-0000-4000-8000-000000000212', '00000000-0000-4000-8000-000000000211', 'H2 2026 Mid-Year', 3, 'Pipeline is healthy; two enterprise deals slipped a quarter.', null, null, null, 'submitted'),
  ('00000000-0000-4000-8000-000000000408', '00000000-0000-4000-8000-000000000213', '00000000-0000-4000-8000-000000000211', 'H2 2026 Mid-Year', 3, 'SQL volume is behind; quality of handoff has improved.', null, null, null, 'self_in_progress'),
  ('00000000-0000-4000-8000-000000000409', '00000000-0000-4000-8000-000000000217', '00000000-0000-4000-8000-000000000216', 'H2 2026 Mid-Year', 4, 'Campaign launched on time. Organic growth is tracking to plan.', 4, 'Reliable operator. Next: own the measurement dashboard.', null, 'manager_reviewed'),
  ('00000000-0000-4000-8000-000000000410', '00000000-0000-4000-8000-000000000218', '00000000-0000-4000-8000-000000000216', 'H2 2026 Mid-Year', null, null, null, null, null, 'not_started')
on conflict (id) do nothing;

insert into public.meetings (id, employee_id, manager_id, title, scheduled_at, duration_minutes, meet_url, status, notes) values
  ('00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000202', 'Mid-year appraisal', '2026-09-04T14:00:00Z', 45, 'https://meet.google.com/fin-aisha-k3m', 'scheduled', 'Mid-year 1-on-1'),
  ('00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000207', 'Mid-year appraisal', '2026-09-05T15:30:00Z', 45, 'https://meet.google.com/it-liam-p9q', 'scheduled', 'Mid-year 1-on-1'),
  ('00000000-0000-4000-8000-000000000503', '00000000-0000-4000-8000-000000000212', '00000000-0000-4000-8000-000000000211', 'Mid-year appraisal', '2026-09-08T16:00:00Z', 45, 'https://meet.google.com/sal-sam-w2n', 'scheduled', 'Mid-year 1-on-1')
on conflict (id) do nothing;
