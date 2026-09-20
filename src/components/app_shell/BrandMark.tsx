import Link from "next/link";

export default function BrandMark() {
  return (
    <Link className="brandMark" href="/map" aria-label="여행 사진 지도 홈">
      <span className="brandMarkIcon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5.25 4.5 9.5 3l5 2 4.25-1.5v16L14.5 21l-5-2-4.25 1.5v-16Z" />
          <path d="M9.5 3v16M14.5 5v16" />
          <path d="m7.25 11 1.1 1.1 2.4-2.5" />
        </svg>
      </span>
      <span>여행 사진 지도</span>
    </Link>
  );
}
