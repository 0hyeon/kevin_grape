"use client";
import React, { useState } from "react";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import { IProduct } from "@/types/type";
import GrapeSelect, { GrapeOption } from "@/components/grape-select";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

interface ProductDetailClientProps {
  product: IProduct & { src?: string; slideImages?: string[]; detailImages?: string[] };
}

interface SelectedItem extends GrapeOption {
  quantity: number;
}

const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTotal = product.slideImages?.length ?? 0;

  const handleSelect = (option: GrapeOption) => {
    setSelectedItems((prev) => [...prev, { ...option, quantity: 1 }]);
  };

  const handleQty = (id: number, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const detailImages = product.detailImages ?? ["/images/kevin_detail_page.jpg"];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 md:gap-[50px] max-w-[1100px] mx-auto border-b border-[#999] pb-10 md:pb-14">
        {/* 메인 이미지 */}
        <div className="w-full md:w-[500px]">
          {product.slideImages && product.slideImages.length > 0 ? (
            <div className="relative">
              <Swiper
                modules={[Autoplay]}
                loop
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                className="rounded-2xl overflow-hidden aspect-square"
                onSwiper={setSwiper}
                onActiveIndexChange={(e) => setSlideIndex(e.realIndex)}
              >
                {product.slideImages.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative aspect-square">
                      <Image
                        src={src}
                        alt={`${product.title} ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* 커스텀 네비게이션 */}
              <div className="absolute z-[1] flex bottom-2 left-1/2 -translate-x-1/2 text-white rounded-[100px] w-[70px] py-1 text-sm justify-around items-center bg-[rgba(0,0,0,0.5)]">
                <div
                  className="w-6 h-6 cursor-pointer bg-no-repeat bg-center bg-cover"
                  style={{ backgroundImage: "url('/images/left.png')" }}
                  onClick={() => swiper?.slidePrev()}
                />
                <div className="flex gap-1">
                  <span>{slideIndex + 1}</span>
                  <span>/</span>
                  <span>{slideTotal}</span>
                </div>
                <div
                  className="w-6 h-6 cursor-pointer bg-no-repeat bg-center bg-cover"
                  style={{ backgroundImage: "url('/images/right.png')" }}
                  onClick={() => swiper?.slideNext()}
                />
              </div>
            </div>
          ) : (
            <div className="relative aspect-square">
              <Image
                src={product.src || "/images/grape_test.png"}
                alt={product.title}
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="w-full md:w-[550px]">
          <div className="p-5">
            <div className="pb-[12px] md:pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <h1 className="text-2xl md:text-3xl font-medium tracking-[-.06em]">{product.title}</h1>
            </div>

            <div className="pt-3 pb-[12px] md:pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <div className="flex items-center gap-2">
                <div className="font-medium text-sm line-through text-gray-500">
                  {formatToWon(product.price)}원
                </div>
                {product.discount ? (
                  <div className="font-semibold text-lg text-orange-600">{product.discount}%</div>
                ) : null}
              </div>
              <div className="font-extrabold text-lg md:text-xl">
                {formatToWon(
                  product.discount
                    ? product.price * (1 - Number(product.discount) / 100)
                    : product.price
                )}원
              </div>
              <div className="text-sm pt-3 text-gray-600">
                {product.category} &nbsp;|&nbsp; 원산지: 국내산
              </div>
            </div>

            <div className="py-5 text-sm md:text-base text-gray-700">{product.description}</div>

            {/* 옵션 선택 */}
            <div className="pb-[18px] border-b border-[#d5dbdc]">
              <GrapeSelect
                productId={product.id}
                basePrice={product.price}
                discount={Number(product.discount) || 0}
                onSelect={handleSelect}
                selectedIds={selectedItems.map((i) => i.id)}
              />
            </div>

            {/* 선택된 옵션 목록 */}
            {selectedItems.length > 0 && (
              <div className="mt-4 space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex-1">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-7 h-7 border border-gray-300 rounded"
                        onClick={() => handleQty(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        className="w-7 h-7 border border-gray-300 rounded"
                        onClick={() => handleQty(item.id, 1)}
                      >+</button>
                      <span className="w-24 text-right font-medium">
                        {formatToWon(item.price * item.quantity)}원
                      </span>
                      <button
                        className="text-red-500 text-xs border border-red-300 rounded px-1"
                        onClick={() => handleRemove(item.id)}
                      >✕</button>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t text-right font-extrabold text-lg">
                  총 {formatToWon(totalPrice)}원
                </div>
              </div>
            )}

            {/* 장바구니 버튼 */}
            <div className="pt-6 md:pt-10">
              <button
                onClick={() => {
                  if (selectedItems.length === 0) {
                    alert("옵션을 선택해주세요.");
                    return;
                  }
                  setShowCart(true);
                }}
                className="w-full p-4 bg-white hover:bg-blue-600 hover:text-white text-blue-600 rounded-md border border-gray-400 font-semibold text-base hover:border-blue-600 duration-300"
              >
                장바구니 담기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 장바구니 팝업 */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-[90%] max-w-[480px] z-10">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCartIcon className="h-8 text-blue-600" />
              <h2 className="text-xl font-bold">주문 확인</h2>
            </div>
            <div className="space-y-2 text-sm border-t border-b py-4 mb-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.label} × {item.quantity}</span>
                  <span className="font-medium">{formatToWon(item.price * item.quantity)}원</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between font-extrabold text-base">
                <span>합계</span>
                <span>{formatToWon(totalPrice)}원</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="https://pf.kakao.com/_kevin"
                target="_blank"
                className="w-full p-3 text-center bg-yellow-400 text-black font-bold rounded-md text-sm"
              >
                카카오채널로 주문하기
              </Link>
              <button
                onClick={() => setShowCart(false)}
                className="w-full p-3 bg-gray-100 rounded-md text-sm font-medium"
              >
                닫기
              </button>
            </div>
          </div>
          <div className="fixed inset-0" onClick={() => setShowCart(false)} />
        </div>
      )}

      {/* 상세 이미지 */}
      {detailImages.map((src, idx) => (
        <div key={idx} className="relative w-full md:max-w-[700px] mx-auto">
          <Image
            src={src}
            alt={`상세페이지 ${idx + 1}`}
            width={700}
            height={0}
            style={{ width: "100%", height: "auto" }}
            className="object-contain"
            priority={idx === 0}
          />
        </div>
      ))}
    </>
  );
};

export default ProductDetailClient;
