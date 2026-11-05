-- Campus Gist MVP: profile provisioning, secure role helper and reviewed campus tips.
-- Additive migration: preserves the initial schema and existing records.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, campus_id)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    (
      select c.id
      from public.campuses c
      where c.is_active = true
        and c.id::text = new.raw_user_meta_data ->> 'campus_id'
      limit 1
    )
  )
  on conflict (id) do update
    set full_name = coalesce(public.profiles.full_name, excluded.full_name),
        campus_id = coalesce(public.profiles.campus_id, excluded.campus_id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;

create or replace function public.current_user_campus_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $
  select campus_id from public.profiles where id = (select auth.uid()) limit 1;
$;
revoke all on function public.current_user_campus_id() from public, anon;
grant execute on function public.current_user_campus_id() to authenticated;

create or replace function public.has_campus_role(target_campus_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.campus_roles cr
    where cr.user_id = (select auth.uid())
      and cr.role = any(allowed_roles)
      and (cr.campus_id is null or cr.campus_id = target_campus_id)
  );
$$;
revoke all on function public.has_campus_role(uuid, text[]) from public, anon;
grant execute on function public.has_campus_role(uuid, text[]) to authenticated;

create table if not exists public.news_tips (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references public.campuses(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 5 and 140),
  body text not null check (char_length(body) between 10 and 2000),
  status text not null default 'pending_review' check (status in ('pending_review','reviewing','accepted','rejected')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists news_tips_queue_idx on public.news_tips(campus_id, status, created_at desc);
alter table public.news_tips enable row level security;
grant insert, select on public.news_tips to authenticated;
grant select, update on public.news_posts to authenticated;
grant insert, update, delete on public.news_posts to authenticated;

drop policy if exists "Users submit own news tips" on public.news_tips;
create policy "Users submit own news tips" on public.news_tips
  for insert to authenticated
  with check (
    (select auth.uid()) = submitted_by
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.campus_id = news_tips.campus_id)
  );
drop policy if exists "Users read own news tips" on public.news_tips;
create policy "Users read own news tips" on public.news_tips
  for select to authenticated using ((select auth.uid()) = submitted_by);
drop policy if exists "Editors read campus news tips" on public.news_tips;
create policy "Editors read campus news tips" on public.news_tips
  for select to authenticated using (public.has_campus_role(campus_id, array['super_admin','campus_admin','news_editor','moderator']));
drop policy if exists "Editors review campus news tips" on public.news_tips;
create policy "Editors review campus news tips" on public.news_tips
  for update to authenticated
  using (public.has_campus_role(campus_id, array['super_admin','campus_admin','news_editor','moderator']))
  with check (public.has_campus_role(campus_id, array['super_admin','campus_admin','news_editor','moderator']));

drop policy if exists "Campus posts are readable" on public.posts;
create policy "Campus posts are readable" on public.posts
  for select to anon, authenticated
  using (
    visibility = 'public'
    or (
      (select auth.uid()) is not null
      and campus_id = public.current_user_campus_id()
    )
  );

drop policy if exists "Comments are readable" on public.comments;
create policy "Comments are readable" on public.comments
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = comments.post_id
        and (p.visibility = 'public' or (
          (select auth.uid()) is not null
          and p.campus_id = (select pr.campus_id from public.profiles pr where pr.id = (select auth.uid()))
        ))
    )
  );

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Authenticated users read profiles" on public.profiles
  for select to authenticated using (
    id = (select auth.uid())
    or campus_id = (select p.campus_id from public.profiles p where p.id = (select auth.uid()))
  );

drop policy if exists "Editors manage campus news" on public.news_posts;
create policy "Editors manage campus news" on public.news_posts
  for all to authenticated
  using (public.has_campus_role(campus_id, array['super_admin','campus_admin','news_editor']))
  with check (public.has_campus_role(campus_id, array['super_admin','campus_admin','news_editor']));
