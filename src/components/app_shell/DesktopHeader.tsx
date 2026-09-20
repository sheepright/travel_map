import Link from "next/link";
import getCurrentKoreanYear from "@/lib/date/getCurrentKoreanYear";
import BrandMark from "./BrandMark";
import NavigationLink from "./NavigationLink";
import { DESKTOP_NAVIGATION_ITEMS } from "./navigation";

export default function DesktopHeader() {
  const currentYear = getCurrentKoreanYear();

  return (
    <header className="desktopHeader">
      <div className="desktopHeaderInner">
        <BrandMark />
        <nav className="desktopNavigation" aria-label="주요 메뉴">
          {DESKTOP_NAVIGATION_ITEMS.map((item) => (
            <NavigationLink key={item.href} {...item} variant="desktop" />
          ))}
        </nav>
        <div className="desktopHeaderActions">
          <span className="yearBadge" aria-label={`현재 지도 연도 ${currentYear}년`}>
            {currentYear}년
          </span>
          <Link className="primaryAction" href="/record/new">
            <span aria-hidden="true">＋</span>
            여행 기록
          </Link>
        </div>
      </div>
    </header>
  );
}
