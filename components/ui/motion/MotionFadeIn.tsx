"use client";

import React from "react";
import { m, type Variants } from "framer-motion";

type Props = {
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function MotionFadeIn({
  delay = 0,
  y = 16,
  once = true,
  className,
  children,
}: Props) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <m.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </m.div>
  );
}
