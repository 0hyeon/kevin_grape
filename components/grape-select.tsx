"use client";
import React, { useCallback } from "react";
import { formatToWon } from "@/lib/utils";

const KG_SIZES = [
  { kg: 1, multiplier: 1 },
  { kg: 2, multiplier: 1.9 },
  { kg: 3, multiplier: 2.7 },
];

const GIFT_TYPES = [
  { name: "일반포장", plusPrice: 0 },
  { name: "선물포장", plusPrice: 3000 },
  { name: "특선선물세트", plusPrice: 5000 },
];

export interface GrapeOption {
  id: number;
  label: string;
  price: number;
}

interface GrapeSelectProps {
  productId: number;
  basePrice: number;
  discount: number;
  onSelect: (option: GrapeOption) => void;
  selectedIds: number[];
}

export function buildGrapeOptions(productId: number, basePrice: number, discount: number): GrapeOption[] {
  const options: GrapeOption[] = [];
  let idx = 0;
  for (const kg of KG_SIZES) {
    for (const gift of GIFT_TYPES) {
      const raw = Math.round(basePrice * kg.multiplier) + gift.plusPrice;
      const final = Math.round(raw * (1 - discount / 100));
      options.push({
        id: productId * 100 + idx + 1,
        label: `${kg.kg}kg - ${gift.name}`,
        price: final,
      });
      idx++;
    }
  }
  return options;
}

export default function GrapeSelect({ productId, basePrice, discount, onSelect, selectedIds }: GrapeSelectProps) {
  const options = buildGrapeOptions(productId, basePrice, discount);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (!val) return;
      const opt = options.find((o) => o.id === Number(val));
      if (!opt) return;
      if (selectedIds.includes(opt.id)) {
        alert("이미 선택된 옵션입니다.");
        e.target.value = "";
        return;
      }
      onSelect(opt);
      e.target.value = "";
    },
    [options, onSelect, selectedIds]
  );

  return (
    <div className="mt-4">
      <label htmlFor="grape-options" className="block text-sm font-medium text-gray-700">
        옵션 선택
      </label>
      <select
        id="grape-options"
        className="mt-1 block w-full p-4 md:py-2 md:px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onChange={handleChange}
        value=""
      >
        <option value="" disabled>--옵션을 선택해주세요--</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label} — {formatToWon(opt.price)}원
          </option>
        ))}
      </select>
    </div>
  );
}
