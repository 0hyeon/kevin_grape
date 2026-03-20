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

const PC_STYLES = [
  {                              width: "18vw", height: "32vh" },
  { top: "-28vh", left: "5vw",  width: "22vw", height: "40vh" },
  { top: "-8vh",  left: "-22vw",width: "15vw", height: "42vh" },
  {               left: "25vw", width: "18vw", height: "32vh" },
  { top: "25vh",  left: "5vw",  width: "16vw", height: "28vh" },
  { top: "25vh",  left: "-20vw",width: "20vw", height: "34vh" },
  { top: "20vh",  left: "22vw", width: "13vw", height: "22vh" },
] as const;

/* ─── Mobile ─────────────────────────────────────────── */
const MO_SRCS = [
  "/images/parell_1.jpeg",
  "/images/parell_8.jpeg",
  "/images/parell_4.jpeg",
];

const MO_STYLES = [
  { top: "0vh",   left: undefined, width: "60vw", height: "45vh" },
  { top: "-18vh", left: "-20vw",   width: "50vw", height: "38vh" },
  { top: "18vh",  left: "18vw",    width: "45vw", height: "35vh" },
];

/* ─── PC Component ───────────────────────────────────── */
function ZoomParallaxPC() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Hooks must be at top-level — never inside .map()
  const s0 = useTransform(scrollYProgress, [0, 1], [1, 2]);
  const s1 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const s2 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const s3 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const s4 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const s5 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const s6 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [s0, s1, s2, s3, s4, s5, s6];

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
        {PC_STYLES.map((st, i) => (
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
                width: st.width,
                height: st.height,
                top: (st as { top?: string }).top,
                left: (st as { left?: string }).left,
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

  const m0 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const m1 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const m2 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scales = [m0, m1, m2];

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
        {MO_STYLES.map((st, i) => (
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
                width: st.width,
                height: st.height,
                top: st.top,
                left: st.left,
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
