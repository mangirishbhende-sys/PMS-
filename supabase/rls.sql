-- Row Level Security
-- Assumes Clerk JWT is configured as the Supabase third-party Auth provider
-- so auth.jwt() ->> 'sub' equals users.clerk_id.
-- The Next.js server also enforces the same rules when using the service role.

alter table public.departments enable row level security;
alter table public.users enable row level security;
alter table public.goals enable row level security;
alter table public.reviews enable row level security;
alter table public.meetings enable row level security;

create or replace function public.current_directory_user()
returns public.users
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.users
  where clerk_id = coalesce(auth.jwt() ->> 'sub', '')
  limit 1;
$$;

create or replace function public.current_department_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select department_id from public.current_directory_user();
$$;

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.current_directory_user();
$$;

create or replace function public.same_department(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = target_user_id
      and u.department_id = public.current_department_id()
  );
$$;

-- Departments: visible only if it is your department
drop policy if exists departments_select_own on public.departments;
create policy departments_select_own
on public.departments
for select
to authenticated
using (id = public.current_department_id());

-- Users
drop policy if exists users_select_self on public.users;
create policy users_select_self
on public.users
for select
to authenticated
using (id = (select id from public.current_directory_user()));

drop policy if exists users_select_department_privileged on public.users;
create policy users_select_department_privileged
on public.users
for select
to authenticated
using (
  public.current_role() in ('manager', 'hr')
  and department_id = public.current_department_id()
);

drop policy if exists users_update_self on public.users;
create policy users_update_self
on public.users
for update
to authenticated
using (id = (select id from public.current_directory_user()))
with check (id = (select id from public.current_directory_user()));

drop policy if exists users_update_hr_department on public.users;
create policy users_update_hr_department
on public.users
for update
to authenticated
using (
  public.current_role() = 'hr'
  and department_id = public.current_department_id()
)
with check (
  public.current_role() = 'hr'
  and department_id = public.current_department_id()
);

-- Goals
drop policy if exists goals_select_self on public.goals;
create policy goals_select_self
on public.goals
for select
to authenticated
using (employee_id = (select id from public.current_directory_user()));

drop policy if exists goals_select_department_privileged on public.goals;
create policy goals_select_department_privileged
on public.goals
for select
to authenticated
using (
  public.current_role() in ('manager', 'hr')
  and public.same_department(employee_id)
);

drop policy if exists goals_insert_self on public.goals;
create policy goals_insert_self
on public.goals
for insert
to authenticated
with check (employee_id = (select id from public.current_directory_user()));

drop policy if exists goals_update_self_draft on public.goals;
create policy goals_update_self_draft
on public.goals
for update
to authenticated
using (
  employee_id = (select id from public.current_directory_user())
  and status in ('draft', 'pending_approval', 'rejected')
)
with check (employee_id = (select id from public.current_directory_user()));

drop policy if exists goals_update_manager_department on public.goals;
create policy goals_update_manager_department
on public.goals
for update
to authenticated
using (
  public.current_role() in ('manager', 'hr')
  and public.same_department(employee_id)
)
with check (
  public.current_role() in ('manager', 'hr')
  and public.same_department(employee_id)
);

-- Reviews
drop policy if exists reviews_select_self on public.reviews;
create policy reviews_select_self
on public.reviews
for select
to authenticated
using (employee_id = (select id from public.current_directory_user()));

drop policy if exists reviews_select_department_privileged on public.reviews;
create policy reviews_select_department_privileged
on public.reviews
for select
to authenticated
using (
  public.current_role() in ('manager', 'hr')
  and public.same_department(employee_id)
);

drop policy if exists reviews_update_self on public.reviews;
create policy reviews_update_self
on public.reviews
for update
to authenticated
using (
  employee_id = (select id from public.current_directory_user())
  and status in ('not_started', 'self_in_progress')
)
with check (employee_id = (select id from public.current_directory_user()));

drop policy if exists reviews_update_manager on public.reviews;
create policy reviews_update_manager
on public.reviews
for update
to authenticated
using (
  public.current_role() = 'manager'
  and public.same_department(employee_id)
  and status in ('submitted', 'manager_reviewed')
)
with check (
  public.current_role() = 'manager'
  and public.same_department(employee_id)
);

drop policy if exists reviews_update_hr on public.reviews;
create policy reviews_update_hr
on public.reviews
for update
to authenticated
using (
  public.current_role() = 'hr'
  and public.same_department(employee_id)
)
with check (
  public.current_role() = 'hr'
  and public.same_department(employee_id)
);

-- Meetings
drop policy if exists meetings_select_participant on public.meetings;
create policy meetings_select_participant
on public.meetings
for select
to authenticated
using (
  employee_id = (select id from public.current_directory_user())
  or manager_id = (select id from public.current_directory_user())
);

drop policy if exists meetings_select_department_privileged on public.meetings;
create policy meetings_select_department_privileged
on public.meetings
for select
to authenticated
using (
  public.current_role() in ('manager', 'hr')
  and public.same_department(employee_id)
);

drop policy if exists meetings_insert_manager on public.meetings;
create policy meetings_insert_manager
on public.meetings
for insert
to authenticated
with check (
  (
    public.current_role() in ('manager', 'hr')
    and public.same_department(employee_id)
  )
  or employee_id = (select id from public.current_directory_user())
);

drop policy if exists meetings_update_participant on public.meetings;
create policy meetings_update_participant
on public.meetings
for update
to authenticated
using (
  employee_id = (select id from public.current_directory_user())
  or manager_id = (select id from public.current_directory_user())
  or (
    public.current_role() in ('manager', 'hr')
    and public.same_department(employee_id)
  )
)
with check (
  public.same_department(employee_id)
);
