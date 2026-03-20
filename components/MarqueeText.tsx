"use client";

import { useEffect, useRef } from "react";
import { Black_Han_Sans } from "next/font/google";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const textShadow =
  "1px 1px 0 #c8c8c8, 2px 2px 0 #b8b8b8, 3px 3px 0 #a8a8a8, 4px 4px 0 #989898, 5px 5px 10px rgba(0,0,0,0.18)";

const BEFORE = "Kevin Grape ✦ 슈팅스타포도 ✦ ";
const AFTER = " ✦ 샤인머스켓 ✦ 안성머루포도 ✦ ";

const SPARKLE_COLORS = [
  "#ff0080","#ff4500","#ffd700","#00e676",
  "#00bcd4","#7c4dff","#ff6ec7","#18ffff",
];

// 미리 고정 생성 — 렌더 중 DOM 변경 없음
const SPARKLES = [
  { x: "5%",  y: "10%",  color: SPARKLE_COLORS[0], size: 14, delay: "0s",    dur: "1.6s" },
  { x: "18%", y: "70%",  color: SPARKLE_COLORS[1], size: 18, delay: "0.3s",  dur: "2.0s" },
  { x: "32%", y: "15%",  color: SPARKLE_COLORS[2], size: 22, delay: "0.6s",  dur: "1.4s" },
  { x: "47%", y: "65%",  color: SPARKLE_COLORS[3], size: 16, delay: "0.9s",  dur: "1.8s" },
  { x: "60%", y: "10%",  color: SPARKLE_COLORS[4], size: 20, delay: "0.2s",  dur: "2.2s" },
  { x: "72%", y: "75%",  color: SPARKLE_COLORS[5], size: 14, delay: "0.7s",  dur: "1.5s" },
  { x: "85%", y: "10%",  color: SPARKLE_COLORS[6], size: 24, delay: "0.4s",  dur: "1.9s" },
  { x: "95%", y: "60%",  color: SPARKLE_COLORS[7], size: 16, delay: "1.0s",  dur: "1.7s" },
];

function MarqueeContent() {
  return (
    <span
      className="text-[28px] md:text-[68px]"
      style={{ paddingRight: "3rem", whiteSpace: "nowrap", textShadow }}
    >
      {BEFORE}
      <span className="rainbow-text-animated" style={{ textShadow: "none", position: "relative" }}>
        금향포도
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              color: s.color,
              fontSize: s.size,
              lineHeight: 1,
              animation: `sparkle-loop ${s.dur} ${s.delay} ease-in-out infinite`,
              pointerEvents: "none",
            }}
          >
            ✦
          </span>
        ))}
      </span>
      {AFTER}
    </span>
  );
}

function MarqueeTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handleScroll = () => {
      const y = window.scrollY;
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
      <MarqueeContent />
      <span aria-hidden="true">
        <MarqueeContent />
      </span>
    </div>
  );
}

export default function MarqueeText() {
  return (
    <div className="overflow-hidden select-none bg-white border-y border-gray-100">
      <div className="py-4 md:py-6">
        <MarqueeTrack />
      </div>
    </div>
  );
}
