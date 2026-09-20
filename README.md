# 여행 사진 지도

대한민국 시·도를 여행 사진으로 채우는 연도별 개인 지도 서비스입니다.

## Runtime

- Node.js `22.23.2`
- npm `10.9.8`
- Next.js `16.3.5` App Router
- TypeScript `5.9.3`
- Tailwind CSS `4.x`
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

전체 로컬·CI 품질 Gate는 `npm run ci`로 동일하게 실행합니다. GitHub Actions,
Merge 보호, Vercel PR Preview 활성화 절차는
[`docs/ci-preview.md`](docs/ci-preview.md)를 따릅니다.

## Git workflow

- `main`: 검증이 끝난 배포 가능 코드만 유지합니다.
- `develop`: 모든 개발 Task의 기본 통합 브랜치입니다.
- 작업 브랜치는 필요한 경우 `develop`에서 만들고 검증 후 `develop`으로 병합합니다.
- `develop`에서 `npm run ci`와 Task별 검증을 통과한 변경만 PR을 통해 `main`으로 병합합니다.

`main`에는 직접 개발 커밋을 만들지 않습니다. 브랜치 보호와 Required Check
설정은 [`docs/ci-preview.md`](docs/ci-preview.md)를 따릅니다.

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
