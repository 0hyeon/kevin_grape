"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

// 이미지 7장 + 각 위치/크기 설정 (레퍼런스 SCSS 값 그대로)
const pictures = [
  {
    src: "/images/gumhang_pc.jpg",
    scaleMultiplier: 4,
    style: {
      // 1번: 중앙 기본
      width: "25vw",
      height: "25vh",
    },
  },
  {
    src: "/images/shooting_pc.jpg",
    scaleMultiplier: 5,
    style: {
      top: "-30vh",
      left: "5vw",
      width: "35vw",
      height: "30vh",
    },
  },
  {
    src: "/images/middle_banner_5.jpg",
    scaleMultiplier: 6,
    style: {
      top: "-10vh",
      left: "-25vw",
      width: "20vw",
      height: "45vh",
    },
  },
  {
    src: "/images/gumhang_mo.jpg",
    scaleMultiplier: 5,
    style: {
      left: "27.5vw",
      width: "25vw",
      height: "25vh",
    },
  },
  {
    src: "/images/shooting_mo.jpg",
    scaleMultiplier: 6,
    style: {
      top: "27.5vh",
      left: "5vw",
      width: "20vw",
      height: "25vh",
    },
  },
  {
    src: "/images/grape_test.png",
    scaleMultiplier: 8,
    style: {
      top: "27.5vh",
      left: "-22.5vw",
      width: "30vw",
      height: "25vh",
    },
  },
  {
    src: "/images/middle_banner_1.png",
    scaleMultiplier: 9,
    style: {
      top: "22.5vh",
      left: "25vw",
      width: "15vw",
      height: "15vh",
    },
  },
];

// 모바일: 중앙 이미지 1장만 심플하게
const mobilePictures = [
  { src: "/images/gumhang_pc.jpg", scaleMultiplier: 4 },
  { src: "/images/shooting_pc.jpg", scaleMultiplier: 6 },
  { src: "/images/grape_test.png", scaleMultiplier: 8 },
];

export default function ZoomParallax() {
  return (
    <>
      {/* PC */}
      <div className="hidden md:block">
        <ZoomParallaxPC />
      </div>
      {/* 모바일 */}
      <div className="block md:hidden">
        <ZoomParallaxMobile />
      </div>
    </>
  );
}

function ZoomParallaxPC() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div
      ref={container}
      style={{ height: "300vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {pictures.map(({ src, style }, index) => (
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
            }}
          >
            <div
              style={{
                position: "relative",
                width: style.width ?? "25vw",
                height: style.height ?? "25vh",
                top: style.top ?? undefined,
                left: style.left ?? undefined,
              }}
            >
              <Image
                src={src}
                fill
                alt={`parallax-${index}`}
                style={{ objectFit: "cover" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ZoomParallaxMobile() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);

  const scales = [scale4, scale6, scale8];

  return (
    <div style={{ height: "300vh", position: "relative" }}>
      <div
        ref={container}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {mobilePictures.map(({ src }, index) => (
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
            }}
          >
            <div
              style={{
                position: "relative",
                width: "80vw",
                height: "40vh",
              }}
            >
              <Image
                src={src}
                fill
                alt={`parallax-mo-${index}`}
                style={{ objectFit: "cover" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
