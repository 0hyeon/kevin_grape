"use client";

import { useRef, useState, useEffect } from "react";
import { useAnimationFrame } from "framer-motion";
import { Black_Han_Sans } from "next/font/google";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
});

const SPEED = 90; // px/s — 일정한 속도 보장

const text = "Kevin Grape ✦ 포장재 전문몰 ✦ 에어캡봉투 ✦ 보냉봉투 ✦ 라미봉투 ✦ ";

// 텍스트 3D 입체 그림자
const textShadow =
  "1px 1px 0 #c8c8c8, 2px 2px 0 #b8b8b8, 3px 3px 0 #a8a8a8, 4px 4px 0 #989898, 5px 5px 10px rgba(0,0,0,0.18)";

function Marquee({ fontSize }: { fontSize: number }) {
  const xRef = useRef(0);
  const widthRef = useRef(0);
  const directionRef = useRef(-1);
  const lastScrollY = useRef(0);
  const firstRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      directionRef.current = y > lastScrollY.current ? -1 : 1;
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useAnimationFrame((_, delta) => {
    const first = firstRef.current;
    const second = secondRef.current;
    if (!first || !second) return;

    // 최초 1회 실제 너비 캐싱 (display:none이면 0 → 스킵)
    if (widthRef.current === 0) {
      widthRef.current = first.offsetWidth;
    }
    const w = widthRef.current;
    if (w === 0) return;

    // delta(ms) 기반으로 일정한 픽셀 속도 보장
    xRef.current += (delta / 1000) * SPEED * directionRef.current;

    // 시음리스 루프
    if (xRef.current <= -w) xRef.current += w;
    else if (xRef.current >= 0) xRef.current -= w;

    const t = `translateX(${xRef.current}px)`;
    first.style.transform = t;
    second.style.transform = t;
  });

  return (
    <div className="relative whitespace-nowrap">
      <span
        ref={firstRef}
        className={`inline-block font-normal tracking-wide ${blackHanSans.className}`}
        style={{ fontSize, textShadow }}
      >
        {text}
      </span>
      <span
        ref={secondRef}
        className={`absolute left-full top-0 inline-block font-normal tracking-wide ${blackHanSans.className}`}
        style={{ fontSize, textShadow }}
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
        <Marquee fontSize={68} />
      </div>
      {/* 모바일 */}
      <div className="block md:hidden py-4">
        <Marquee fontSize={28} />
      </div>
    </div>
  );
}
