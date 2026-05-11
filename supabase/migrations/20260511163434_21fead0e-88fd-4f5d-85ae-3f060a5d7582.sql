
insert into storage.buckets (id, name, public, file_size_limit)
values ('user-uploads', 'user-uploads', false, 52428800)
on conflict (id) do nothing;

create policy "users read own uploads"
on storage.objects for select
to authenticated
using (bucket_id = 'user-uploads' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users insert own uploads"
on storage.objects for insert
to authenticated
with check (bucket_id = 'user-uploads' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users delete own uploads"
on storage.objects for delete
to authenticated
using (bucket_id = 'user-uploads' and auth.uid()::text = (storage.foldername(name))[1]);
