"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

/* ─── PC ─────────────────────────────────────────────── */
const PC_SRCS = [
  "/images/parell_1.jpeg",
  "/images/parell_2.jpeg",
  "/images/parell_3.jpg",
  "/images/parell_4.jpeg",
  "/images/parell_5.jpeg",
  "/images/parell_6.jpeg",
  "/images/parell_8.jpeg",
];

const PC_ITEMS: {
  scaleRange: [number, number];
  style: { top?: string; left?: string; width: string; height: string };
}[] = [
  { scaleRange: [1, 4], style: {                              width: "18vw", height: "32vh" } },
  { scaleRange: [1, 5], style: { top: "-28vh", left: "5vw",  width: "22vw", height: "40vh" } },
  { scaleRange: [1, 6], style: { top: "-8vh",  left: "-22vw",width: "15vw", height: "42vh" } },
  { scaleRange: [1, 5], style: {               left: "25vw", width: "18vw", height: "32vh" } },
  { scaleRange: [1, 6], style: { top: "25vh",  left: "5vw",  width: "16vw", height: "28vh" } },
  { scaleRange: [1, 8], style: { top: "25vh",  left: "-20vw",width: "20vw", height: "34vh" } },
  { scaleRange: [1, 9], style: { top: "20vh",  left: "22vw", width: "13vw", height: "22vh" } },
];

/* ─── Mobile ─────────────────────────────────────────── */
const MO_SRCS = [
  "/images/parell_1.jpeg",
  "/images/parell_8.jpeg",
  "/images/parell_4.jpeg",
];

const MO_ITEMS: {
  scaleRange: [number, number];
  top: string;
  left?: string;
  width: string;
  height: string;
}[] = [
  { scaleRange: [1, 4], top: "0vh",   width: "60vw", height: "45vh" },
  { scaleRange: [1, 6], top: "-18vh", left: "-20vw", width: "50vw", height: "38vh" },
  { scaleRange: [1, 8], top: "18vh",  left: "18vw",  width: "45vw", height: "35vh" },
];

/* ─── PC Component ───────────────────────────────────── */
function ZoomParallaxPC() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scales = PC_ITEMS.map((item) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, [0, 1], item.scaleRange)
  );

  return (
    <div ref={container} style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {PC_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            style={{
              scale: scales[i],
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: item.style.width,
                height: item.style.height,
                top: item.style.top,
                left: item.style.left,
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
                sizes="(max-width: 768px) 0vw, 35vw"
                priority={i === 0}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mobile Component ───────────────────────────────── */
function ZoomParallaxMobile() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scales = MO_ITEMS.map((item) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, [0, 1], item.scaleRange)
  );

  return (
    <div ref={container} style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {MO_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            style={{
              scale: scales[i],
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: item.width,
                height: item.height,
                top: item.top,
                left: item.left,
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
                sizes="70vw"
                priority={i === 0}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Export ─────────────────────────────────────────── */
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
