"use client";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";

const SPARKLE_COUNT = 8;

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
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLAnchorElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  const handleMouseEnter = () => {
    setHovered(true);
    addSparkle();
    intervalRef.current = setInterval(addSparkle, 150);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    setShine({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  return (
    <Link
      href={href}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative inline-block select-none"
      style={{ textDecoration: "none" }}
    >
      {/* 무지개 텍스트 */}
      <span
        style={{
          background: hovered
            ? "linear-gradient(90deg, #ff0080, #ff4500, #ffd700, #00e676, #00bcd4, #7c4dff, #ff0080)"
            : "inherit",
          backgroundSize: hovered ? "200% auto" : undefined,
          WebkitBackgroundClip: hovered ? "text" : undefined,
          WebkitTextFillColor: hovered ? "transparent" : undefined,
          backgroundClip: hovered ? "text" : undefined,
          animation: hovered ? "rainbow-shift 1.2s linear infinite" : undefined,
          filter: hovered ? "drop-shadow(0 0 6px rgba(180,0,255,0.5))" : undefined,
          transition: "filter 0.3s",
          fontWeight: hovered ? 700 : undefined,
        }}
      >
        금향포도
      </span>

      {/* 마우스 따라다니는 shine */}
      {hovered && (
        <span
          className="absolute inset-0 pointer-events-none rounded"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.35) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* 스파클 */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            color: s.color,
            fontSize: s.size,
            transform: "translate(-50%, -50%)",
            animation: "sparkle-pop 0.7s ease-out forwards",
            zIndex: 50,
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
        @keyframes sparkle-pop {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
          50%  { opacity: 1; transform: translate(-50%, -100%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -150%) scale(0.8); }
        }
      `}</style>
    </Link>
  );
}
