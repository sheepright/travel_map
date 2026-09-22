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

const NAVIGATION_LINK_BASE_CLASS_NAME =
  "relative inline-flex min-h-11 min-w-11 items-center justify-center font-display font-semibold text-text-secondary no-underline transition-colors duration-[var(--motion-fast)] hover:text-primary-hover data-[active=true]:text-primary-hover motion-reduce:transition-none";

const NAVIGATION_LINK_VARIANT_CLASS_NAMES = {
  desktop:
    "self-stretch gap-2 px-3 text-[0.9375rem] after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-transparent after:content-[''] data-[active=true]:after:bg-primary lg:px-4 lg:after:inset-x-4",
  mobile:
    "min-h-19 min-w-0 flex-col gap-1 px-1 py-2 text-xs leading-4 before:absolute before:top-0 before:h-0.5 before:w-8 before:rounded-full before:bg-transparent before:content-[''] data-[active=true]:bg-gradient-to-b data-[active=true]:from-primary-soft data-[active=true]:to-transparent data-[active=true]:before:bg-primary",
} as const;

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
      className={`${NAVIGATION_LINK_BASE_CLASS_NAME} ${NAVIGATION_LINK_VARIANT_CLASS_NAMES[variant]}`}
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
    >
      <span
        className={`grid place-items-center [&_svg]:size-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.75] ${variant === "desktop" ? "hidden" : ""}`}
      >
        <NavigationIconGraphic icon={icon} />
      </span>
      <span>{label}</span>
    </Link>
  );
}
