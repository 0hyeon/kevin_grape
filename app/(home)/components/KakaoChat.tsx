"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const KakaoChat = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <Link
        href="http://pf.kakao.com/_yqxijK/chat"
        target="_blank"
        className="fixed z-[999] bottom-[6%] right-[4%] block w-16 h-16 mb-4"
      >
        <div className="relative w-full h-full">
          <Image
            src={`/images/kakao.png`}
            alt={"카카오상담"}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </Link>
    </>
  );
};

export default KakaoChat;
