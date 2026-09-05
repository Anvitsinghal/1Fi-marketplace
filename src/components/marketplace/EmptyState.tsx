import React from "react";
import { Search, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  searchTerm?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onReset }) => {
  return (
    <div className="rounded-3xl border border-[#eae2f8] bg-white p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
      <div className="grid size-14 place-items-center rounded-2xl bg-purple-100 text-[#6825db] mx-auto">
        <Search className="size-7 stroke-[2]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-black text-neutral-900">No smartphones found</h3>
        <p className="text-xs text-neutral-500 leading-relaxed">
          {searchTerm
            ? `We couldn't find any products matching "${searchTerm}". Try a different search term or clear filters.`
            : "No products currently available in this category. Check back soon!"}
        </p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#eae2f8] bg-[#faf8fe] px-4 py-2 text-xs font-bold text-[#6825db] hover:bg-purple-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5" /> Reset Filters
        </button>
      )}
    </div>
  );
};
