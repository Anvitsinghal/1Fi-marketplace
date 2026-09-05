import React from "react";
import type { EMIPlan } from "@/types/marketplace";
import { formatCurrency } from "@/services/productService";
import { Check, Sparkles, ShieldCheck } from "lucide-react";

interface EMIPlanSelectorProps {
  plans: EMIPlan[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
  downpayment: number;
}

export const EMIPlanSelector: React.FC<EMIPlanSelectorProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  downpayment,
}) => {
  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  return (
    <div className="rounded-3xl border border-[#eae2f8] bg-white p-6 shadow-xs space-y-5">
      {/* Downpayment & Trust Highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#eae2f8]">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
            Initial Downpayment
          </span>
          <div className="text-sm font-semibold text-neutral-800 mt-0.5">
            Pay only <span className="font-black text-[#6825db] text-lg">{formatCurrency(downpayment)}</span> today
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#6825db] bg-purple-100 border border-purple-200 px-3 py-1 rounded-full w-fit">
          <ShieldCheck className="size-3.5" /> No Credit Score Required
        </span>
      </div>

      {/* Choose EMI Plan Title */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Choose Flexible EMI Tenure
          </span>
          <span className="text-xs text-[#6825db] font-semibold flex items-center gap-1">
            <Sparkles className="size-3" /> Mutual Fund Backed
          </span>
        </div>

        {/* List of EMI Plans */}
        <div className="mt-3 space-y-3">
          {plans.map((plan) => {
            const isSelected = activePlan?.id === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => onSelectPlan(plan.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#6825db] bg-purple-50/50 ring-2 ring-[#6825db]/20 shadow-xs"
                    : "border-[#eae2f8] bg-white hover:border-purple-300 hover:bg-purple-50/30"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#6825db] bg-[#6825db] text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="font-extrabold text-base text-neutral-900">
                      {formatCurrency(plan.monthly_amount)}{" "}
                      <span className="text-xs font-semibold text-neutral-500">
                        /month × {plan.tenure_months} months
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                      <span>Interest: {plan.interest_rate}%</span>
                      {plan.cashback_amount > 0 && (
                        <span className="text-green-700 font-semibold bg-green-100 px-1.5 py-0.5 rounded text-[11px]">
                          + ₹{plan.cashback_amount.toLocaleString("en-IN")} Cashback
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      plan.interest_rate === 0
                        ? "bg-purple-100 text-[#6825db] border border-purple-200"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {plan.interest_rate === 0 ? "0% No-Cost EMI" : `${plan.interest_rate}% APR`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
