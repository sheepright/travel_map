const KOREA_TIME_ZONE = "Asia/Seoul";

export default function getCurrentKoreanYear(referenceDate = new Date()) {
  const yearPart = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KOREA_TIME_ZONE,
    year: "numeric",
  })
    .formatToParts(referenceDate)
    .find((part) => part.type === "year");

  if (!yearPart) {
    throw new Error("현재 연도를 계산할 수 없습니다.");
  }

  return Number(yearPart.value);
}
