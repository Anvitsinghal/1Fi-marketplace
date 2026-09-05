import React from "react";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[#eae2f8] bg-white p-5 shadow-xs animate-pulse">
      <div className="h-72 w-full rounded-2xl bg-neutral-100/90" />
      <div className="mt-5 space-y-3">
        <div className="h-3 w-16 rounded bg-neutral-200" />
        <div className="h-6 w-3/4 rounded bg-neutral-200" />
        <div className="h-3 w-full rounded bg-neutral-100" />
        <div className="h-3 w-4/5 rounded bg-neutral-100" />
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-24 rounded bg-neutral-200" />
            <div className="h-3 w-32 rounded bg-neutral-100" />
          </div>
          <div className="size-10 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
};
