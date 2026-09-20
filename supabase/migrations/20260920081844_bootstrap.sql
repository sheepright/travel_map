-- Baseline migration for the local-first workflow.
-- Product tables and policies are intentionally added by later ordered tasks.
begin;

comment on schema public is
  'Application schema. Exposed objects require explicit grants and RLS policies.';

commit;
