import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Failed to load catalog products. Please check your connection and try again.",
  onRetry,
}) => {
  return (
    <div className="rounded-3xl border border-red-200/80 bg-red-50/50 p-8 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
      <div className="grid size-12 place-items-center rounded-2xl bg-red-100 text-red-600 mx-auto">
        <AlertCircle className="size-6 stroke-[2]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-red-950">Unable to load catalog</h3>
        <p className="text-xs text-red-700 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="size-3.5" /> Try Again
        </button>
      )}
    </div>
  );
};
