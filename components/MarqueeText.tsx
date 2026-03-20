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
const RAINBOW = "금향포도";
const AFTER = " ✦ 샤인머스켓 ✦ 안성머루포도 ✦ ";

function MarqueeContent() {
  return (
    <span className="text-[28px] md:text-[68px]" style={{ paddingRight: "3rem", whiteSpace: "nowrap", textShadow }}>
      {BEFORE}
      <span className="rainbow-text-static">{RAINBOW}</span>
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
