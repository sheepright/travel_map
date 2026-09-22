import PrimaryActionLink from "@/components/app_shell/PrimaryActionLink";
import getCurrentKoreanYear from "@/lib/date/getCurrentKoreanYear";

const REGION_PLACEHOLDERS = Array.from({ length: 17 }, (_, index) => index);

function getRegionPlaceholderClassName(regionIndex: number) {
  const classNames = [
    "min-h-20 rounded-[34%_66%_58%_42%/45%_40%_60%_55%] border border-primary/20 bg-[color-mix(in_srgb,var(--color-empty)_82%,var(--color-primary-soft))]",
  ];

  if ((regionIndex + 1) % 3 === 0) {
    classNames.push("translate-y-6");
  }

  if ((regionIndex + 1) % 4 === 0) {
    classNames.push(
      "-translate-y-4 bg-[color-mix(in_srgb,var(--color-empty)_70%,var(--color-secondary))]",
    );
  }

  return classNames.join(" ");
}

export default function MapPage() {
  const currentYear = getCurrentKoreanYear();

  return (
    <main className="grid gap-6 md:gap-8">
      <section className="grid gap-5 md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <p className="mb-2 font-display text-caption font-bold tracking-[0.09em] text-primary uppercase">
            {currentYear} TRAVEL MAP
          </p>
          <h1 className="m-0 font-display text-[clamp(2rem,5vw,var(--font-size-display))] leading-tight font-bold tracking-[-0.045em]">
            올해의 지도를 채워보세요
          </h1>
          <p className="mt-3 text-body text-text-secondary md:text-body-large">
            사진 한 장으로 다녀온 지역의 기억을 남길 수 있어요.
          </p>
        </div>
        <div
          className="w-full rounded-lg border border-border bg-surface p-4 md:w-52 md:flex-none"
          aria-label="지도 완성도 17개 지역 중 0개"
        >
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>지도 완성도</span>
            <strong className="font-display text-base">0 / 17</strong>
          </div>
          <span
            className="mt-3 block h-1.5 overflow-hidden rounded-full bg-empty"
            aria-hidden="true"
          >
            <span className="block h-full w-0 bg-primary" />
          </span>
        </div>
      </section>

      <section
        className="relative grid min-h-[27rem] place-items-center overflow-hidden rounded-lg border border-border [background:linear-gradient(rgb(255_255_255_/_76%),rgb(255_255_255_/_76%)),repeating-linear-gradient(0deg,transparent_0_2rem,rgb(57_121_198_/_6%)_2rem_calc(2rem+1px)),repeating-linear-gradient(90deg,transparent_0_2rem,rgb(57_121_198_/_6%)_2rem_calc(2rem+1px)),var(--color-primary-soft)] md:min-h-[35rem]"
        aria-labelledby="map-placeholder-title"
      >
        <div
          className="absolute inset-[4%_-22%_16%_-32%] grid rotate-[-3deg] scale-[0.86] grid-cols-5 content-center gap-2 opacity-80 md:inset-[8%_8%_10%] md:rotate-[-2deg] md:scale-100"
          aria-hidden="true"
        >
          {REGION_PLACEHOLDERS.map((regionIndex) => (
            <span
              className={getRegionPlaceholderClassName(regionIndex)}
              key={regionIndex}
            />
          ))}
        </div>
        <div className="relative z-2 flex w-[calc(100%-2rem)] max-w-96 flex-col items-center rounded-lg border border-border/90 bg-surface/90 p-6 text-center shadow-elevation-1 backdrop-blur-lg md:w-auto md:p-8">
          <p
            className="m-0 font-display text-heading-3 font-bold"
            id="map-placeholder-title"
          >
            아직 채워진 지역이 없어요
          </p>
          <span className="mt-2 mb-5 text-text-secondary">
            첫 번째 여행 사진으로 지도를 시작해 보세요.
          </span>
          <PrimaryActionLink href="/record/new">
            첫 지역 채우기
          </PrimaryActionLink>
        </div>
      </section>
    </main>
  );
}
