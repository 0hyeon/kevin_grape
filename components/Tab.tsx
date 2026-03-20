"use client";
import React, { useState } from "react";
import Best from "./Best";
import { IProduct, TabValue } from "@/types/type";
import { slideData } from "@/static/data";
import BestItem from "./BestItem";
import { mappingSubDesc } from "@/app/(home)/productlist/[id]/actions";

const Tabs = ({ items }: { items: IProduct[] }) => {
  const [method, setMethod] = useState<TabValue>("라미봉투");

  const onClickOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    const newMethod = e.currentTarget.innerText as TabValue;
    if (newMethod !== method) {
      setMethod(newMethod);
    }
  };
  const tabBase =
    "w-38 p-4 text-base cursor-pointer flex justify-center items-center h-full relative  text-center leading-tight transition-transform duration-200";

  const tabDefault = "text-gray-500 font-normal";

  const tabOn = "text-blue-600 font-bold border-b-[2px] border-blue-600";
  return (
    <>
      <div className="flex flex-wrap justify-center py-0 px-p[12px] border-b border-b-[#909090] m-b-[20px] items-center m-b[50px]">
        <div className="flex">
          <div
            className={`${tabBase} ${
              method === "라미봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            라미봉투
          </div>
          <div
            className={`${tabBase} ${
              method === "보냉봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            보냉봉투
          </div>
          <div
            className={`${tabBase} ${
              method === "에어캡봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            에어캡봉투
          </div>
        </div>
      </div>
      {method === "드시모네" || method === "또박케어LAB" ? (
        <Best data={slideData.filter((el) => el.category === method)} />
      ) : (
        <BestItem
          data={items.filter((el) => el.productPicture?.category === method)}
          title={method}
          subtitle={mappingSubDesc(method)}
        />
      )}
    </>
  );
};

export default Tabs;
