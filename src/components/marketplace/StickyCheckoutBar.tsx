import React from "react";
import type { EMIPlan } from "@/types/marketplace";
import { formatCurrency } from "@/services/productService";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface StickyCheckoutBarProps {
  productName: string;
  selectedPlan: EMIPlan;
  onProceed: () => void;
}

export const StickyCheckoutBar: React.FC<StickyCheckoutBarProps> = ({
  productName,
  selectedPlan,
  onProceed,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-[#eae2f8] px-4 py-3 sm:py-4 shadow-2xl backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div>
          <div className="hidden sm:block text-xs font-bold uppercase tracking-wider text-neutral-400">
            Selected 0% EMI Plan for {productName}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-neutral-900">
              {formatCurrency(selectedPlan.monthly_amount)}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-500">
              /month for {selectedPlan.tenure_months} months
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-[#6825db] bg-purple-100 px-2 py-0.5 rounded-full">
              <ShieldCheck className="size-3" /> MF-Backed
            </span>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6825db] px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-[#6825db]/25 hover:bg-[#581ec2] hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <span>Proceed with {selectedPlan.tenure_months}M Plan</span>
          <ArrowRight className="size-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
