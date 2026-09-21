# CI and pull-request previews

## Local quality gate

The same command is used locally and by GitHub Actions:

```bash
npm ci
npm run ci
```

It validates the public environment shape and secret boundary, then runs ESLint,
TypeScript, Vitest, and a production Next.js build. CI uses obvious non-secret
Publishable test values and never receives a Supabase Secret Key.

## GitHub Actions

`.github/workflows/quality.yml` runs on every pull request and every push to
`develop` or `main`. The check name is `quality-gate`. Workflow permissions are
read-only, and concurrent runs for an older revision of the same PR are
cancelled.

## Branch workflow

1. Start development from `develop`.
2. For isolated work, create `feat/<task>-<summary>`, `fix/<task>-<summary>`, or
   `chore/<task>-<summary>` from `develop`.
3. Run `npm run ci` and the Task-specific verification before merging a work
   branch into `develop`.
4. Merge `develop` into `main` only through a pull request after the full quality
   gate succeeds.
5. After a squash or rebase release merge, create a `chore/<task>-sync-main-develop`
   branch from `develop`, merge `main` into it, and merge that branch back into
   `develop` through a pull request before starting the next Task. This keeps the
   protected branches' histories aligned without force-pushing either branch.
6. Keep `main` deployable and do not commit feature work to it directly.

Configure rulesets for both protected branches. `develop` should require the
`quality-gate` check for work-branch pull requests. `main` should require a pull
request from `develop`, the `quality-gate`, and the Vercel deployment check when
that integration is available.

For each protected branch:

1. Require a pull request before merging, except when a documented emergency
   recovery procedure explicitly allows otherwise.
2. Require status checks to pass.
3. Select `quality-gate` after its first successful run.
4. Require the branch to be up to date before merging.
5. Do not allow bypass except for documented emergency recovery.

GitHub can only select a required check after that check has run in the
repository at least once.

## Vercel Preview

Use Vercel's GitHub integration rather than putting Vercel credentials in this
workflow. Import the GitHub repository into Vercel and keep `main` as the
Production Branch. Vercel then creates a unique Preview Deployment and check for
every pull request automatically.

Configure Preview with only:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not add `SUPABASE_SECRET_KEY` to Preview until a separate non-production
Supabase project exists and a server-only Preview feature explicitly requires
it. Never expose Vercel tokens or Supabase secrets in workflow commands or logs.

For the merge gate, require both `quality-gate` and the Vercel deployment check
after their first successful runs. The exact Vercel check name is created by the
integration and must be selected from the repository ruleset UI.

## Activation checklist

- [ ] Create or select a GitHub repository and add it as this checkout's remote.
- [ ] Push `develop` and confirm `quality-gate` succeeds.
- [ ] Configure the `develop` ruleset to require `quality-gate`.
- [ ] Configure the `main` ruleset to require a pull request from `develop`.
- [ ] Import that repository into a Vercel project.
- [ ] Configure Preview and Production public environment variables separately.
- [ ] Open a test PR and confirm a unique Vercel Preview URL is attached.
- [ ] Require `quality-gate` and the Vercel check in the `main` ruleset.
- [ ] Deliberately fail a test on the PR branch and confirm merge is blocked.
