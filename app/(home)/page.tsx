"use server";

import Best from "@/components/Best";
import BestItem from "@/components/BestItem";
import Footer from "@/components/Footer";
import Tabs from "@/components/Tab";
import HashTag from "@/components/hashtag";
import Slide from "@/components/slide";
import SlideSmall from "@/components/slideSmall";
import { slideData } from "@/static/data";
import { getCachedProducts } from "./products/[id]/page";
import Youtube from "@/components/Youtube";
import MarqueeText from "@/components/MarqueeText";
import dynamic from "next/dynamic";

// ZoomParallax: 스크롤해야 보이는 컴포넌트 → 초기 번들에서 분리해 첫 로딩 속도 개선
const ZoomParallax = dynamic(() => import("@/components/ZoomParallax"), {
  loading: () => <div style={{ height: "300vh" }} />, // 레이아웃 유지용 placeholder
});

export default async function Home() {
  const items = await getCachedProducts();
  // await new Promise((resolve) => setTimeout(resolve, 3600000));
  return (
    <>
      <main>
        <Slide />
        <MarqueeText />
        <ZoomParallax />
        <div className="max-w-[1000px] mx-auto my-0 px-4 sm:px-6 lg:px-8">
          <SlideSmall />
          {/* <Best data={slideData} /> */}
          <BestItem data={items} subtitle="all" title="전체상품" />
          <HashTag />
          <Tabs />

          {/* <Best data={slideData} /> */}

          <BestItem
            data={items.filter(
              (el) => el.productPicture?.category === "에어캡봉투"
            )}
            subtitle="완충효과 100%"
            title="에어캡봉투"
          />
          <BestItem
            data={items.filter(
              (el) => el.productPicture?.category === "보냉봉투"
            )}
            subtitle="온도유지"
            title="보냉봉투"
          />
          <BestItem
            data={items.filter(
              (el) => el.productPicture?.category === "라미봉투"
            )}
            subtitle="가성비ㆍ탁월한"
            title="라미봉투"
          />
          <Youtube url="https://youtu.be/GUOEoal_4ok?t=5" />
          {/* <SlideSmall /> */}
        </div>
      </main>
      <div className="mt-4 w-full mx-auto my-0 border-t-[1px] border-b-[1px] border-t-[#efefef] border-b-[#efefef] bg-[#f9fafb]">
        <Footer />
      </div>
    </>
  );
}
