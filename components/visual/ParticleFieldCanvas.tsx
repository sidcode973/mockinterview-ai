"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function generatePoints(count: number, radius: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function Stars({
  count = 800,
  radius = 1.6,
  color = "#b249f8",
}: {
  count?: number;
  radius?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Points>(null);
  const [positions] = useState(() => generatePoints(count, radius));

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta * 0.04;
    ref.current.rotation.y -= delta * 0.06;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={color}
        size={0.008}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
}

type Props = {
  density?: "low" | "medium" | "high";
  className?: string;
};

export default function ParticleFieldCanvas({ density = "medium", className }: Props) {
  const counts = { low: 350, medium: 700, high: 1200 } as const;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1.4], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        frameloop="always"
      >
        <Stars count={counts[density]} color="#b249f8" />
        <Stars count={Math.floor(counts[density] * 0.5)} radius={1.4} color="#22d3ee" />
      </Canvas>
    </div>
  );
}
