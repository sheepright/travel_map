export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f1] px-6 py-16 text-[#1d2a22]">
      <section className="w-full max-w-2xl rounded-[2rem] border border-[#d9e1d8] bg-white p-8 shadow-[0_24px_80px_rgba(34,63,43,0.08)] sm:p-12">
        <p className="mb-4 text-sm font-bold tracking-[0.16em] text-[#557461]">
          FOUNDATION READY
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          여행 사진 지도
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#5e6b63]">
          Next.js App Router와 TypeScript 기반이 준비되었습니다. 다음 Task부터
          인증과 데이터 계층을 연결합니다.
        </p>
        <dl className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            ["Runtime", "Node.js 22"],
            ["Framework", "Next.js 16"],
            ["Data", "Supabase SSR"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-[#eef2ed] p-4">
              <dt className="text-xs font-bold uppercase tracking-wider text-[#688071]">
                {label}
              </dt>
              <dd className="mt-1 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
