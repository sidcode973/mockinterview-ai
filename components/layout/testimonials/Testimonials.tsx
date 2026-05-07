"use client";

import React from "react";
import { User } from "@heroui/react";
import { Icon } from "@iconify/react";
import { testimonials } from "@/constants/constants";
import TiltCard from "@/components/ui/TiltCard";
import GlassCard from "@/components/ui/GlassCard";
import { MotionStagger, MotionStaggerItem } from "@/components/ui/motion";
import MotionFadeIn from "@/components/ui/motion/MotionFadeIn";

export default function Testimonials() {
  return (
    <div className="flex flex-col gap-4 my-16 w-full">
      <MotionFadeIn className="text-center">
        <span className="tracking-tight inline font-semibold text-gradient-fusion text-[2.3rem] lg:text-5xl leading-9">
          Testimonials
        </span>
      </MotionFadeIn>

      <MotionStagger className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        {testimonials?.map((testimonial, index) => (
          <MotionStaggerItem key={index}>
            <TiltCard tiltStrength={4}>
              <GlassCard variant="soft" className="p-5 h-full transition-shadow hover:ring-glow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User
                      avatarProps={{
                        src: testimonial?.user?.avatar,
                      }}
                      classNames={{
                        name: "font-medium",
                        description: "text-small",
                      }}
                      name={testimonial?.user?.name}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Icon
                        key={i}
                        className={
                          i + 1 <= testimonial?.rating
                            ? "text-warning"
                            : "text-default-300"
                        }
                        icon="solar:star-bold"
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 w-full">
                  <p className="font-medium text-default-900">
                    {testimonial?.title}
                  </p>
                  <p className="mt-2 text-default-500">{testimonial?.content}</p>
                </div>
              </GlassCard>
            </TiltCard>
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </div>
  );
}
