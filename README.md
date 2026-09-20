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

`SUPABASE_SECRET_KEY` 같은 관리자 Key는 Server 전용이며 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

기본 Production build는 제한된 로컬 실행 환경에서도 재현되도록 Webpack을 사용합니다. Turbopack 검증은 `npm run build:turbopack`으로 별도 실행합니다.
