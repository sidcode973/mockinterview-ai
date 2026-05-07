"use client";

import React from "react";
import { m, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const child: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

type Props = {
  once?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function MotionStagger({ once = true, className, children }: Props) {
  return (
    <m.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={className}
    >
      {children}
    </m.div>
  );
}

type ItemProps = {
  className?: string;
  children: React.ReactNode;
};

export function MotionStaggerItem({ className, children }: ItemProps) {
  return (
    <m.div variants={child} className={className}>
      {children}
    </m.div>
  );
}

export default MotionStagger;
