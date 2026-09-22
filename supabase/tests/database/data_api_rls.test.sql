begin;

create extension if not exists pgtap with schema extensions;

select plan(28);

select is(
  (
    select count(*)
    from pg_class
    join pg_namespace on pg_namespace.oid = pg_class.relnamespace
    where pg_namespace.nspname = 'public'
      and pg_class.relname in (
        'profiles',
        'map_editions',
        'regions',
        'map_edition_regions',
        'annual_maps',
        'photo_assets',
        'region_entries'
      )
      and pg_class.relrowsecurity
  ),
  7::bigint,
  'RLS is enabled on every Data API table'
);

select is(
  (
    select count(*)
    from information_schema.role_table_grants
    where grantee = 'anon'
      and table_schema = 'public'
      and table_name in (
        'profiles',
        'map_editions',
        'regions',
        'map_edition_regions',
        'annual_maps',
        'photo_assets',
        'region_entries'
      )
  ),
  0::bigint,
  'anon has no application table grants'
);

select is(
  (
    select count(*)
    from information_schema.role_table_grants
    where grantee = 'authenticated'
      and table_schema = 'public'
      and table_name in (
        'profiles',
        'map_editions',
        'regions',
        'map_edition_regions',
        'annual_maps',
        'photo_assets',
        'region_entries'
      )
      and privilege_type = 'SELECT'
  ),
  7::bigint,
  'authenticated has SELECT on all application tables'
);

select is(
  (
    select count(*)
    from information_schema.role_table_grants
    where grantee = 'authenticated'
      and table_schema = 'public'
      and table_name in (
        'profiles',
        'map_editions',
        'regions',
        'map_edition_regions',
        'annual_maps',
        'photo_assets',
        'region_entries'
      )
      and privilege_type in ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER')
  ),
  0::bigint,
  'authenticated has no table-wide write grants'
);

select ok(
  has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE'),
  'authenticated may update the profile display name'
);

select ok(
  not has_column_privilege('authenticated', 'public.profiles', 'id', 'UPDATE'),
  'authenticated cannot update profile ownership'
);

select is(
  (select count(*) from pg_policies where schemaname = 'public'),
  8::bigint,
  'all expected RLS policies exist'
);

select ok(
  (
    select qual is not null
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_update_own'
      and cmd = 'UPDATE'
  ),
  'profile UPDATE policy has a USING expression'
);

select ok(
  (
    select with_check is not null
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_update_own'
      and cmd = 'UPDATE'
  ),
  'profile UPDATE policy has a WITH CHECK expression'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename in ('map_editions', 'regions', 'map_edition_regions')
      and cmd = 'SELECT'
      and roles = array['authenticated'::name]
  ),
  3::bigint,
  'reference tables expose authenticated SELECT policies only'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename in ('annual_maps', 'photo_assets', 'region_entries')
      and cmd = 'SELECT'
      and roles = array['authenticated'::name]
  ),
  3::bigint,
  'owned tables expose authenticated SELECT policies only'
);

insert into auth.users (id, email)
values
  ('10000000-0000-4000-8000-000000000001', 'rls-user-a@example.com'),
  ('10000000-0000-4000-8000-000000000002', 'rls-user-b@example.com');

insert into public.profiles (id, display_name)
values
  ('10000000-0000-4000-8000-000000000001', 'User A'),
  ('10000000-0000-4000-8000-000000000002', 'User B');

insert into public.annual_maps (id, user_id, map_edition_id, year, country_code)
select
  values_to_insert.id,
  values_to_insert.user_id,
  map_editions.id,
  2026,
  'KR'
from (
  values
    ('20000000-0000-4000-8000-000000000001'::uuid, '10000000-0000-4000-8000-000000000001'::uuid),
    ('20000000-0000-4000-8000-000000000002'::uuid, '10000000-0000-4000-8000-000000000002'::uuid)
) as values_to_insert (id, user_id)
cross join public.map_editions
where map_editions.country_code = 'KR';

insert into public.photo_assets (id, owner_id, bucket_id, object_path, status)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'travel-photos',
    '10000000-0000-4000-8000-000000000001/a.webp',
    'ready'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'travel-photos',
    '10000000-0000-4000-8000-000000000002/b.webp',
    'ready'
  );

