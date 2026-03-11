'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '@/data/resume';

interface AITerminalProps {
  position: [number, number, number];
}

export function AITerminal({ position }: AITerminalProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isActive, setIsActive] = useState(false);
  const glowRef = useRef<THREE.PointLight>(null);

  const particleCount = 1500;

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 + Math.random() * 0.8;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 2;
      pos[i * 3 + 2] = r * Math.cos(phi);

      color.setHSL(0.08 + Math.random() * 0.05, 0.6, 0.5 + Math.random() * 0.3);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !groupRef.current) return;

    // Rotate particles slowly
    pointsRef.current.rotation.y += 0.002;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;

    // Check player proximity
    const playerPos = new THREE.Vector3(0, 0, 0);
    state.scene.traverse((child) => {
      if (child.userData?.isPlayer) {
        child.getWorldPosition(playerPos);
      }
    });

    const dist = groupRef.current.position.distanceTo(playerPos);
    const shouldActivate = dist < 5;

    if (shouldActivate !== isActive) {
      setIsActive(shouldActivate);
    }

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  const project = projects[0]; // Hype Analyzer

  return (
    <group ref={groupRef} position={position}>
      {/* Particle cloud */}
      <points ref={pointsRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Label */}
      <Text
        position={[0, 4.2, 0]}
        fontSize={0.3}
        color="#E8A87C"
        anchorX="center"
        anchorY="middle"
      >
        AI TERMINAL
      </Text>

      {/* Project info - visible when active */}
      {isActive && (
        <group position={[0, 3.5, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#E6E1DC"
            anchorX="center"
            maxWidth={3}
          >
            {project.name}
          </Text>
          <Text
            position={[0, -0.35, 0]}
            fontSize={0.12}
            color="#6B7280"
            anchorX="center"
            maxWidth={3}
          >
            {project.stack.join(' • ')}
          </Text>
          <Text
            position={[0, -0.65, 0]}
            fontSize={0.1}
            color="#6C9BCF"
            anchorX="center"
            maxWidth={3.5}
          >
            {project.bullets[0]}
          </Text>
        </group>
      )}

      {/* Ambient glow */}
      <pointLight ref={glowRef} position={[0, 2, 0]} color="#E8A87C" intensity={1.5} distance={8} />

      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.1, 32]} />
        <meshPhysicalMaterial color="#141825" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
