-- Create tables
create table public.tenants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create type public.user_role as enum ('user', 'tenant_admin', 'super_admin');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  tenant_id uuid references public.tenants on delete cascade not null,
  role public.user_role default 'user'::public.user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.daily_usage (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  date date default current_date not null,
  used int default 0 not null,
  "limit" int default 25 not null,
  override_by_admin boolean default false,
  override_reason text,
  unique(user_id, date)
);

create type public.resume_status as enum ('draft', 'applied', 'interview', 'rejected', 'accepted');

create table public.tailored_resumes (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  company text not null,
  role_title text not null,
  jd_text text,
  tailored_resume text,
  cover_letter text,
  recruiter_dm text,
  status public.resume_status default 'draft'::public.resume_status not null,
  applied_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on tables
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.daily_usage enable row level security;
alter table public.tailored_resumes enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Admins can view tenant profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles admin_profile
      where admin_profile.id = auth.uid()
      and admin_profile.role in ('tenant_admin', 'super_admin')
      and (admin_profile.tenant_id = public.profiles.tenant_id or admin_profile.role = 'super_admin')
    )
  );

-- Policies for tailored_resumes
create policy "Users can view own resumes" on public.tailored_resumes
  for select using (auth.uid() = user_id);

create policy "Users can insert own resumes" on public.tailored_resumes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own resumes" on public.tailored_resumes
  for update using (auth.uid() = user_id);

create policy "Admins can view tenant resumes" on public.tailored_resumes
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('tenant_admin', 'super_admin')
      and (tenant_id = public.tailored_resumes.tenant_id or role = 'super_admin')
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_tenant_id uuid;
begin
  -- Create a new tenant for the user
  insert into public.tenants (name)
  values (new.email || '''s Tenant')
  returning id into new_tenant_id;

  -- Create profile linked to tenant
  insert into public.profiles (id, tenant_id, role)
  values (new.id, new_tenant_id, 'tenant_admin'); -- First user is admin of their tenant

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
