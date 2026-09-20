# 여행 사진 지도

대한민국 시·도를 여행 사진으로 채우는 연도별 개인 지도 서비스입니다.

## Runtime

- Node.js `22.23.2`
- npm `10.9.8`
- Next.js `16.3.5` App Router
- TypeScript `5.9.3`
- `@supabase/supabase-js` `2.116.0`
- `@supabase/ssr` `0.12.7`

## Getting Started

Node.js 버전을 맞춘 뒤 환경변수를 설정합니다.

```bash
cp .env.example .env.local
npm run check:env
npm run dev
```

필수 환경변수:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL` — Server 전용
- `SUPABASE_SECRET_KEY` — Server 전용

`SUPABASE_SECRET_KEY` 같은 관리자 Key는 Server 전용이며 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.
환경별 설정과 Key 경계는 [`docs/environment-variables.md`](docs/environment-variables.md)를 따릅니다.

## Verification

```bash
npm run lint
npm run typecheck
npm run check:env-boundaries
npm run build
```

기본 Production build는 제한된 로컬 실행 환경에서도 재현되도록 Webpack을 사용합니다. Turbopack 검증은 `npm run build:turbopack`으로 별도 실행합니다.

## Supabase 로컬 개발

Supabase CLI는 프로젝트 개발 종속성으로 고정되어 있습니다. Docker가 실행
중인 상태에서 아래 순서로 로컬 환경을 재현할 수 있습니다.

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:stop
```

원격 프로젝트 연결과 migration 배포 절차는
[`docs/supabase-workflow.md`](docs/supabase-workflow.md)를 따릅니다.
