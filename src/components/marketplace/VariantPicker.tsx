import React from "react";
import type { ProductVariant } from "@/types/marketplace";

interface VariantPickerProps {
  variants: ProductVariant[];
  selectedIndex: number;
  onSelectVariant: (index: number) => void;
}

export const VariantPicker: React.FC<VariantPickerProps> = ({
  variants,
  selectedIndex,
  onSelectVariant,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block mb-2.5">
          Select Color & Storage Variant
        </label>
        <div className="flex flex-wrap gap-2.5">
          {variants.map((variant, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={variant.id || idx}
                onClick={() => onSelectVariant(idx)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#6825db] bg-[#6825db] text-white shadow-sm shadow-[#6825db]/25 scale-[1.02]"
                    : "border-[#eae2f8] bg-white text-neutral-700 hover:border-purple-300 hover:bg-purple-50/40"
                }`}
              >
                {variant.color_hex && (
                  <span
                    className="size-3.5 rounded-full border border-white/60 shadow-xs shrink-0"
                    style={{ backgroundColor: variant.color_hex }}
                  />
                )}
                <span>
                  {variant.color} • {variant.storage}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
