"use client";

import { useEffect, useRef, useState } from "react";
import { Black_Han_Sans } from "next/font/google";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const textShadow =
  "1px 1px 0 #c8c8c8, 2px 2px 0 #b8b8b8, 3px 3px 0 #a8a8a8, 4px 4px 0 #989898, 5px 5px 10px rgba(0,0,0,0.18)";

// 반짝일 단어 + 일반 텍스트 세그먼트 정의
const SEGMENTS = [
  { text: "Kevin Grape",  sparkle: true,  delay: "0s"   },
  { text: " ✦ ",          sparkle: false               },
  { text: "슈팅스타포도",  sparkle: true,  delay: "1.3s" },
  { text: " ✦ ",          sparkle: false               },
  { text: "금향포도",      sparkle: true,  delay: "2.6s" },
  { text: " ✦ 샤인머스켓 ✦ 안성머루포도 ✦ ", sparkle: false },
];

// 마퀴 한 카피 콘텐츠 (반짝이 포함)
function MarqueeContent({ fontSize }: { fontSize: number }) {
  return (
    <span style={{ fontSize, paddingRight: "3rem", whiteSpace: "nowrap" }}>
      {SEGMENTS.map((seg, i) =>
        seg.sparkle ? (
          <span
            key={i}
            className="sparkle-word"
            style={{ animationDelay: seg.delay }}
          >
            {seg.text}
          </span>
        ) : (
          <span key={i} style={{ textShadow }}>
            {seg.text}
          </span>
        )
      )}
    </span>
  );
}

function MarqueeTrack({ fontSize }: { fontSize: number }) {
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
      <MarqueeContent fontSize={fontSize} />
      {/* 무한 루프용 복사본 */}
      <span aria-hidden="true">
        <MarqueeContent fontSize={fontSize} />
      </span>
    </div>
  );
}

export default function MarqueeText() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="overflow-hidden select-none bg-white border-y border-gray-100">
      <div className="hidden md:block py-6">
        <MarqueeTrack fontSize={68} />
      </div>
      <div className="block md:hidden py-4">
        <MarqueeTrack fontSize={28} />
      </div>
    </div>
  );
}
