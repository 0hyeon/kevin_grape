"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { opacity } from "./anim";
import Image from "next/image";
import Nav from "./nav";

export default function Header({ cartcount }: any) {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // fetchCartCount 함수 정의
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize); // 창 크기 변경 이벤트 등록

    return () => {
      window.removeEventListener("resize", handleResize); // 이벤트 제거
    };
  }, []);
  return (
    <div className="max-w-[1100px] my-0 mx-auto relative">
      <div className="z-20 relative bg-white md:bg-inherit flex items-center justify-center md:justify-between ">
        <div
          className="cursor-pointer hidden md:block"
          onClick={() => alert("준비중입니다.")}
        >
          <div className="w-[270px] h-[48px]"></div>
          {/* <Image
            src={``}
            width={270}
            height={48}
            alt=""
          /> */}
        </div>
        <Link href="/" className="">
          <Image
            src={`/images/kevin_logo.jpg`}
            alt="logoImage"
            width={300} // 기본 원본 비율 제공
            height={100} // 기본 원본 비율 제공
            className="w-[180px] md:w-[300px] h-auto"
          />
        </Link>
        {!isMobile && (
          <motion.div
            variants={opacity}
            animate={!isActive ? "open" : "closed"}
            className="pr-2 md:pr-0 md:w-[270px] flex flex-col justify-center items-end md:static absolute right-1"
          >
            <Link href={"/cart"}>
              <div className="flex gap-[10px]">
                <svg
                  width="19"
                  height="20"
                  viewBox="0 0 19 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z"
                    stroke="#4D3D30"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <p className="text-sm">Cart({cartcount ? cartcount : 0})</p>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
      <div className="z-50 md:z-0 flex justify-end md:justify-around  text-[#111]  mr-2 md:static absolute top-[50%] right-0 -translate-y-1/2 md:-translate-y-0">
        {isMobile ? (
          <div
            onClick={() => setIsActive(!isActive)}
            className="flex items-center justify-center cursor-pointer"
          >
            <div className="relative w-8 h-6 ml-3">
              {/* 첫 번째 바 */}
              <motion.div
                initial={false}
                animate={isActive ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="absolute top-0 left-0 w-7 h-[2px] bg-gray-600 rounded"
                transition={{ duration: 0.3 }}
              />
              {/* 두 번째 바 */}
              <motion.div
                initial={false}
                animate={isActive ? { opacity: 0 } : { opacity: 1 }}
                className="absolute top-2 left-0 w-7 h-[2px] bg-gray-600 rounded"
                transition={{ duration: 0.3 }}
              />
              {/* 세 번째 바 */}
              <motion.div
                initial={false}
                animate={
                  isActive ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                className="absolute top-4 left-0 w-7 h-[2px] bg-gray-600 rounded"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              <Link href={"/productlist/lame"}>슈팅스타</Link>
            </div>
            <div>
              <Link href={"/productlist/eunbak"}>샤인머스켓</Link>
            </div>
            <div>
              <Link href={"/productlist/aircap"}>에어캡봉투</Link>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => alert("준비중입니다.")}
            >
              발포시트지
            </div>
            <div
              className="cursor-pointer"
              onClick={() => alert("준비중입니다.")}
            >
              이벤트/혜택
            </div>
            <div
              className="cursor-pointer"
              onClick={() => alert("준비중입니다.")}
            >
              커뮤니티
            </div>
            <div
              className="cursor-pointer"
              onClick={() => alert("준비중입니다.")}
            >
              고객센터
            </div>
          </>
        )}
      </div>
      <AnimatePresence mode="wait">
        {isActive && <Nav cartcount={cartcount} setIsActive={setIsActive} />}
      </AnimatePresence>
    </div>
  );
}
