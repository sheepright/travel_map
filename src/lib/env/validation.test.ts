import { describe, expect, it } from "vitest";

import { requireEnv, requireSupabaseKey, requireSupabaseUrl } from "./validation";

describe("environment validation", () => {
  it("trims a configured value", () => {
    expect(requireEnv("EXAMPLE", "  configured  ")).toBe("configured");
  });

  it.each([undefined, "", "replace_me", "https://your-project-ref.supabase.co"])(
    "rejects missing or placeholder values: %s",
    (value) => {
      expect(() => requireEnv("EXAMPLE", value)).toThrow("EXAMPLE");
    },
  );

  it.each([
    "https://project.supabase.co",
    "http://localhost:54321",
    "http://127.0.0.1:54321",
    "http://[::1]:54321",
  ])("accepts secure or loopback Supabase URLs: %s", (url) => {
    expect(requireSupabaseUrl("SUPABASE_URL", url)).toBe(url);
  });

  it("rejects an insecure remote URL", () => {
    expect(() => requireSupabaseUrl("SUPABASE_URL", "http://example.com")).toThrow(
      "HTTPS 또는 loopback",
    );
  });

  it("keeps publishable and secret key prefixes separate", () => {
    expect(
      requireSupabaseKey("PUBLIC_KEY", "sb_publishable_example", "sb_publishable_"),
    ).toBe("sb_publishable_example");
    expect(() =>
      requireSupabaseKey("PUBLIC_KEY", "sb_secret_example", "sb_publishable_"),
    ).toThrow("sb_publishable_");
    expect(requireSupabaseKey("SECRET_KEY", "sb_secret_example", "sb_secret_")).toBe(
      "sb_secret_example",
    );
  });
});
