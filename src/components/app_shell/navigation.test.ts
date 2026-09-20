import { describe, expect, it } from "vitest";
import { isNavigationItemActive } from "./navigation";

describe("isNavigationItemActive", () => {
  it("matches an exact route", () => {
    expect(isNavigationItemActive("/map", "/map")).toBe(true);
  });

  it("matches a nested route", () => {
    expect(isNavigationItemActive("/archive/2025", "/archive")).toBe(true);
  });

  it("does not match a route with a shared prefix", () => {
    expect(isNavigationItemActive("/maple", "/map")).toBe(false);
  });
});
