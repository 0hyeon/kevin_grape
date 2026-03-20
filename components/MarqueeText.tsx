"use client";

import { useEffect, useRef, useState } from "react";
import { Black_Han_Sans } from "next/font/google";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap", // FOUT 방지 — 폰트 로드 전 fallback 텍스트 표시
});

const text =
  "Kevin Grape ✦ 포장재 전문몰 ✦ 에어캡봉투 ✦ 보냉봉투 ✦ 라미봉투 ✦ ";

const textShadow =
  "1px 1px 0 #c8c8c8, 2px 2px 0 #b8b8b8, 3px 3px 0 #a8a8a8, 4px 4px 0 #989898, 5px 5px 10px rgba(0,0,0,0.18)";

// CSS animation 기반 마퀴 — 컴포지터 스레드에서 실행 (JS 부하와 무관하게 60fps 유지)
function MarqueeTrack({ fontSize }: { fontSize: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleScroll = () => {
      const y = window.scrollY;
      // 스크롤 방향에 따라 애니메이션 방향 전환
      el.style.animationDirection =
        y > lastScrollY.current ? "normal" : "reverse";
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={trackRef}
      className={`marquee-track ${blackHanSans.className}`}
      style={{ willChange: "transform" }}
    >
      <span style={{ fontSize, textShadow, paddingRight: "3rem", whiteSpace: "nowrap" }}>
        {text}
      </span>
      <span
        style={{ fontSize, textShadow, paddingRight: "3rem", whiteSpace: "nowrap" }}
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
}

export default function MarqueeText() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="overflow-hidden select-none bg-white border-y border-gray-100">
      {/* PC */}
      <div className="hidden md:block py-6">
        <MarqueeTrack fontSize={68} />
      </div>
      {/* 모바일 */}
      <div className="block md:hidden py-4">
        <MarqueeTrack fontSize={28} />
      </div>
    </div>
  );
}
