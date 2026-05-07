"use client";

import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const ParticleFieldCanvas = dynamic(() => import("./ParticleFieldCanvas"), {
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

type Props = {
  density?: "low" | "medium" | "high";
  className?: string;
};

export default function ParticleField({ density = "medium", className }: Props) {
  const reduce = useReducedMotion();
  const isMobile = useSyncExternalStore(subscribeMedia, getIsMobile, () => false);

  if (reduce || isMobile) return null;
  return <ParticleFieldCanvas density={density} className={className} />;
}
