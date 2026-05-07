"use client";

import React from "react";
import TiltCard from "@/components/ui/TiltCard";
import GlassCard from "@/components/ui/GlassCard";

export type FeatureCardProps = {
  title: string;
  descriptions: string[];
  icon: React.ReactNode;
};

const FeatureCard = ({ title, descriptions = [], icon }: FeatureCardProps) => {
  return (
    <TiltCard tiltStrength={6}>
      <GlassCard variant="soft" className="h-full p-1 transition-shadow hover:ring-glow">
        <div className="rounded-2xl p-5">
          <div className="flex flex-col gap-3 pb-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF1CF7]/15 via-[#b249f8]/15 to-[#22d3ee]/15 ring-1 ring-fuchsia-500/20 text-foreground">
              {icon}
            </span>
            <p className="text-medium font-semibold text-foreground">{title}</p>
          </div>
          <div className="flex flex-col gap-2">
            {descriptions.map((description, index) => (
              <div
                key={index}
                className="flex min-h-12.5 rounded-xl bg-content2/40 backdrop-blur-sm border border-default-200/30 px-3 py-2 text-content3-foreground transition-colors hover:bg-content2/60"
              >
                <p className="text-small">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </TiltCard>
  );
};

export default FeatureCard;
