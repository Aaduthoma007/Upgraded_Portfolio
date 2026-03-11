'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '@/data/resume';

interface SecurityVaultProps {
  position: [number, number, number];
}

export function SecurityVault({ position }: SecurityVaultProps) {
  const laserGroupRef = useRef<THREE.Group>(null);
  const doorLeftRef = useRef<THREE.Mesh>(null);
  const doorRightRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Laser grid lines
  const laserLines = useMemo(() => {
    const lines: { pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }[] = [];
    // Horizontal lasers
    for (let i = 0; i < 6; i++) {
      lines.push({
        pos: [0, 0.5 + i * 0.5, 0],
        rot: [0, 0, 0],
        scale: [3, 0.01, 0.01],
      });
    }
    // Vertical lasers
    for (let i = 0; i < 5; i++) {
      lines.push({
        pos: [-1.2 + i * 0.6, 1.75, 0],
        rot: [0, 0, Math.PI / 2],
        scale: [3, 0.01, 0.01],
      });
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (!laserGroupRef.current) return;

    // Animate laser opacity
    laserGroupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        child.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.3;
      }
    });

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
    }
  });

  const project = projects[1]; // Piracy Detection

  return (
    <group position={position}>
      {/* Vault frame */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[3.5, 4.2, 0.3]} />
        <meshPhysicalMaterial color="#1a1a2e" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Door opening */}
      <mesh position={[0, 2, 0.1]}>
        <boxGeometry args={[2.8, 3.6, 0.2]} />
        <meshPhysicalMaterial color="#080b14" roughness={0.9} />
      </mesh>

      {/* Left door */}
      <mesh ref={doorLeftRef} position={[-0.7, 2, 0.2]} castShadow>
        <boxGeometry args={[1.3, 3.4, 0.08]} />
        <meshPhysicalMaterial color="#141825" roughness={0.4} metalness={0.8} clearcoat={0.5} />
      </mesh>

      {/* Right door */}
      <mesh ref={doorRightRef} position={[0.7, 2, 0.2]} castShadow>
        <boxGeometry args={[1.3, 3.4, 0.08]} />
        <meshPhysicalMaterial color="#141825" roughness={0.4} metalness={0.8} clearcoat={0.5} />
      </mesh>

      {/* Laser grid */}
      <group ref={laserGroupRef} position={[0, 0, 0.35]}>
        {laserLines.map((line, i) => (
          <mesh key={i} position={line.pos} rotation={line.rot} scale={line.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#D35F5F" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Label */}
      <Text
        position={[0, 4.5, 0.5]}
        fontSize={0.3}
        color="#D35F5F"
        anchorX="center"
      >
        SECURITY VAULT
      </Text>

      {/* Project info */}
      <Text
        position={[0, -0.5, 0.5]}
        fontSize={0.15}
        color="#E6E1DC"
        anchorX="center"
        maxWidth={3}
      >
        {project.name}
      </Text>
      <Text
        position={[0, -0.8, 0.5]}
        fontSize={0.1}
        color="#6B7280"
        anchorX="center"
      >
        {project.stack.join(' • ')}
      </Text>

      {/* Warning light */}
      <pointLight ref={glowRef} position={[0, 3.8, 1]} color="#D35F5F" intensity={1} distance={6} />

      {/* Floor plate */}
      <mesh position={[0, 0.02, 0.5]} receiveShadow>
        <boxGeometry args={[3.5, 0.04, 2]} />
        <meshPhysicalMaterial color="#141825" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}
