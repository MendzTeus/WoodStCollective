-- F-12: expose only sanitized published CMS content to anonymous users.

create table if not exists public.site_content_public (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content_public enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
revoke select on public.site_content from anon;

grant select on public.site_content_public to anon, authenticated;
grant select, insert, update, delete on public.site_content_public to authenticated;

drop policy if exists "Public can read published site content" on public.site_content_public;
create policy "Public can read published site content"
on public.site_content_public
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert published site content" on public.site_content_public;
create policy "Admins can insert published site content"
on public.site_content_public
for insert
to authenticated
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can update published site content" on public.site_content_public;
create policy "Admins can update published site content"
on public.site_content_public
for update
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can delete published site content" on public.site_content_public;
create policy "Admins can delete published site content"
on public.site_content_public
for delete
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

insert into public.site_content_public (id, data, updated_at)
select
  id,
  jsonb_set(
    coalesce(data, '{}'::jsonb),
    '{reviews}',
    coalesce((
      select jsonb_object_agg(key, value)
      from jsonb_each(coalesce(data -> 'reviews', '{}'::jsonb))
      where coalesce((value ->> 'approved')::boolean, false)
    ), '{}'::jsonb),
    true
  ),
  updated_at
from public.site_content
where id = 'main'
on conflict (id) do update
set data = excluded.data,
    updated_at = excluded.updated_at;
