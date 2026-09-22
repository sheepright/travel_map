type RouteSkeletonProps = {
  description: string;
  eyebrow: string;
  title: string;
};

const ROUTE_ILLUSTRATION_CLASS_NAMES = [
  "inset-[0_4.5rem_3rem_0]",
  "inset-[1.2rem_0_1rem_5.2rem] bg-secondary",
  "inset-[4rem_5.5rem_0_2.3rem] bg-accent",
] as const;

export default function RouteSkeleton({
  description,
  eyebrow,
  title,
}: RouteSkeletonProps) {
  return (
    <main className="grid gap-6 md:gap-8">
      <section className="max-w-[38rem]">
        <p className="mb-2 font-display text-caption font-bold tracking-[0.09em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="m-0 font-display text-[clamp(2rem,5vw,var(--font-size-display))] leading-tight font-bold tracking-[-0.045em]">
          {title}
        </h1>
        <p className="mt-3 text-body text-text-secondary md:text-body-large">
          {description}
        </p>
      </section>
      <section
        className="grid min-h-[22rem] place-items-center content-center gap-6 rounded-lg border border-border bg-surface/75 p-6 text-center text-text-secondary md:min-h-[26rem] md:p-0"
        aria-label={`${title} 준비 상태`}
      >
        <div className="relative h-32 w-44" aria-hidden="true">
          {ROUTE_ILLUSTRATION_CLASS_NAMES.map((className) => (
            <span
              className={`absolute rounded-[42%_58%_53%_47%] border border-primary/25 bg-primary-soft ${className}`}
              key={className}
            />
          ))}
        </div>
        <p>이 화면의 핵심 기능을 차례대로 채우고 있어요.</p>
      </section>
    </main>
  );
}
