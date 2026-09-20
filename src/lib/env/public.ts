const readRequiredPublicEnv = (name: string, value: string | undefined) => {
  const normalized = value?.trim();

  if (!normalized || /replace_me|your-project-ref/i.test(normalized)) {
    throw new Error(
      `[환경변수 오류] ${name}이(가) 없습니다. .env.example을 복사해 .env.local을 설정하세요.`,
    );
  }

  return normalized;
};

export const getSupabasePublicEnv = () => {
  const url = readRequiredPublicEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const publishableKey = readRequiredPublicEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
      throw new Error("HTTPS URL이 필요합니다.");
    }
  } catch (error) {
    throw new Error(
      `[환경변수 오류] NEXT_PUBLIC_SUPABASE_URL이 올바르지 않습니다: ${error instanceof Error ? error.message : "invalid URL"}`,
    );
  }

  return { url, publishableKey } as const;
};
