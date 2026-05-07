"use client";

import React, { forwardRef } from "react";

type Variant = "soft" | "strong" | "outline";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  glow?: boolean;
};

const GlassCard = forwardRef<HTMLDivElement, Props>(
  ({ variant = "soft", glow = false, className, children, ...rest }, ref) => {
    const base = "relative rounded-2xl";
    const variants: Record<Variant, string> = {
      soft: "glass",
      strong: "glass-strong",
      outline:
        "border border-default-200/50 dark:border-default-100/20 bg-content1/40 backdrop-blur-md",
    };

    return (
      <div
        ref={ref}
        className={`${base} ${variants[variant]} ${glow ? "ring-glow" : ""} ${className ?? ""}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
