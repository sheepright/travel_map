import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerEnv } from "@/lib/env/server";

export const createAdminClient = () => {
  const { url, secretKey } = getSupabaseServerEnv();

  return createSupabaseClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
};
