begin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name varchar(50),
  created_at timestamptz not null default now(),
  constraint profiles_display_name_length_check
    check (display_name is null or char_length(btrim(display_name)) between 1 and 50)
);

create table public.map_editions (
  id uuid primary key default gen_random_uuid(),
  country_code char(2) not null,
  version varchar(64) not null,
  region_count smallint not null,
  source text not null,
  license text not null,
  created_at timestamptz not null default now(),
  constraint map_editions_country_version_key unique (country_code, version),
  constraint map_editions_id_country_key unique (id, country_code),
  constraint map_editions_country_code_check check (country_code ~ '^[A-Z]{2}$'),
  constraint map_editions_version_check check (char_length(btrim(version)) between 1 and 64),
  constraint map_editions_region_count_check check (region_count > 0),
  constraint map_editions_source_check check (char_length(btrim(source)) > 0),
  constraint map_editions_license_check check (char_length(btrim(license)) > 0)
);

create table public.regions (
  id uuid primary key default gen_random_uuid(),
  country_code char(2) not null,
  standard_code varchar(32) not null,
  canonical_name varchar(100) not null,
  created_at timestamptz not null default now(),
  constraint regions_country_standard_key unique (country_code, standard_code),
  constraint regions_country_code_check check (country_code ~ '^[A-Z]{2}$'),
  constraint regions_standard_code_check check (char_length(btrim(standard_code)) between 1 and 32),
  constraint regions_canonical_name_check check (char_length(btrim(canonical_name)) between 1 and 100)
);

create table public.map_edition_regions (
  map_edition_id uuid not null references public.map_editions (id) on delete cascade,
  region_id uuid not null references public.regions (id) on delete restrict,
  display_name varchar(100) not null,
  geometry_key varchar(64) not null,
  sort_order smallint not null,
  primary key (map_edition_id, region_id),
  constraint map_edition_regions_geometry_key unique (map_edition_id, geometry_key),
  constraint map_edition_regions_sort_order unique (map_edition_id, sort_order),
  constraint map_edition_regions_display_name_check
    check (char_length(btrim(display_name)) between 1 and 100),
  constraint map_edition_regions_geometry_key_check
    check (char_length(btrim(geometry_key)) between 1 and 64),
  constraint map_edition_regions_sort_order_check check (sort_order > 0)
);

create table public.annual_maps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  map_edition_id uuid not null,
  year smallint not null,
  country_code char(2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint annual_maps_user_country_year_key unique (user_id, country_code, year),
  constraint annual_maps_id_user_key unique (id, user_id),
  constraint annual_maps_edition_country_fkey
    foreign key (map_edition_id, country_code)
    references public.map_editions (id, country_code)
    on delete restrict,
  constraint annual_maps_year_check check (year between 1900 and 9999),
  constraint annual_maps_country_code_check check (country_code ~ '^[A-Z]{2}$')
);

create table public.photo_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  bucket_id varchar(63) not null,
  object_path varchar(512) not null,
  status text not null default 'pending',
  mime_type varchar(100),
  byte_size integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint photo_assets_object_path_key unique (object_path),
  constraint photo_assets_id_owner_key unique (id, owner_id),
  constraint photo_assets_bucket_id_check check (char_length(btrim(bucket_id)) between 1 and 63),
  constraint photo_assets_object_path_check check (
    char_length(btrim(object_path)) between 1 and 512
    and object_path !~ '^/'
    and object_path !~ '(^|/)\.\.(/|$)'
  ),
  constraint photo_assets_status_check
    check (status in ('pending', 'ready', 'failed', 'deleting')),
  constraint photo_assets_mime_type_check
    check (mime_type is null or mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  constraint photo_assets_byte_size_check
    check (byte_size is null or byte_size between 1 and 716800)
);

create table public.region_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  annual_map_id uuid not null,
  region_id uuid not null references public.regions (id) on delete restrict,
  photo_asset_id uuid not null,
  month smallint,
  comment varchar(300),
  crop_x numeric(5, 4) not null default 0.5,
  crop_y numeric(5, 4) not null default 0.5,
  crop_scale numeric(5, 2) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint region_entries_map_region_key unique (annual_map_id, region_id),
  constraint region_entries_photo_asset_key unique (photo_asset_id),
  constraint region_entries_annual_map_user_fkey
    foreign key (annual_map_id, user_id)
    references public.annual_maps (id, user_id)
    on delete cascade,
  constraint region_entries_photo_asset_user_fkey
    foreign key (photo_asset_id, user_id)
    references public.photo_assets (id, owner_id)
    on delete restrict,
  constraint region_entries_month_check check (month is null or month between 1 and 12),
  constraint region_entries_comment_check check (comment is null or char_length(comment) <= 300),
  constraint region_entries_crop_x_check check (crop_x between 0 and 1),
  constraint region_entries_crop_y_check check (crop_y between 0 and 1),
  constraint region_entries_crop_scale_check check (crop_scale between 1 and 4)
);

create index map_edition_regions_region_idx
  on public.map_edition_regions (region_id);

create index annual_maps_user_year_idx
  on public.annual_maps (user_id, year desc);

create index annual_maps_map_edition_idx
  on public.annual_maps (map_edition_id);

create index photo_assets_owner_status_idx
  on public.photo_assets (owner_id, status);

create index region_entries_user_idx
  on public.region_entries (user_id);

create index region_entries_region_idx
  on public.region_entries (region_id);

alter table public.profiles enable row level security;
alter table public.map_editions enable row level security;
alter table public.regions enable row level security;
alter table public.map_edition_regions enable row level security;
alter table public.annual_maps enable row level security;
alter table public.photo_assets enable row level security;
alter table public.region_entries enable row level security;

comment on table public.map_editions is
  'Versioned map metadata. Source and use conditions are preserved per edition.';
comment on column public.map_edition_regions.geometry_key is
  'Stable key matching the geometry asset for this map edition.';
comment on table public.region_entries is
  'One photo-backed entry per annual map and region.';

commit;
