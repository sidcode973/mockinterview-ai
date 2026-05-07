"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function Orb({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15 * speed;
    ref.current.rotation.y += delta * 0.18 * speed;
  });
  return (
    <Float speed={speed * 1.2} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color={color}
          distort={0.45}
          speed={1.6}
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingOrbsCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#22d3ee" />
        <pointLight position={[5, -3, 2]} intensity={0.6} color="#FF1CF7" />
        <Orb position={[-2.4, 0.9, 0]} color="#b249f8" scale={1.1} speed={0.8} />
        <Orb position={[2.6, -0.4, -1]} color="#22d3ee" scale={0.9} speed={1} />
        <Orb position={[0.4, -1.6, 0.5]} color="#FF1CF7" scale={0.7} speed={1.2} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
