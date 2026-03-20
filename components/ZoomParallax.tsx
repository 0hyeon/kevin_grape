"use client";

import { useRef } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import Image from "next/image";

// 스프링 설정 — 스크롤 값에 댐핑을 줘서 부드럽게 추종
const SPRING = { stiffness: 80, damping: 20, restDelta: 0.001 };

// PC: 7장 (레퍼런스 레이아웃 그대로, parell_1~7)
const pictures = [
  { src: "/images/parell_1.jpeg", scaleEnd: 4, style: { width: "25vw",  height: "25vh" } },
  { src: "/images/parell_2.jpeg", scaleEnd: 5, style: { top: "-30vh",  left: "5vw",     width: "35vw", height: "30vh" } },
  { src: "/images/parell_3.jpeg", scaleEnd: 6, style: { top: "-10vh",  left: "-25vw",   width: "20vw", height: "45vh" } },
  { src: "/images/parell_4.jpeg", scaleEnd: 5, style: {                left: "27.5vw",  width: "25vw", height: "25vh" } },
  { src: "/images/parell_5.jpeg", scaleEnd: 6, style: { top: "27.5vh", left: "5vw",     width: "20vw", height: "25vh" } },
  { src: "/images/parell_6.jpeg", scaleEnd: 8, style: { top: "27.5vh", left: "-22.5vw", width: "30vw", height: "25vh" } },
  { src: "/images/parell_7.jpeg", scaleEnd: 9, style: { top: "22.5vh", left: "25vw",    width: "15vw", height: "15vh" } },
];

// 모바일: 화면 좁으므로 3장만, 중앙 정렬 + 세로 분산 배치
const mobilePictures = [
  { src: "/images/parell_1.jpeg", scaleEnd: 4, top: "0vh",    width: "80vw", height: "35vh" },
  { src: "/images/parell_8.jpeg", scaleEnd: 6, top: "-20vh",  width: "65vw", height: "30vh" },
  { src: "/images/parell_4.jpeg", scaleEnd: 8, top: "20vh",   width: "55vw", height: "28vh" },
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
  // ✅ ref는 반드시 outer(300vh) 컨테이너에
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // ✅ useSpring: 스크롤 값에 댐핑을 줘서 뚝뚝 끊기는 느낌 제거
  const smoothProgress = useSpring(scrollYProgress, SPRING);

  const scale4 = useTransform(smoothProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(smoothProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(smoothProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(smoothProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(smoothProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          // ✅ contain: 이 영역 밖 레이아웃/페인트에 영향 안 줌 → 브라우저 최적화
          contain: "layout style",
        }}
      >
        {pictures.map(({ src, style, scaleEnd }, index) => (
          <motion.div
            key={index}
            style={{
              scale: scales[index],
              width: "100%",
              height: "100%",
              top: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // ✅ 명시적 GPU 레이어 승격
              willChange: "transform",
            }}
          >
            <div
              style={{
                position: "relative",
                width: style.width ?? "25vw",
                height: style.height ?? "25vh",
                top: (style as { top?: string }).top ?? undefined,
                left: (style as { left?: string }).left ?? undefined,
              }}
            >
              <Image
                src={src}
                fill
                alt={`parallax-${index}`}
                style={{ objectFit: "cover" }}
                // ✅ 첫 장만 즉시 로드, 나머지 lazy
                loading={index === 0 ? "eager" : "lazy"}
                sizes="35vw"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ZoomParallaxMobile() {
  // ✅ ref는 outer(300vh) 컨테이너에 (이전 코드 버그 수정)
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING);

  const scale4 = useTransform(smoothProgress, [0, 1], [1, 4]);
  const scale6 = useTransform(smoothProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(smoothProgress, [0, 1], [1, 8]);

  const scales = [scale4, scale6, scale8];

  return (
    // ✅ ref 위치 수정: outer container
    <div ref={container} style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          contain: "layout style",
        }}
      >
        {mobilePictures.map(({ src, top, width, height }, index) => (
          <motion.div
            key={index}
            style={{
              scale: scales[index],
              width: "100%",
              height: "100%",
              top: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
            }}
          >
            <div style={{ position: "relative", width, height, top }}>
              <Image
                src={src}
                fill
                alt={`parallax-mo-${index}`}
                style={{ objectFit: "cover", borderRadius: "8px" }}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="80vw"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
