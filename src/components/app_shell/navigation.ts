export type NavigationIcon = "map" | "record" | "archive" | "profile";

export type NavigationItem = {
  href: string;
  icon: NavigationIcon;
  label: string;
};

export const DESKTOP_NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/map", icon: "map", label: "내 지도" },
  { href: "/archive", icon: "archive", label: "보관함" },
  { href: "/profile", icon: "profile", label: "내 정보" },
];

export const MOBILE_NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/map", icon: "map", label: "지도" },
  { href: "/record/new", icon: "record", label: "기록" },
  { href: "/archive", icon: "archive", label: "보관함" },
  { href: "/profile", icon: "profile", label: "내 정보" },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
