# Supabase local-first workflow

The local Supabase stack is the default development database. The single hosted
project is treated as production and receives reviewed migrations only.

## Prerequisites

- Node.js 22.23.2
- Docker Desktop or another Docker-compatible runtime
- Dependencies installed with `npm ci`

The CLI is pinned as a project dependency. Always invoke it through npm scripts
or `npx supabase`; do not rely on a globally installed version.

## Local lifecycle

```bash
npm run supabase:version
npm run supabase:start
npm run supabase:status
npm run supabase:reset
npm run supabase:lint
npm run supabase:test
npm run supabase:stop
```

`supabase:reset` destroys only the local database, reapplies every file under
`supabase/migrations/`, and then runs `supabase/seed.sql`. Never add `--linked`
to the reset command.

## Creating and verifying a migration

Discover current flags before use:

```bash
npx supabase migration new --help
npx supabase db reset --help
npx supabase migration list --help
```

Create migration filenames with the CLI:

```bash
npx supabase migration new <descriptive_name>
```

Edit the generated SQL file, then verify from a clean local database:

```bash
npm run supabase:reset
npm run supabase:lint
npm run supabase:test
npx supabase migration list --local
```

Database tests live under `supabase/tests/database/` and run with pgTAP. A
migration is ready for review only when a clean reset, schema lint, database
tests, and an empty `npx supabase db diff --local --schema public` all pass.

Commit `supabase/config.toml`, `supabase/migrations/`, and
`supabase/seed.sql`. Do not commit `supabase/.temp`, local environment files,
access tokens, database passwords, secret keys, or service-role keys.

## Linking the hosted production project

Linking requires an authenticated operator and the exact project reference. It
must be performed manually from the repository root:

```bash
npx supabase login
npx supabase link --project-ref <production-project-ref>
```

The project reference is available in the Supabase Dashboard URL. Do not put the
access token, database password, or project reference in committed files.

Before deploying, compare migration history and preview the change:

```bash
npx supabase migration list --linked
npx supabase db push --linked --dry-run
```

Only after reviewing the dry run and confirming a current backup may the
operator run:

```bash
npx supabase db push --linked
```

Production reset commands are prohibited. If local and remote histories differ,
stop and reconcile them before pushing; do not guess with `migration repair`.

## Data API access control

The exposed `public` schema uses an explicit-deny baseline. `anon` receives no
application table privileges. `authenticated` receives only the operations in
this matrix; RLS then limits rows within those operations.

| Tables | `anon` | `authenticated` | Row policy |
| --- | --- | --- | --- |
| `map_editions`, `regions`, `map_edition_regions` | None | `SELECT` | All signed-in users |
| `profiles` | None | `SELECT`, `UPDATE(display_name)` | `id = auth.uid()` |
| `annual_maps`, `photo_assets`, `region_entries` | None | `SELECT` | Owner column equals `auth.uid()` |

Client-side inserts, updates, and deletes for map records remain denied. Later
tasks expose atomic writes through narrowly granted RPCs instead of reopening
table-wide write privileges. Service-role credentials remain server-only and
must never be used to simulate ordinary user requests.

### Troubleshooting `42501`

PostgREST reports missing privileges and RLS write rejections with PostgreSQL
code `42501` (normally HTTP 401 for `anon`, 403 for `authenticated`). Inspect
the complete error object, especially `code` and `hint`, and then check in this
order:

1. Confirm the request has the intended session and database role.
2. Compare table and column grants with the matrix above.
3. Confirm the relevant operation has a policy with the correct `TO`, `USING`,
   and, for writes, `WITH CHECK` clauses.
4. Reproduce the request in `supabase/tests/database/data_api_rls.test.sql`.

Do not resolve a `42501` by granting broad table access. Change a grant or
policy only when the product contract requires the operation, and add both an
allow test and a cross-user deny test in the same change.

## Configuration notes

- Local JWT lifetime is 900 seconds, matching the approved MVP policy.
- New public-schema objects are not automatically exposed to Data API roles.
  Later migrations must add explicit grants and RLS policies together.
- Secrets referenced from `config.toml` must use `env(...)`, never literals.
- The local stack uses development credentials and must not be exposed to the
  public internet.
