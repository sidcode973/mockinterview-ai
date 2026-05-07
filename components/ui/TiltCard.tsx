"use client";

import React, { useRef } from "react";
import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

type Props = {
  tiltStrength?: number;
  glare?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function TiltCard({
  tiltStrength = 8,
  glare = true,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rx = useSpring(useTransform(py, [-0.5, 0.5], [tiltStrength, -tiltStrength]), {
    stiffness: 200,
    damping: 18,
  });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-tiltStrength, tiltStrength]), {
    stiffness: 200,
    damping: 18,
  });

  const glareX = useTransform(px, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["20%", "80%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.16), transparent 55%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className={`relative will-change-transform ${className ?? ""}`}
    >
      {children}
      {glare && !reduce && (
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: glareBg,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </m.div>
  );
}
