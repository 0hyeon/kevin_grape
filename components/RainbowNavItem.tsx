"use client";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const COLORS = [
  "#ff0080", "#ff4500", "#ffd700", "#00e676",
  "#00bcd4", "#7c4dff", "#ff6ec7", "#18ffff",
];

export default function RainbowNavItem({ href }: { href: string }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const ref = useRef<HTMLAnchorElement>(null);
  const idRef = useRef(0);

  const addSparkle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const id = idRef.current++;
    const sparkle: Sparkle = {
      id,
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      size: randomBetween(6, 14),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setSparkles((prev) => [...prev, sparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 700);
  }, []);

  // 마운트되면 항상 스파클 실행
  useEffect(() => {
    const interval = setInterval(addSparkle, 300);
    return () => clearInterval(interval);
  }, [addSparkle]);

  return (
    <Link
      href={href}
      ref={ref}
      className="relative inline-block select-none"
      style={{ textDecoration: "none" }}
    >
      {/* 무지개 텍스트 — 항상 on */}
      <span
        style={{
          background: "linear-gradient(90deg, #ff0080, #ff4500, #ffd700, #00e676, #00bcd4, #7c4dff, #ff0080)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "rainbow-shift 1.2s linear infinite",
          filter: "drop-shadow(0 0 6px rgba(180,0,255,0.45))",
          fontWeight: 700,
          display: "inline-block",
        }}
      >
        금향포도
      </span>

      {/* 자동 sweep shine */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{ animation: "shine-sweep 2.5s ease-in-out infinite" }}
      />

      {/* 스파클 */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            color: s.color,
            fontSize: s.size,
            transform: "translate(-50%, -50%)",
            animation: "sparkle-pop 0.7s ease-out forwards",
            zIndex: 50,
            lineHeight: 1,
          }}
        >
          ✦
        </span>
      ))}

      <style>{`
        @keyframes rainbow-shift {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shine-sweep {
          0%   { background: radial-gradient(circle at 0% 50%, rgba(255,255,255,0.3) 0%, transparent 50%); }
          50%  { background: radial-gradient(circle at 100% 50%, rgba(255,255,255,0.3) 0%, transparent 50%); }
          100% { background: radial-gradient(circle at 0% 50%, rgba(255,255,255,0.3) 0%, transparent 50%); }
        }
        @keyframes sparkle-pop {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
          50%  { opacity: 1; transform: translate(-50%, -120%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -170%) scale(0.8); }
        }
      `}</style>
    </Link>
  );
}
