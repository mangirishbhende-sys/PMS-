-- Northstar PMS schema
-- Paste into Supabase SQL Editor (run schema.sql, then rls.sql, then seed.sql)

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('employee', 'manager', 'hr');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.goal_type as enum ('kra', 'kpi', 'okr');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.goal_status as enum (
    'draft', 'pending_approval', 'approved', 'rejected', 'completed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.review_status as enum (
    'not_started', 'self_in_progress', 'submitted', 'manager_reviewed', 'finalized'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.meeting_status as enum ('scheduled', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique,
  email text not null unique,
  full_name text not null,
  role public.user_role not null default 'employee',
  department_id uuid not null references public.departments(id) on delete restrict,
  manager_id uuid references public.users(id) on delete set null,
  job_title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  type public.goal_type not null,
  target_value numeric not null default 0,
  current_value numeric not null default 0,
  unit text not null default '%',
  progress integer not null default 0 check (progress between 0 and 100),
  status public.goal_status not null default 'pending_approval',
  manager_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.users(id) on delete cascade,
  manager_id uuid not null references public.users(id) on delete restrict,
  cycle_name text not null,
  self_rating integer check (self_rating between 1 and 5),
  self_comments text,
  manager_rating integer check (manager_rating between 1 and 5),
  manager_comments text,
  hr_notes text,
  status public.review_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.users(id) on delete cascade,
  manager_id uuid not null references public.users(id) on delete restrict,
  title text not null,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 45,
  meet_url text not null,
  status public.meeting_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_department_id_idx on public.users (department_id);
create index if not exists users_manager_id_idx on public.users (manager_id);
create index if not exists users_role_idx on public.users (role);
create index if not exists goals_employee_id_idx on public.goals (employee_id);
create index if not exists reviews_employee_id_idx on public.reviews (employee_id);
create index if not exists reviews_manager_id_idx on public.reviews (manager_id);
create index if not exists meetings_employee_id_idx on public.meetings (employee_id);
create index if not exists meetings_manager_id_idx on public.meetings (manager_id);
create index if not exists meetings_scheduled_at_idx on public.meetings (scheduled_at);

drop trigger if exists departments_set_updated_at on public.departments;
create trigger departments_set_updated_at before update on public.departments
for each row execute function public.set_updated_at();

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists goals_set_updated_at on public.goals;
create trigger goals_set_updated_at before update on public.goals
for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists meetings_set_updated_at on public.meetings;
create trigger meetings_set_updated_at before update on public.meetings
for each row execute function public.set_updated_at();
