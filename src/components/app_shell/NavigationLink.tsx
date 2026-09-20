"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationIcon } from "./navigation";
import { isNavigationItemActive } from "./navigation";

type NavigationLinkProps = {
  href: string;
  icon: NavigationIcon;
  label: string;
  variant: "desktop" | "mobile";
};

function NavigationIconGraphic({ icon }: { icon: NavigationIcon }) {
  if (icon === "map") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3.5 5.5 5-2 7 2 5-2v15l-5 2-7-2-5 2v-15Z" />
        <path d="M8.5 3.5v15M15.5 5.5v15" />
      </svg>
    );
  }

  if (icon === "record") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (icon === "archive") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7.5h16v12H4zM3 4.5h18v3H3z" />
        <path d="M9 11h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 20c.5-4.1 2.65-6.15 6.5-6.15S18 15.9 18.5 20" />
    </svg>
  );
}

export default function NavigationLink({
  href,
  icon,
  label,
  variant,
}: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = isNavigationItemActive(pathname, href);

  return (
    <Link
      className={`navigationLink navigationLink--${variant}`}
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
    >
      <span className="navigationLinkIcon">
        <NavigationIconGraphic icon={icon} />
      </span>
      <span>{label}</span>
    </Link>
  );
}
