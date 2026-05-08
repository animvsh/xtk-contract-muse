
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  spec jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  runs_count int not null default 0,
  created_at timestamptz not null default now()
);

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  log text not null default '',
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create table public.team_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default 'oklch(0.7 0.18 35)',
  created_at timestamptz not null default now()
);

create table public.space_members (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.team_spaces(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table public.mcp_servers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  description text,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  service_id text not null unique,
  service_name text not null,
  connected boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.agents enable row level security;
alter table public.agent_runs enable row level security;
alter table public.team_spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.mcp_servers enable row level security;
alter table public.connections enable row level security;

-- Demo app: permissive policies (no auth)
create policy "public all" on public.agents for all using (true) with check (true);
create policy "public all" on public.agent_runs for all using (true) with check (true);
create policy "public all" on public.team_spaces for all using (true) with check (true);
create policy "public all" on public.space_members for all using (true) with check (true);
create policy "public all" on public.mcp_servers for all using (true) with check (true);
create policy "public all" on public.connections for all using (true) with check (true);

-- seed team spaces
insert into public.team_spaces (name, color) values
  ('Engineering', 'oklch(0.6 0.2 250)'),
  ('Product', 'oklch(0.7 0.18 35)'),
  ('Sales', 'oklch(0.7 0.18 145)'),
  ('People & Ops', 'oklch(0.7 0.2 320)');

insert into public.mcp_servers (name, url, description) values
  ('Notion', 'https://mcp.notion.com', 'Pages, databases, and wikis'),
  ('Linear', 'https://mcp.linear.app', 'Issues and cycles'),
  ('Granola', 'https://mcp.granola.ai', 'Meeting notes and transcripts'),
  ('Sentry', 'https://mcp.sentry.io', 'Errors and performance');

insert into public.connections (service_id, service_name, connected) values
  ('notion', 'Notion', true),
  ('slack', 'Slack', true),
  ('gmail', 'Gmail', true),
  ('drive', 'Google Drive', true),
  ('linear', 'Linear', false),
  ('github', 'GitHub', false),
  ('hubspot', 'HubSpot', false),
  ('figma', 'Figma', false),
  ('zoom', 'Zoom', false),
  ('stripe', 'Stripe', false),
  ('salesforce', 'Salesforce', false),
  ('jira', 'Jira', false);
