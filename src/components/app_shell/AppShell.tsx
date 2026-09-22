import type { ReactNode } from "react";
import DesktopHeader from "./DesktopHeader";
import MobileBottomNavigation from "./MobileBottomNavigation";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas [background:radial-gradient(circle_at_8%_0%,rgb(234_242_252_/_72%),transparent_24rem),var(--color-canvas)]">
      <DesktopHeader />
      <div className="mx-auto min-h-dvh w-full max-w-[calc(var(--content-max-width)+var(--desktop-gutter)*2)] px-5 pt-8 pb-[calc(var(--mobile-navigation-height)+2rem+env(safe-area-inset-bottom))] md:min-h-[calc(100dvh-var(--header-height))] md:px-8 md:pt-10 md:pb-16">
        {children}
      </div>
      <MobileBottomNavigation />
    </div>
  );
}
