"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// PC 이미지 소스
const PC_SRCS = [
  "/images/parell_1.jpeg",
  "/images/parell_2.jpeg",
  "/images/parell_3.jpg",
  "/images/parell_4.jpeg",
  "/images/parell_5.jpeg",
  "/images/parell_6.jpeg",
  "/images/parell_8.jpeg",
];

// PC 레이아웃: 세로 사진 기준으로 컨테이너 비율 조정 (height > width)
const PC_ITEMS = [
  { scaleEnd: 4, style: {                              width: "18vw", height: "32vh" } },
  { scaleEnd: 5, style: { top: "-28vh", left: "5vw",  width: "22vw", height: "40vh" } },
  { scaleEnd: 6, style: { top: "-8vh",  left: "-22vw",width: "15vw", height: "42vh" } },
  { scaleEnd: 5, style: {               left: "25vw", width: "18vw", height: "32vh" } },
  { scaleEnd: 6, style: { top: "25vh",  left: "5vw",  width: "16vw", height: "28vh" } },
  { scaleEnd: 8, style: { top: "25vh",  left: "-20vw",width: "20vw", height: "34vh" } },
  { scaleEnd: 9, style: { top: "20vh",  left: "22vw", width: "13vw", height: "22vh" } },
];

// 모바일 이미지 소스
const MO_SRCS = [
  "/images/parell_1.jpeg",
  "/images/parell_8.jpeg",
  "/images/parell_4.jpeg",
];

// 모바일: 세로 비율 컨테이너
const MO_ITEMS = [
  { scaleEnd: 4, top: "0vh",   width: "60vw", height: "45vh" },
  { scaleEnd: 6, top: "-18vh", width: "50vw", height: "38vh" },
  { scaleEnd: 8, top: "18vh",  width: "45vw", height: "35vh" },
];

export default function ZoomParallax() {
  return (
    <>
      <div className="hidden md:block">
        <ZoomParallaxPC />
      </div>
      <div className="block md:hidden">
        <ZoomParallaxMobile />
      </div>
    </>
  );
}

function ZoomParallaxPC() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    let rafId: number;
    let current = 0;   // 현재 보간 진행값 (0~1)
    let target = 0;    // 목표 스크롤 진행값 (0~1)

    const onScroll = () => {
      const rect = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      target = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    };

    const tick = () => {
      // lerp: 부드럽게 목표값 추종, 연산 최소화
      current += (target - current) * 0.07;

      const children = sticky.children;
      for (let i = 0; i < PC_ITEMS.length; i++) {
        const scale = 1 + (PC_ITEMS[i].scaleEnd - 1) * current;
        (children[i] as HTMLElement).style.transform = `scale(${scale.toFixed(4)})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={outerRef} style={{ height: "300vh", position: "relative" }}>
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          contain: "strict",
        }}
      >
        {PC_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: item.style.width,
                height: item.style.height,
                top: (item.style as { top?: string }).top,
                left: (item.style as { left?: string }).left,
                borderRadius: "6px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={PC_SRCS[i]}
                fill
                alt={`parallax-${i}`}
                style={{ objectFit: "cover", objectPosition: "center" }}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 0vw, 35vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZoomParallaxMobile() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    let rafId: number;
    let current = 0;
    let target = 0;

    const onScroll = () => {
      const rect = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      target = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    };

    const tick = () => {
      current += (target - current) * 0.07;

      const children = sticky.children;
      for (let i = 0; i < MO_ITEMS.length; i++) {
        const scale = 1 + (MO_ITEMS[i].scaleEnd - 1) * current;
        (children[i] as HTMLElement).style.transform = `scale(${scale.toFixed(4)})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={outerRef} style={{ height: "300vh", position: "relative" }}>
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          contain: "strict",
        }}
      >
        {MO_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: item.width,
                height: item.height,
                top: item.top,
                borderRadius: "8px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={MO_SRCS[i]}
                fill
                alt={`parallax-mo-${i}`}
                style={{ objectFit: "cover", objectPosition: "center" }}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="70vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
