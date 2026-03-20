"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const COLORS = [
  "#ff0080", "#ff4500", "#ffd700", "#00e676",
  "#00bcd4", "#7c4dff", "#ff6ec7", "#18ffff",
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function RainbowNavItem({ href }: { href: string }) {
  const containerRef = useRef<HTMLAnchorElement>(null);

  // React state 없이 DOM 직접 조작 → re-render 없음
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const addSparkle = () => {
      const { width, height } = container.getBoundingClientRect();
      const el = document.createElement("span");
      el.textContent = "✦";
      el.style.cssText = `
        position: absolute;
        left: ${randomBetween(0, width)}px;
        top: ${randomBetween(0, height)}px;
        color: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        font-size: ${randomBetween(6, 14)}px;
        transform: translate(-50%, -50%);
        animation: sparkle-pop 0.7s ease-out forwards;
        pointer-events: none;
        z-index: 50;
        line-height: 1;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };

    const interval = setInterval(addSparkle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href={href}
      ref={containerRef}
      className="relative inline-block select-none"
      style={{ textDecoration: "none" }}
    >
      <span className="rainbow-text-animated">금향포도</span>
    </Link>
  );
}
