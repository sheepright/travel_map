import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "여행 사진 지도",
  description: "사진으로 채우는 나만의 연도별 여행 지도",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
