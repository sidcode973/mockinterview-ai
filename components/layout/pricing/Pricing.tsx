"use client";

import React from "react";
import {
  Divider,
  Link,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import TiltCard from "@/components/ui/TiltCard";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import MotionFadeIn from "@/components/ui/motion/MotionFadeIn";

const Pricing = () => {
  const features = [
    "Comprehensive questions",
    "Feedback reports or results",
    "You choose time and field",
    "Industry-specific interviews",
    "Expert video tutorials",
    "Technical question practice",
    "Behavioral question practice",
    "Situational question preparation",
    "24/7 AI mentor support",
    "Soft skills training",
  ];

  return (
    <div id="pricing" className="w-full flex flex-col items-center my-16">
      <MotionFadeIn className="text-center my-6">
        <span className="tracking-tight inline font-semibold text-gradient-fusion text-[2.3rem] lg:text-5xl leading-9">
          Pricing
        </span>
        <p className="mt-3 text-default-500">One simple plan. Everything included.</p>
      </MotionFadeIn>

      <MotionFadeIn delay={0.05}>
        <TiltCard tiltStrength={5}>
          <GlassCard variant="strong" glow className="max-w-[440px] p-6 overflow-hidden">
            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-fuchsia-400/70 to-transparent" />

            <div className="flex gap-3 mb-3">
              <div className="flex flex-col">
                <p className="text-xl font-extrabold tracking-tight">Pro Version</p>
                <p className="text-md text-default-500">
                  Best for all types of users
                </p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2.5 py-1 text-xs font-medium text-fuchsia-400">
                <Icon icon="solar:star-bold" width={12} /> Popular
              </span>
            </div>

            <Divider className="bg-default-200/40" />

            <div className="py-5">
              <div className="flex items-baseline space-x-1">
                <h1 className="text-3xl font-extrabold md:text-4xl lg:text-5xl">
                  <span className="text-gradient-cyan">$9.99</span>
                </h1>
                <p className="text-default-500">/ month</p>
              </div>

              <ul className="mt-7 max-w-md space-y-2 text-default-500">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                      <Icon icon="hugeicons-tick-02" fontSize={14} className="text-emerald-500" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Divider className="bg-default-200/40" />

            <div className="pt-4">
              <MagneticButton strength={0.3} className="w-full block">
                <Button
                  className="w-full bg-gradient-to-r from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] animate-gradient-pan text-white font-semibold shadow-lg shadow-fuchsia-500/30"
                  endContent={<Icon icon="akar-icons:arrow-right" />}
                  as={Link}
                  href="/subscribe"
                >
                  Get Started
                </Button>
              </MagneticButton>
            </div>
          </GlassCard>
        </TiltCard>
      </MotionFadeIn>
    </div>
  );
};

export default Pricing;
