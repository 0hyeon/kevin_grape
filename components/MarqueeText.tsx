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

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  life: number; // 1 → 0
  vy: number;
}

function RainbowMarqueeWord() {
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const text = textRef.current;
    const canvas = canvasRef.current;
    if (!text || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PAD = 20;
    const { width, height } = text.getBoundingClientRect();
    canvas.width = width + PAD * 2;
    canvas.height = height + PAD * 2;

    const particles: Particle[] = [];

    const addParticle = () => {
      particles.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        size: randomBetween(14, 26),
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        life: 1,
        vy: -randomBetween(0.8, 2),
      });
    };

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.025;
        p.y += p.vy;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px serif`;
        ctx.fillText("✦", p.x + PAD, p.y + PAD);
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    const intervalId = setInterval(addParticle, 180);
    rafId = requestAnimationFrame(draw);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span ref={textRef} className="rainbow-text-static">금향포도</span>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: -20,
          left: -20,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
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
  const posRef = useRef(0);       // 현재 위치 (0 ~ -50%)
  const dirRef = useRef(1);       // 1 = 왼쪽, -1 = 오른쪽
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    el.style.animation = "none";
    let rafId: number;

    const tick = () => {
      posRef.current -= dirRef.current * 0.025;
      if (posRef.current <= -50) posRef.current += 50;
      if (posRef.current >= 0)   posRef.current -= 50;
      el.style.transform = `translateX(${posRef.current}%)`;
      rafId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const y = window.scrollY;
      dirRef.current = y >= lastScrollY.current ? 1 : -1;
      lastScrollY.current = y;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
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
