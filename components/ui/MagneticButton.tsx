"use client";

import React, { useRef } from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type Props = {
  strength?: number;
  className?: string;
  children: React.ReactNode;
};

export default function MagneticButton({
  strength = 0.35,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 22, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </m.div>
  );
}
