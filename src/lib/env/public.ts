import { requireSupabaseKey, requireSupabaseUrl } from "./validation";

export const getSupabasePublicEnv = () => {
  const url = requireSupabaseUrl(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const publishableKey = requireSupabaseKey(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    "sb_publishable_",
  );

  return { url, publishableKey } as const;
};
