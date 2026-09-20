import "server-only";

import { requireSupabaseKey, requireSupabaseUrl } from "./validation";

export const getSupabaseServerEnv = () => {
  const url = requireSupabaseUrl("SUPABASE_URL", process.env.SUPABASE_URL);
  const secretKey = requireSupabaseKey(
    "SUPABASE_SECRET_KEY",
    process.env.SUPABASE_SECRET_KEY,
    "sb_secret_",
  );

  return { url, secretKey } as const;
};
