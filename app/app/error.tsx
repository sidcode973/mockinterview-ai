"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-full py-16 px-4">
      <div
        className="flex flex-col items-center gap-5 rounded-2xl px-10 py-10 max-w-sm w-full text-center"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid #e8edf5",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(239,68,68,0.08), 0 0 0 1px rgba(239,68,68,0.04)",
        }}
      >
        {/* Icon */}
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
            boxShadow: "0 6px 20px rgba(239,68,68,0.3)",
          }}
        >
          <Icon icon="solar:danger-triangle-bold" className="text-2xl text-white" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1.5">
          <h2
            className="text-lg font-semibold text-slate-800"
            style={{ letterSpacing: "-0.01em" }}
          >
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {error?.message || "An unexpected error occurred"}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
              boxShadow: "0 3px 12px rgba(239,68,68,0.3)",
            }}
          >
            <Icon icon="solar:refresh-bold" className="text-sm" />
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(248,250,252,0.9)",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Icon icon="solar:arrow-left-bold" className="text-sm" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}