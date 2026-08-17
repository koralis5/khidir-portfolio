-- Storage bucket for project screenshots uploaded via /admin.
-- Public read (so the site can display them directly), writes only via
-- the service_role key from the admin upload API route.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;
