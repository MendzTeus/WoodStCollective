-- Harden the browser-facing content table and public image bucket.
--
-- This assumes admin users are identified with app_metadata.role = 'admin'.
-- In Supabase Auth, app_metadata is server-controlled; do not use user_metadata
-- for authorization because users can edit it themselves.

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
drop policy if exists "Authenticated can manage site content" on public.site_content;
drop policy if exists "Admins can insert site content" on public.site_content;
drop policy if exists "Admins can update site content" on public.site_content;
drop policy if exists "Admins can delete site content" on public.site_content;

create policy "Public can read site content"
on public.site_content
for select
to anon, authenticated
using (id = 'main');

create policy "Admins can insert site content"
on public.site_content
for insert
to authenticated
with check (
  id = 'main'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

create policy "Admins can update site content"
on public.site_content
for update
to authenticated
using (
  id = 'main'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  id = 'main'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

create policy "Admins can delete site content"
on public.site_content
for delete
to authenticated
using (
  id = 'main'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Public can read site images" on storage.objects;
drop policy if exists "Admins can upload site images" on storage.objects;

create policy "Public can read site images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-images');
drop policy if exists "Admins can update site images" on storage.objects;
drop policy if exists "Admins can delete site images" on storage.objects;
drop policy if exists "Public can list site images" on storage.objects;

create policy "Admins can upload site images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-images'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

create policy "Admins can update site images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-images'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  bucket_id = 'site-images'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

create policy "Admins can delete site images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-images'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
