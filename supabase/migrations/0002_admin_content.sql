-- Content tables backing the public site + admin editor.
-- Same access model as 0001: RLS enabled, no public policies, everything
-- goes through the server using the service_role key.

create table if not exists profile (
  id text primary key default 'main',
  name text not null,
  preferred_name text not null,
  tagline text not null,
  school text not null,
  looking_for text not null,
  email text not null,
  github text not null,
  linkedin text not null,
  bio text[] not null default '{}',
  strengths text[] not null default '{}',
  updated_at timestamptz not null default now()
);
alter table profile enable row level security;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text not null,
  status text not null default 'completed', -- shipped | in-progress | completed
  status_label text not null,
  description text not null,
  story text,
  tech text[] not null default '{}',
  highlights text[] not null default '{}',
  images jsonb not null default '[]', -- [{src, alt}]
  is_public boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table projects enable row level security;

create table if not exists knowledge (
  id uuid primary key default gen_random_uuid(),
  agent_scope text not null, -- job | me | projects | shared
  title text not null,
  content text not null,
  status text not null default 'live', -- live | pending
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (agent_scope, title)
);
alter table knowledge enable row level security;

create table if not exists style_guide (
  agent_scope text primary key, -- job | me
  content text not null,
  updated_at timestamptz not null default now()
);
alter table style_guide enable row level security;
