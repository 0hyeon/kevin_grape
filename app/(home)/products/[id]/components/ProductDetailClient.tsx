"use client";
import React, { useCallback, useEffect, useState } from "react";
import CartButton from "./cart";
import { formatToWon } from "@/lib/utils";
import SelectComponent from "@/components/select-bar";
import Image from "next/image";
import { IProduct } from "@/types/type";

interface ProductDetailClientProps {
  product: IProduct & { src?: string; detailImages?: string[] };
  params: number;
}

const ProductDetailClient = ({ product, params }: ProductDetailClientProps) => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleOptionSelect = useCallback(
    (
      optionDetails: string,
      price: string,
      plusPrice: number,
      pdOptionId: number,
      dummycount: number
    ) => {
      if (isNaN(pdOptionId)) return;
      setSelectedOptions((prevOptions) => {
        if (prevOptions.findIndex((o) => o.id === pdOptionId) >= 0) {
          setAlertMessage("이미 선택된 옵션입니다.");
          return prevOptions;
        }
        return [...prevOptions, { optionDetails, price, plusPrice, id: pdOptionId, quantity: 1, dummycount }];
      });
    },
    []
  );

  useEffect(() => {
    if (alertMessage !== null) {
      alert(alertMessage);
      setAlertMessage(null);
    }
  }, [alertMessage]);

  const handleQuantityChange = (optionId: number, change: number) => {
    setSelectedOptions((prev) =>
      prev.map((o) => o.id === optionId ? { ...o, quantity: o.quantity + change } : o)
    );
  };

  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions((prev) => prev.filter((o) => o.id !== optionId));
  };

  const getTotalPrice = () =>
    selectedOptions.reduce((total, option) => {
      const optionPrice = Number(option.price.replace(/,/g, ""));
      return total + optionPrice * option.quantity * option.dummycount;
    }, 0);

  const detailImages = product.detailImages ?? ["/images/kevin_detail_page.jpg"];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 md:gap-[50px] max-w-[1100px] mx-auto border-b border-[#999] pb-10 md:pb-14">
        {/* 메인 이미지 */}
        <div className="w-full md:w-[500px]">
          <div className="relative aspect-square">
            <Image
              src={product.src || "/images/grape_test.png"}
              alt={product.title}
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
        {/* 상품 정보 */}
        <div className="w-full md:w-[550px]">
          <div className="p-5">
            <div className="pb-[12px] md:pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <h1 className="text-2xl md:text-3xl font-medium tracking-[-.06em]">
                {product.title}
              </h1>
            </div>
            <div className="pt-3 pb-[12px] md:pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <div className="font-medium text-sm line-through text-gray-500">
                  {formatToWon(product.price)}원
                </div>
                <div className="font-semibold text-lg md:text-xl text-orange-600">
                  {product.discount ? `${product.discount}%` : ""}
                </div>
              </div>
              <div className="font-extrabold text-lg md:text-xl">
                {formatToWon(
                  product.discount
                    ? product.price * (1 - Number(product.discount) / 100)
                    : product.price
                )}원
              </div>
              <div className="text-sm md:text-base pt-3 flex flex-col md:flex-row items-start md:items-center gap-2">
                {product.category}
                <div className="text-xs md:text-sm">원산지: 국내산</div>
              </div>
            </div>
            <div className="py-5 md:py-[28px] text-sm md:text-base">
              {product.description}
            </div>
            <div className="pb-[18px] md:px-[5px] border-b border-[#d5dbdc]">
              <SelectComponent
                options={product.productoption || []}
                price={product.price}
                discount={Number(product.discount) || 0}
                quantity={1}
                onSelect={handleOptionSelect}
                selectedOptions={selectedOptions}
              />
            </div>
            {selectedOptions.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">선택된 옵션</h2>
                <div className="mt-2">
                  {selectedOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0"
                    >
                      <div>{option.optionDetails}</div>
                      <div className="flex items-center mt-2 md:mt-0 w-full justify-between md:justify-end">
                        <div>
                          <button
                            className="w-[34px] h-[34px] rounded md:w-[30px] md:h-[30px] border border-gray-300"
                            onClick={() => handleQuantityChange(option.id, -1)}
                            disabled={option.quantity <= 1}
                          >-</button>
                          <span className="mx-2 md:mx-4">{option.quantity}</span>
                          <button
                            className="w-[34px] h-[34px] rounded md:w-[30px] md:h-[30px] border border-gray-300"
                            onClick={() => handleQuantityChange(option.id, 1)}
                          >+</button>
                        </div>
                        <button
                          className="ml-4 w-[34px] h-[34px] rounded md:w-[30px] md:h-[30px] border border-gray-300 text-red-600"
                          onClick={() => handleRemoveOption(option.id)}
                        >x</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 font-extrabold text-lg md:text-xl">
                  총 가격: {formatToWon(getTotalPrice())}원
                </div>
              </div>
            )}
            <div className="pt-6 md:pt-10 flex flex-col w-full gap-2">
              {params && (
                <CartButton
                  options={selectedOptions}
                  cartId={params}
                  text={"장바구니담기"}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 상세 이미지 */}
      {detailImages.map((src, idx) => (
        <div key={idx} className="relative w-full mx-auto">
          <Image
            src={src}
            alt={`상세페이지 ${idx + 1}`}
            width={1200}
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
