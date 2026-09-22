-- Deterministic map metadata for local development.
-- Geometry is a prototype based on 2018 SGIS administrative boundaries.
-- Before production use, Task 19 must revalidate the current official boundary data
-- and its use conditions. SGIS materials require source attribution and agreement to
-- submit usage results when data is requested.

begin;

insert into public.map_editions (
  id,
  country_code,
  version,
  region_count,
  source,
  license
)
values (
  '00000000-0000-4000-8000-000000002018',
  'KR',
  '2018-prototype-v1',
  17,
  '통계청 통계지리정보서비스(SGIS) 2018 행정경계 기반 프로토타입 · https://sgis.kostat.go.kr',
  'SGIS 자료이용조건 적용: 출처 명시 및 활용 결과 제출 동의. 운영 적용 전 Task 19에서 최신 경계와 이용조건 재검증 필요'
)
on conflict (country_code, version) do update
set
  region_count = excluded.region_count,
  source = excluded.source,
  license = excluded.license;

insert into public.regions (id, country_code, standard_code, canonical_name)
values
  ('00000000-0000-4000-8000-000000000011', 'KR', '11', '서울특별시'),
  ('00000000-0000-4000-8000-000000000021', 'KR', '21', '부산광역시'),
  ('00000000-0000-4000-8000-000000000022', 'KR', '22', '대구광역시'),
  ('00000000-0000-4000-8000-000000000023', 'KR', '23', '인천광역시'),
  ('00000000-0000-4000-8000-000000000024', 'KR', '24', '광주광역시'),
  ('00000000-0000-4000-8000-000000000025', 'KR', '25', '대전광역시'),
  ('00000000-0000-4000-8000-000000000026', 'KR', '26', '울산광역시'),
  ('00000000-0000-4000-8000-000000000029', 'KR', '29', '세종특별자치시'),
  ('00000000-0000-4000-8000-000000000031', 'KR', '31', '경기도'),
  ('00000000-0000-4000-8000-000000000032', 'KR', '32', '강원특별자치도'),
  ('00000000-0000-4000-8000-000000000033', 'KR', '33', '충청북도'),
  ('00000000-0000-4000-8000-000000000034', 'KR', '34', '충청남도'),
  ('00000000-0000-4000-8000-000000000035', 'KR', '35', '전북특별자치도'),
  ('00000000-0000-4000-8000-000000000036', 'KR', '36', '전라남도'),
  ('00000000-0000-4000-8000-000000000037', 'KR', '37', '경상북도'),
  ('00000000-0000-4000-8000-000000000038', 'KR', '38', '경상남도'),
  ('00000000-0000-4000-8000-000000000039', 'KR', '39', '제주특별자치도')
on conflict (country_code, standard_code) do update
set canonical_name = excluded.canonical_name;

with edition as (
  select id
  from public.map_editions
  where country_code = 'KR' and version = '2018-prototype-v1'
), edition_regions (standard_code, display_name, sort_order) as (
  values
    ('11', '서울특별시', 1),
    ('21', '부산광역시', 2),
    ('22', '대구광역시', 3),
    ('23', '인천광역시', 4),
    ('24', '광주광역시', 5),
    ('25', '대전광역시', 6),
    ('26', '울산광역시', 7),
    ('29', '세종특별자치시', 8),
    ('31', '경기도', 9),
    ('32', '강원특별자치도', 10),
    ('33', '충청북도', 11),
    ('34', '충청남도', 12),
    ('35', '전북특별자치도', 13),
    ('36', '전라남도', 14),
    ('37', '경상북도', 15),
    ('38', '경상남도', 16),
    ('39', '제주특별자치도', 17)
)
insert into public.map_edition_regions (
  map_edition_id,
  region_id,
  display_name,
  geometry_key,
  sort_order
)
select
  edition.id,
  regions.id,
  edition_regions.display_name,
  edition_regions.standard_code,
  edition_regions.sort_order
from edition
join edition_regions on true
join public.regions
  on regions.country_code = 'KR'
  and regions.standard_code = edition_regions.standard_code
on conflict (map_edition_id, region_id) do update
set
  display_name = excluded.display_name,
  geometry_key = excluded.geometry_key,
  sort_order = excluded.sort_order;

commit;
