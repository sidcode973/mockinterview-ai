"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export default function CountUp({
  value,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() => (reduce ? value : 0));
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduce) {
      if (display !== value) setDisplay(value);
      return;
    }
    if (startedRef.current) {
      setDisplay(value);
      return;
    }
    startedRef.current = true;

    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, reduce]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
