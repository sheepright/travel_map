import NavigationLink from "./NavigationLink";
import { MOBILE_NAVIGATION_ITEMS } from "./navigation";

export default function MobileBottomNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-0.25rem_1rem_rgb(48_57_67_/_5%)] backdrop-blur-xl md:hidden"
      aria-label="모바일 주요 메뉴"
    >
      <div className="grid h-19 grid-cols-4">
        {MOBILE_NAVIGATION_ITEMS.map((item) => (
          <NavigationLink key={item.href} {...item} variant="mobile" />
        ))}
      </div>
    </nav>
  );
}
