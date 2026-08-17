-- Portfolio chat: tickets + chat log tables.
-- All access happens server-side via the service_role key (API routes only),
-- so RLS is enabled with no public policies — nothing is reachable from the
-- browser/anon key by design.

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  ip text,
  agent text not null,
  user_message text not null,
  assistant_message text not null,
  needs_followup boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists chats_ip_created_at_idx on chats (ip, created_at);
create index if not exists chats_session_id_idx on chats (session_id);

alter table chats enable row level security;

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  agent text not null,
  question text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table tickets enable row level security;
