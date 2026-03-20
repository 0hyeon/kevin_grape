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
  "#ff0080", "#ff4500", "#ffd700", "#00e676",
  "#00bcd4", "#7c4dff", "#ff6ec7", "#18ffff",
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function RainbowMarqueeWord() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // 치수 한 번만 계산
    const { width, height } = container.getBoundingClientRect();

    const addSparkle = () => {
      const el = document.createElement("span");
      el.textContent = "✦";
      el.style.cssText = `
        position: absolute;
        left: ${randomBetween(0, width)}px;
        top: ${randomBetween(-4, height + 4)}px;
        color: ${SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]};
        font-size: ${randomBetween(6, 14)}px;
        transform: translate(-50%, -50%);
        animation: sparkle-pop 0.7s ease-out forwards;
        pointer-events: none;
        z-index: 10;
        line-height: 1;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };

    const interval = setInterval(addSparkle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span ref={ref} className="rainbow-text-static" style={{ position: "relative", display: "inline-block" }}>
      금향포도
    </span>
  );
}

function MarqueeContent() {
  return (
    <span className="text-[28px] md:text-[68px]" style={{ paddingRight: "3rem", whiteSpace: "nowrap", textShadow }}>
      {BEFORE}
      <RainbowMarqueeWord />
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
