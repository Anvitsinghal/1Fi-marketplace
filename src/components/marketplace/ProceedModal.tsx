import React, { useState } from "react";
import type { Product, ProductVariant, EMIPlan } from "@/types/marketplace";
import { formatCurrency } from "@/services/productService";
import { X, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProceedModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variant: ProductVariant;
  plan: EMIPlan;
}

export const ProceedModal: React.FC<ProceedModalProps> = ({
  isOpen,
  onClose,
  product,
  variant,
  plan,
}) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const downpayment = variant.downpayment || Math.round(variant.price * 0.15);

  const handleSubmit = () => {
    if (mobileNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number registered with your Mutual Fund folios (CAMS/KFintech).");
      return;
    }
    if (!agreedToTerms) {
      alert("Please accept the terms to proceed with mutual fund pledge.");
      return;
    }
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#eae2f8] bg-white p-6 sm:p-8 shadow-2xl">
        <button
          onClick={() => {
            setIsSuccess(false);
            onClose();
          }}
          className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-[#6825db]">
                <Sparkles className="size-3" /> Step 1 of 2: Digital Lien Verification
              </span>
              <h3 className="mt-2 text-2xl font-black text-neutral-900">
                Confirm 0% EMI Application
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Your mutual funds remain 100% invested while you pay easy monthly installments.
              </p>
            </div>

            {/* Product & Plan Summary Box */}
            <div className="rounded-2xl bg-[#faf8fe] border border-[#eae2f8] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={variant.image_url}
                  alt={product.name}
                  className="size-14 object-contain bg-white rounded-xl border border-neutral-200 p-1"
                />
                <div>
                  <h4 className="font-black text-sm text-neutral-900">{product.name}</h4>
                  <p className="text-xs text-neutral-500">
                    {variant.color} • {variant.storage}
                  </p>
                  <p className="text-xs font-bold text-[#6825db] mt-0.5">
                    Price: {formatCurrency(variant.price)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eae2f8] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-400">Monthly EMI:</span>
                  <div className="font-black text-neutral-900 text-sm">
                    {formatCurrency(plan.monthly_amount)}/mo
                  </div>
                </div>
                <div>
                  <span className="text-neutral-400">Tenure:</span>
                  <div className="font-black text-neutral-900 text-sm">
                    {plan.tenure_months} Months (0% Interest)
                  </div>
                </div>
                <div>
                  <span className="text-neutral-400">Downpayment Today:</span>
                  <div className="font-black text-[#6825db] text-sm">
                    {formatCurrency(downpayment)}
                  </div>
                </div>
                <div>
                  <span className="text-neutral-400">Credit Score Required:</span>
                  <div className="font-bold text-green-700 text-sm">None (MF Asset-Backed)</div>
                </div>
              </div>
            </div>

            {/* Mobile / PAN Verification Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                Mobile Number (Linked to CAMS / KFintech)
              </label>
              <div className="flex gap-2">
                <span className="px-3.5 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-sm font-bold text-[#6825db]">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 rounded-xl border border-[#eae2f8] px-3.5 py-2.5 text-sm focus:border-[#6825db] focus:outline-none focus:ring-2 focus:ring-[#6825db]/20 font-medium"
                />
              </div>
            </div>

            {/* Mutual Fund Pledge Consent */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 accent-[#6825db] size-4 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-neutral-600 leading-relaxed cursor-pointer">
                I authorize 1Fi to fetch my mutual fund folio balances via official RTAs (CAMS & KFintech) to approve zero-cost EMI without liquidating my investments.
              </label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-[#6825db] hover:bg-[#581ec2] text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-[#6825db]/25 cursor-pointer"
            >
              Verify Holdings & Reserve Device
            </Button>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="size-10 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">
                Pre-Approval Successful
              </span>
              <h3 className="text-2xl font-black text-neutral-900">Application Confirmed!</h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                Your 1Fi 0% EMI reservation for <strong>{product.name}</strong> ({variant.color}, {variant.storage}) has been submitted.
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf8fe] border border-[#eae2f8] p-4 text-xs text-neutral-700 space-y-1.5 text-left">
              <div className="flex justify-between">
                <span>Monthly Installment:</span>
                <span className="font-bold text-neutral-900">{formatCurrency(plan.monthly_amount)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Tenure:</span>
                <span className="font-bold text-neutral-900">{plan.tenure_months} Months</span>
              </div>
              <div className="flex justify-between">
                <span>RTA OTP Link Sent To:</span>
                <span className="font-bold text-[#6825db]">+91 {mobileNumber}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full bg-[#6825db] hover:bg-[#581ec2] text-white font-bold py-3 rounded-xl cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
