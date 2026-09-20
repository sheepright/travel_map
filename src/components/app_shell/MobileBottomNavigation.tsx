import NavigationLink from "./NavigationLink";
import { MOBILE_NAVIGATION_ITEMS } from "./navigation";

export default function MobileBottomNavigation() {
  return (
    <nav className="mobileBottomNavigation" aria-label="모바일 주요 메뉴">
      <div className="mobileBottomNavigationInner">
        {MOBILE_NAVIGATION_ITEMS.map((item) => (
          <NavigationLink key={item.href} {...item} variant="mobile" />
        ))}
      </div>
    </nav>
  );
}
