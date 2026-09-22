import Link from "next/link";
import type { ReactNode } from "react";

type PrimaryActionLinkProps = {
  children: ReactNode;
  href: string;
};

export default function PrimaryActionLink({
  children,
  href,
}: PrimaryActionLinkProps) {
  return (
    <Link
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 font-display text-[0.9375rem] font-bold text-surface no-underline transition-colors duration-[var(--motion-fast)] hover:bg-primary-hover aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-empty aria-disabled:text-text-secondary motion-reduce:transition-none"
      href={href}
    >
      {children}
    </Link>
  );
}
