-- Campus Gist follow-up: remove recursive profile lookups from RLS policies.
create or replace function public.current_user_campus_id()
returns uuid language sql stable security definer set search_path = public, pg_temp
as $$ select campus_id from public.profiles where id = (select auth.uid()) limit 1; $$;
revoke all on function public.current_user_campus_id() from public, anon;
grant execute on function public.current_user_campus_id() to authenticated;
drop policy if exists "Campus posts are readable" on public.posts;
create policy "Campus posts are readable" on public.posts for select to anon, authenticated
using (visibility = 'public' or ((select auth.uid()) is not null and campus_id = public.current_user_campus_id()));
drop policy if exists "Comments are readable" on public.comments;
create policy "Comments are readable" on public.comments for select to anon, authenticated using (
  exists (select 1 from public.posts p where p.id = comments.post_id and
    (p.visibility = 'public' or ((select auth.uid()) is not null and p.campus_id = public.current_user_campus_id()))
  )
);
drop policy if exists "Profiles are publicly readable" on public.profiles;
drop policy if exists "Authenticated users read profiles" on public.profiles;
create policy "Authenticated users read profiles" on public.profiles for select to authenticated
using (id = (select auth.uid()) or campus_id = public.current_user_campus_id());
