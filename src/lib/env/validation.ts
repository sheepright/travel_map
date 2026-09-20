const placeholderPattern = /replace_me|your-project-ref/i;
const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

export const requireEnv = (name: string, value: string | undefined) => {
  const normalized = value?.trim();

  if (!normalized || placeholderPattern.test(normalized)) {
    throw new Error(`[환경변수 오류] ${name}이(가) 설정되지 않았습니다.`);
  }

  return normalized;
};

export const requireSupabaseUrl = (name: string, value: string | undefined) => {
  const normalized = requireEnv(name, value);

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "https:" && !localHostnames.has(parsed.hostname)) {
      throw new Error("HTTPS 또는 loopback URL이 필요합니다.");
    }
  } catch (error) {
    throw new Error(
      `[환경변수 오류] ${name}이 올바르지 않습니다: ${error instanceof Error ? error.message : "invalid URL"}`,
    );
  }

  return normalized;
};

export const requireSupabaseKey = (
  name: string,
  value: string | undefined,
  prefix: "sb_publishable_" | "sb_secret_",
) => {
  const normalized = requireEnv(name, value);

  if (!normalized.startsWith(prefix)) {
    throw new Error(`[환경변수 오류] ${name}은(는) ${prefix} 형식이어야 합니다.`);
  }

  return normalized;
};
