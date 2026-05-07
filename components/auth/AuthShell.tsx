"use client";

import React from "react";
import { m } from "framer-motion";
import AuroraBackground from "@/components/visual/AuroraBackground";
import ParticleField from "@/components/visual/ParticleField";
import GlassCard from "@/components/ui/GlassCard";
import { Icon } from "@iconify/react";

type Props = {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthShell({ icon, title, subtitle, children }: Props) {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center py-10">
      <AuroraBackground variant="auth" className="!fixed" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ParticleField density="low" />
      </div>

      <m.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard variant="strong" glow className="px-8 pb-8 pt-7 sm:px-10">
          <div className="flex flex-col items-center gap-3">
            <m.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] shadow-lg shadow-fuchsia-500/40"
            >
              <Icon icon={icon} className="text-2xl text-white" />
            </m.div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-sm text-default-500">{subtitle}</p>
            </div>
          </div>

          <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-default-200/60 to-transparent" />

          {children}
        </GlassCard>
      </m.div>
    </div>
  );
}
