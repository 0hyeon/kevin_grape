"use server";

import dynamic from "next/dynamic";
import Best from "@/components/Best";
import Footer from "@/components/Footer";
import Tabs from "@/components/Tab";
import HashTag from "@/components/hashtag";
import { slideData } from "@/static/data";
import { getCachedProducts } from "./products/[id]/page";
import MarqueeText from "@/components/MarqueeText";

const Slide = dynamic(() => import("@/components/slide"), { ssr: false });
const SlideSmall = dynamic(() => import("@/components/slideSmall"), { ssr: false });
const BestItem = dynamic(() => import("@/components/BestItem"), { ssr: false });

export default async function Home() {
  const items = await getCachedProducts();
  // await new Promise((resolve) => setTimeout(resolve, 3600000));
  return (
    <>
      <main>
        <Slide />
        <MarqueeText />
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
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full my-14 md:mt-[100px] md:mb-0"
          >
            <source src="/images/mukbank_cut.mp4" type="video/mp4" />
          </video>
          {/* <SlideSmall /> */}
        </div>
      </main>
      <div className="mt-4 w-full mx-auto my-0 border-t-[1px] border-b-[1px] border-t-[#efefef] border-b-[#efefef] bg-[#f9fafb]">
        <Footer />
      </div>
    </>
  );
}
