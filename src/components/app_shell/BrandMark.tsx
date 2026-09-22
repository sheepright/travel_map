import Link from "next/link";

export default function BrandMark() {
  return (
    <Link
      className="inline-flex min-h-11 w-fit items-center gap-3 font-display text-[1.0625rem] font-bold tracking-[-0.025em] text-text-primary no-underline"
      href="/map"
      aria-label="여행 사진 지도 홈"
    >
      <span
        className="grid size-8 place-items-center rounded-full bg-primary-soft text-primary"
        aria-hidden="true"
      >
        <svg
          className="size-5 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.75]"
          viewBox="0 0 24 24"
        >
          <path d="M5.25 4.5 9.5 3l5 2 4.25-1.5v16L14.5 21l-5-2-4.25 1.5v-16Z" />
          <path d="M9.5 3v16M14.5 5v16" />
          <path d="m7.25 11 1.1 1.1 2.4-2.5" />
        </svg>
      </span>
      <span>여행 사진 지도</span>
    </Link>
  );
}
