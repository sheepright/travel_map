import { describe, expect, it } from "vitest";
import getCurrentKoreanYear from "./getCurrentKoreanYear";

describe("getCurrentKoreanYear", () => {
  it("uses the Asia/Seoul calendar at the year boundary", () => {
    const referenceDate = new Date("2025-12-31T15:30:00.000Z");

    expect(getCurrentKoreanYear(referenceDate)).toBe(2026);
  });
});
