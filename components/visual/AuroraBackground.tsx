"use client";

import React from "react";

type Variant = "full" | "muted" | "auth" | "focus";

type Props = {
  variant?: Variant;
  className?: string;
};

const palettes: Record<Variant, { a: string; b: string; c: string; opacity: number }> = {
  full: {
    a: "rgba(255, 28, 247, 0.35)",
    b: "rgba(34, 211, 238, 0.30)",
    c: "rgba(178, 73, 248, 0.30)",
    opacity: 1,
  },
  muted: {
    a: "rgba(178, 73, 248, 0.18)",
    b: "rgba(34, 211, 238, 0.14)",
    c: "rgba(99, 102, 241, 0.16)",
    opacity: 0.85,
  },
  auth: {
    a: "rgba(99, 102, 241, 0.32)",
    b: "rgba(34, 211, 238, 0.28)",
    c: "rgba(255, 28, 247, 0.22)",
    opacity: 1,
  },
  focus: {
    a: "rgba(99, 102, 241, 0.10)",
    b: "rgba(34, 211, 238, 0.08)",
    c: "rgba(178, 73, 248, 0.10)",
    opacity: 0.7,
  },
};

export default function AuroraBackground({ variant = "muted", className }: Props) {
  const p = palettes[variant];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className ?? ""}`}
      style={{ opacity: p.opacity }}
    >
      <div
        className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full"
        style={{
          background: `radial-gradient(circle, ${p.a} 0%, transparent 65%)`,
          filter: "blur(80px)",
          animation: "orb-drift-a 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 h-[42rem] w-[42rem] rounded-full"
        style={{
          background: `radial-gradient(circle, ${p.b} 0%, transparent 65%)`,
          filter: "blur(90px)",
          animation: "orb-drift-b 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full"
        style={{
          background: `radial-gradient(circle, ${p.c} 0%, transparent 70%)`,
          filter: "blur(100px)",
          animation: "orb-drift-c 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
