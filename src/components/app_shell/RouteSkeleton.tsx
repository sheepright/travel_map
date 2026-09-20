type RouteSkeletonProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export default function RouteSkeleton({
  description,
  eyebrow,
  title,
}: RouteSkeletonProps) {
  return (
    <main className="routePage">
      <section className="routeIntro">
        <p className="routeEyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <section className="routePlaceholder" aria-label={`${title} 준비 상태`}>
        <div className="routePlaceholderIllustration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>이 화면의 핵심 기능을 차례대로 채우고 있어요.</p>
      </section>
    </main>
  );
}
