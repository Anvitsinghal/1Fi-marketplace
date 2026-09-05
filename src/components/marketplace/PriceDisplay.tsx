import React from "react";
import { formatCurrency } from "@/services/productService";

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice?: number;
  monthlyEmi?: number;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
  monthlyEmi,
  size = "md",
  showDiscount = true,
}) => {
  const orig = originalPrice || Math.round(currentPrice * 1.08);
  const discount = orig > currentPrice ? Math.round(((orig - currentPrice) / orig) * 100) : 0;
  const emi = monthlyEmi || Math.round(currentPrice / 6);

  if (size === "lg") {
    return (
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            {formatCurrency(currentPrice)}
          </span>
          {orig > currentPrice && (
            <span className="text-base text-neutral-400 line-through">
              {formatCurrency(orig)}
            </span>
          )}
          {showDiscount && discount > 0 && (
            <span className="text-xs font-bold bg-purple-100 text-[#6825db] border border-purple-200 px-2.5 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-[#6825db]">
          Starting at {formatCurrency(emi)}/mo with 0% No-Cost EMI
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className={`font-black text-neutral-900 ${size === "sm" ? "text-lg" : "text-xl"}`}>
          {formatCurrency(currentPrice)}
        </span>
        {orig > currentPrice && (
          <span className="text-xs text-neutral-400 line-through">
            {formatCurrency(orig)}
          </span>
        )}
        {showDiscount && discount > 0 && (
          <span className="text-[11px] font-bold text-[#6825db]">
            {discount}% off
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs font-semibold text-[#6825db]">
        From {formatCurrency(emi)}/mo • 0% EMI
      </p>
    </div>
  );
};
