# Supabase environment variables

Supabase keys are separated by execution boundary. Publishable keys may be sent
to a browser and rely on grants plus Row Level Security. Secret keys bypass Row
Level Security and are restricted to trusted server code.

| Variable | Local | Preview | Production | Boundary |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Local API URL | Preview project URL | Production project URL | Browser and server |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Local publishable key | Preview publishable key | Production publishable key | Browser and server |
| `SUPABASE_URL` | Local API URL | Preview project URL | Production project URL | Server only |
| `SUPABASE_SECRET_KEY` | Local secret key | Preview secret key | Production secret key | Server only |

## Local development

Copy `.env.example` to the ignored `.env.local` file and replace every
placeholder. `supabase start` prints local URL, publishable key, and secret key.
Never commit the resulting file.

```bash
cp .env.example .env.local
npm run check:env
npm run check:env-boundaries
```

The browser client imports only `src/lib/env/public.ts`. Privileged server code
must import `src/lib/env/server.ts` or `src/lib/supabase/admin.ts`; both use
`server-only` so a Client Component import fails during the build.

## Preview and production

Configure all four variables independently in the deployment provider. Use a
separate Supabase project for Preview when available. Until one exists, Preview
must not receive the production Secret Key; server-side privileged Preview
features remain disabled instead.

Public variables are embedded at build time, so Preview and Production must be
built with their own URL and Publishable Key. Store Secret Keys only in encrypted
server-side environment settings and scope them to the matching environment.

## CI

Static checks, lint, type checking, and tests that do not call Supabase require
no real key. Use obvious `sb_publishable_...` and `sb_secret_...` test values
only when a build job requires variable shape validation. Never print variables
or upload `.env*` as an artifact.

Required checks:

```bash
npm run check:env-boundaries
npm run lint
npm run typecheck
npm run build
```

## Rotation and incidents

Use a separate Secret Key per backend component when the platform permits. If a
Secret Key is exposed, delete or rotate it immediately, update only the affected
server environment, redeploy, and review access logs. A Secret Key must never be
sent over chat, placed in a URL, logged, or prefixed with `NEXT_PUBLIC_`.
