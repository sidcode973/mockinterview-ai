"use client";

import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const FloatingOrbsCanvas = dynamic(() => import("./FloatingOrbsCanvas"), {
  ssr: false,
  loading: () => null,
});

const subscribeMedia = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(max-width: 768px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getIsMobile = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
};

export default function FloatingOrbs({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const isMobile = useSyncExternalStore(subscribeMedia, getIsMobile, () => false);

  if (reduce || isMobile) {
    return (
      <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden="true">
        <div
          className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(178,73,248,0.5), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute right-1/4 bottom-1/3 h-32 w-32 rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.5), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>
    );
  }

  return <FloatingOrbsCanvas />;
}
