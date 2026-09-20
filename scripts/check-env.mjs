const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

const missing = required.filter((name) => {
  const value = process.env[name]?.trim();
  return !value || /replace_me|your-project-ref/i.test(value);
});

if (missing.length > 0) {
  console.error(
    `[환경변수 오류] 다음 값을 .env.local에 설정하세요: ${missing.join(", ")}`,
  );
  process.exit(1);
}

try {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("HTTPS URL이 필요합니다.");
  }
} catch (error) {
  console.error(
    `[환경변수 오류] NEXT_PUBLIC_SUPABASE_URL이 올바르지 않습니다: ${error instanceof Error ? error.message : "invalid URL"}`,
  );
  process.exit(1);
}

console.log("환경변수 검증 통과");