insert into public.region_entries (
  id,
  user_id,
  annual_map_id,
  region_id,
  photo_asset_id
)
select
  values_to_insert.id,
  values_to_insert.user_id,
  values_to_insert.annual_map_id,
  regions.id,
  values_to_insert.photo_asset_id
from (
  values
    (
      '40000000-0000-4000-8000-000000000001'::uuid,
      '10000000-0000-4000-8000-000000000001'::uuid,
      '20000000-0000-4000-8000-000000000001'::uuid,
      '30000000-0000-4000-8000-000000000001'::uuid,
      '11'
    ),
    (
      '40000000-0000-4000-8000-000000000002'::uuid,
      '10000000-0000-4000-8000-000000000002'::uuid,
      '20000000-0000-4000-8000-000000000002'::uuid,
      '30000000-0000-4000-8000-000000000002'::uuid,
      '26'
    )
) as values_to_insert (id, user_id, annual_map_id, photo_asset_id, region_code)
join public.regions
  on regions.country_code = 'KR'
  and regions.standard_code = values_to_insert.region_code;

set local role anon;

select throws_ok(
  $$select count(*) from public.profiles$$,
  '42501',
  'permission denied for table profiles',
  'anon cannot read profiles'
);

select throws_ok(
  $$select count(*) from public.regions$$,
  '42501',
  'permission denied for table regions',
  'anon cannot read reference data'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';

select is((select count(*) from public.profiles), 1::bigint, 'user A sees one profile');
select is(
  (select count(*) from public.profiles where id = '10000000-0000-4000-8000-000000000002'),
  0::bigint,
  'user A cannot see user B profile'
);
select is((select count(*) from public.annual_maps), 1::bigint, 'user A sees one annual map');
select is(
  (select count(*) from public.annual_maps where user_id = '10000000-0000-4000-8000-000000000002'),
  0::bigint,
  'user A cannot see user B annual map'
);
select is((select count(*) from public.photo_assets), 1::bigint, 'user A sees one photo asset');
select is(
  (select count(*) from public.photo_assets where owner_id = '10000000-0000-4000-8000-000000000002'),
  0::bigint,
  'user A cannot see user B photo asset'
);
select is((select count(*) from public.region_entries), 1::bigint, 'user A sees one region entry');
select is(
  (select count(*) from public.region_entries where user_id = '10000000-0000-4000-8000-000000000002'),
  0::bigint,
  'user A cannot see user B region entry'
);
select is((select count(*) from public.regions), 17::bigint, 'authenticated users can read reference regions');

update public.profiles
set display_name = 'User A Updated'
where id = '10000000-0000-4000-8000-000000000001';

select is(
  (select display_name from public.profiles),
  'User A Updated',
  'user A can update their own display name'
);

update public.profiles
set display_name = 'Compromised'
where id = '10000000-0000-4000-8000-000000000002';

reset role;

select is(
  (
    select display_name
    from public.profiles
    where id = '10000000-0000-4000-8000-000000000002'
  ),
  'User B',
  'cross-user profile update changes no rows'
);

set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';

select throws_ok(
  $$insert into public.annual_maps (user_id, map_edition_id, year, country_code)
    select '10000000-0000-4000-8000-000000000001', id, 2027, 'KR'
    from public.map_editions where country_code = 'KR'$$,
  '42501',
  'permission denied for table annual_maps',
  'direct annual map insert is denied'
);

select throws_ok(
  $$delete from public.annual_maps where user_id = '10000000-0000-4000-8000-000000000001'$$,
  '42501',
  'permission denied for table annual_maps',
  'direct annual map delete is denied'
);

select throws_ok(
  $$update public.annual_maps set year = 2027 where user_id = '10000000-0000-4000-8000-000000000001'$$,
  '42501',
  'permission denied for table annual_maps',
  'direct annual map update is denied'
);

select throws_ok(
  $$insert into public.regions (country_code, standard_code, canonical_name)
    values ('KR', '99', 'Forbidden')$$,
  '42501',
  'permission denied for table regions',
  'reference table writes are denied'
);

reset role;

select * from finish();

rollback;
