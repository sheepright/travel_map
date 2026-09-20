import Link from "next/link";
import getCurrentKoreanYear from "@/lib/date/getCurrentKoreanYear";

const REGION_PLACEHOLDERS = Array.from({ length: 17 }, (_, index) => index);

export default function MapPage() {
  const currentYear = getCurrentKoreanYear();

  return (
    <main className="mapPage">
      <section className="mapPageIntro">
        <div>
          <p className="routeEyebrow">{currentYear} TRAVEL MAP</p>
          <h1>올해의 지도를 채워보세요</h1>
          <p>사진 한 장으로 다녀온 지역의 기억을 남길 수 있어요.</p>
        </div>
        <div className="mapProgress" aria-label="지도 완성도 17개 지역 중 0개">
          <div>
            <span>지도 완성도</span>
            <strong>0 / 17</strong>
          </div>
          <span className="mapProgressTrack" aria-hidden="true">
            <span />
          </span>
        </div>
      </section>

      <section className="mapCanvas" aria-labelledby="map-placeholder-title">
        <div className="mapCanvasArtwork" aria-hidden="true">
          {REGION_PLACEHOLDERS.map((regionIndex) => (
            <span key={regionIndex} />
          ))}
        </div>
        <div className="mapCanvasMessage">
          <p id="map-placeholder-title">아직 채워진 지역이 없어요</p>
          <span>첫 번째 여행 사진으로 지도를 시작해 보세요.</span>
          <Link className="primaryAction" href="/record/new">
            첫 지역 채우기
          </Link>
        </div>
      </section>
    </main>
  );
}
