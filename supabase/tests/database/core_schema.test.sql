begin;

create extension if not exists pgtap with schema extensions;

select plan(25);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'map_editions', 'map_editions table exists');
select has_table('public', 'regions', 'regions table exists');
select has_table('public', 'map_edition_regions', 'map_edition_regions table exists');
select has_table('public', 'annual_maps', 'annual_maps table exists');
select has_table('public', 'photo_assets', 'photo_assets table exists');
select has_table('public', 'region_entries', 'region_entries table exists');

select is(
  (select count(*) from public.map_editions where country_code = 'KR'),
  1::bigint,
  'one Korean map edition is seeded'
);

select is(
  (select version from public.map_editions where country_code = 'KR'),
  '2018-prototype-v1',
  'map edition version is recorded'
);

select ok(
  (select source <> '' and license <> '' from public.map_editions where country_code = 'KR'),
  'map source and use conditions are recorded'
);

select is(
  (select count(*) from public.regions where country_code = 'KR'),
  17::bigint,
  'all 17 Korean first-level regions are seeded'
);

select is(
  (
    select count(*)
    from public.map_edition_regions mer
    join public.map_editions me on me.id = mer.map_edition_id
    where me.country_code = 'KR' and me.version = '2018-prototype-v1'
  ),
  17::bigint,
  'all edition-region mappings are seeded'
);

select is(
  (select canonical_name from public.regions where country_code = 'KR' and standard_code = '32'),
  '강원특별자치도',
  'current Gangwon display name is seeded'
);

select is(
  (select canonical_name from public.regions where country_code = 'KR' and standard_code = '35'),
  '전북특별자치도',
  'current Jeonbuk display name is seeded'
);

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
  'RLS is enabled on every application table'
);

select is(
  (
    select count(*)
    from pg_constraint
    join pg_class on pg_class.oid = pg_constraint.conrelid
    join pg_namespace on pg_namespace.oid = pg_constraint.connamespace
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
      and pg_constraint.contype = 'p'
  ),
  7::bigint,
  'every application table has a primary key'
);

select is(
  (
    select count(*)
    from pg_constraint
    join pg_class on pg_class.oid = pg_constraint.conrelid
    join pg_namespace on pg_namespace.oid = pg_constraint.connamespace
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
      and pg_constraint.contype = 'f'
  ),
  10::bigint,
  'all designed foreign keys exist'
);

select is(
  (
    select count(*)
    from pg_constraint
    join pg_class on pg_class.oid = pg_constraint.conrelid
    join pg_namespace on pg_namespace.oid = pg_constraint.connamespace
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
      and pg_constraint.contype = 'u'
  ),
  11::bigint,
  'all designed unique constraints exist'
);

select is(
  (
    select count(*)
    from pg_constraint
    join pg_class on pg_class.oid = pg_constraint.conrelid
    join pg_namespace on pg_namespace.oid = pg_constraint.connamespace
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
      and pg_constraint.contype = 'c'
  ),
  24::bigint,
  'all designed check constraints exist'
);

select is(
  (
    select count(*)
    from pg_indexes
    where schemaname = 'public'
      and indexname in (
        'map_edition_regions_region_idx',
        'annual_maps_user_year_idx',
        'annual_maps_map_edition_idx',
        'photo_assets_owner_status_idx',
        'region_entries_user_idx',
        'region_entries_region_idx'
      )
  ),
  6::bigint,
  'all explicit lookup indexes exist'
);

select is(
  (
    select count(*)::smallint = max(region_count)
    from public.map_edition_regions mer
    join public.map_editions me on me.id = mer.map_edition_id
    where me.country_code = 'KR' and me.version = '2018-prototype-v1'
  ),
  true,
  'seeded region count matches map edition metadata'
);

select is(
  (
    select data_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'annual_maps'
      and column_name = 'year'
  ),
  'smallint',
  'annual map year uses smallint'
);

select has_index(
  'public',
  'annual_maps',
  'annual_maps_user_year_idx',
  'annual maps have a user and year lookup index'
);

select has_index(
  'public',
  'photo_assets',
  'photo_assets_owner_status_idx',
  'photo assets have an owner and status lookup index'
);

select has_index(
  'public',
  'region_entries',
  'region_entries_user_idx',
  'region entries have a user lookup index'
);

select * from finish();

rollback;
