
insert into storage.buckets (id, name, public)
values ('souffle-sounds', 'souffle-sounds', true)
on conflict (id) do update set public = true;

create policy "Public can read souffle sounds"
on storage.objects for select
using (bucket_id = 'souffle-sounds');
