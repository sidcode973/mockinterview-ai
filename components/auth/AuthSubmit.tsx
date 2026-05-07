"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import MagneticButton from "@/components/ui/MagneticButton";

type Props = {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
};

export default function AuthSubmit({ loading, loadingText = "Submitting…", children }: Props) {
  return (
    <MagneticButton strength={0.25} className="w-full block">
      <Button
        type="submit"
        isLoading={loading}
        isDisabled={loading}
        endContent={
          !loading && (
            <Icon icon="akar-icons:arrow-right" className="transition-transform duration-300 group-hover:translate-x-1" />
          )
        }
        className="group relative w-full overflow-hidden rounded-xl py-6 text-sm font-semibold text-white bg-gradient-to-r from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] animate-gradient-pan shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/60 transition-shadow"
      >
        {loading ? loadingText : children}
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/15 transition-transform duration-700 group-hover:translate-x-[200%]"
          aria-hidden="true"
        />
      </Button>
    </MagneticButton>
  );
}
