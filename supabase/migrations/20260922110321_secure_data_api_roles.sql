begin;

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;

revoke all on table
  public.profiles,
  public.map_editions,
  public.regions,
  public.map_edition_regions,
  public.annual_maps,
  public.photo_assets,
  public.region_entries
from anon, authenticated;

grant select on table
  public.profiles,
  public.map_editions,
  public.regions,
  public.map_edition_regions,
  public.annual_maps,
  public.photo_assets,
  public.region_entries
to authenticated;

grant update (display_name) on table public.profiles to authenticated;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy map_editions_select_authenticated
on public.map_editions
for select
to authenticated
using (true);

create policy regions_select_authenticated
on public.regions
for select
to authenticated
using (true);

create policy map_edition_regions_select_authenticated
on public.map_edition_regions
for select
to authenticated
using (true);

create policy annual_maps_select_own
on public.annual_maps
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy photo_assets_select_own
on public.photo_assets
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy region_entries_select_own
on public.region_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

commit;
