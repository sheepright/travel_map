import getCurrentKoreanYear from "@/lib/date/getCurrentKoreanYear";
import BrandMark from "./BrandMark";
import NavigationLink from "./NavigationLink";
import PrimaryActionLink from "./PrimaryActionLink";
import { DESKTOP_NAVIGATION_ITEMS } from "./navigation";

export default function DesktopHeader() {
  const currentYear = getCurrentKoreanYear();

  return (
    <header className="sticky top-0 z-20 hidden h-18 border-b border-border/80 bg-canvas/90 backdrop-blur-xl md:block">
      <div className="mx-auto grid h-full w-full max-w-[calc(var(--content-max-width)+var(--desktop-gutter)*2)] grid-cols-[auto_1fr_auto] items-center px-8 lg:grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)]">
        <BrandMark />
        <nav
          className="flex self-stretch items-center justify-center gap-2"
          aria-label="주요 메뉴"
        >
          {DESKTOP_NAVIGATION_ITEMS.map((item) => (
            <NavigationLink key={item.href} {...item} variant="desktop" />
          ))}
        </nav>
        <div className="flex items-center justify-end gap-3">
          <span
            className="hidden min-h-11 items-center rounded-md border border-border bg-surface px-4 font-display text-sm font-semibold text-text-secondary lg:inline-flex"
            aria-label={`현재 지도 연도 ${currentYear}년`}
          >
            {currentYear}년
          </span>
          <PrimaryActionLink href="/record/new">
            <span aria-hidden="true">＋</span>
            여행 기록
          </PrimaryActionLink>
        </div>
      </div>
    </header>
  );
}
