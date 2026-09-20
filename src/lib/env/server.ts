import "server-only";

const readRequiredServerEnv = (name: string, value: string | undefined) => {
  const normalized = value?.trim();

  if (!normalized || /replace_me|your-project-ref/i.test(normalized)) {
    throw new Error(`[서버 환경변수 오류] ${name}이(가) 설정되지 않았습니다.`);
  }

  return normalized;
};

export const getSupabaseServerEnv = () => {
  const url = readRequiredServerEnv("SUPABASE_URL", process.env.SUPABASE_URL);
  const secretKey = readRequiredServerEnv(
    "SUPABASE_SECRET_KEY",
    process.env.SUPABASE_SECRET_KEY,
  );

  const parsed = new URL(url);
  const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !isLocal) {
    throw new Error("[서버 환경변수 오류] SUPABASE_URL은 HTTPS 또는 loopback URL이어야 합니다.");
  }

  if (!secretKey.startsWith("sb_secret_")) {
    throw new Error("[서버 환경변수 오류] SUPABASE_SECRET_KEY는 sb_secret_ 형식이어야 합니다.");
  }

  return { url, secretKey } as const;
};
