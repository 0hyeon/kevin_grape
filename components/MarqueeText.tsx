"use client";

import { useEffect, useRef } from "react";
import { Black_Han_Sans } from "next/font/google";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

type SegmentType = "kevin" | "shooting" | "gold" | null;

const SEGMENTS: { text: string; type: SegmentType }[] = [
  { text: "Kevin Grape",  type: "kevin"    },
  { text: " ✦ ",          type: null       },
  { text: "슈팅스타포도",  type: "shooting" },
  { text: " ✦ ",          type: null       },
  { text: "금향포도",      type: "gold"     },
  { text: " ✦ 샤인머스켓 ✦ 안성머루포도 ✦ ", type: null },
];

const plainShadow =
  "1px 1px 0 #c8c8c8, 2px 2px 0 #b8b8b8, 3px 3px 0 #a8a8a8, 4px 4px 0 #989898, 5px 5px 10px rgba(0,0,0,0.18)";

const CLASS_MAP: Record<NonNullable<SegmentType>, string> = {
  kevin:    "sparkle-kevin",
  shooting: "sparkle-shooting",
  gold:     "sparkle-gold",
};

function MarqueeContent({ fontSize }: { fontSize: number }) {
  return (
    <span style={{ fontSize, paddingRight: "3rem", whiteSpace: "nowrap" }}>
      {SEGMENTS.map((seg, i) =>
        seg.type ? (
          <span key={i} className={CLASS_MAP[seg.type]}>
            {seg.text}
          </span>
        ) : (
          <span key={i} style={{ textShadow: plainShadow }}>
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
      <span aria-hidden="true">
        <MarqueeContent fontSize={fontSize} />
      </span>
    </div>
  );
}

export default function MarqueeText() {
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
