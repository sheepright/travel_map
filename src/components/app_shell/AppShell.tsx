import type { ReactNode } from "react";
import DesktopHeader from "./DesktopHeader";
import MobileBottomNavigation from "./MobileBottomNavigation";
import "./app_shell.css";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="appShell">
      <DesktopHeader />
      <div className="appShellContent">{children}</div>
      <MobileBottomNavigation />
    </div>
  );
}
