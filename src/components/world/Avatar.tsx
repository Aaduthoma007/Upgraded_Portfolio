'use client';

import React, { forwardRef, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouseTracker } from '@/hooks/useMouseTracker';

/**
 * Hyper-detailed procedural robot with metallic chassis, exposed joints,
 * glowing accent lines, and smooth mouse-synced eye tracking.
 * Inspired by Boston Dynamics / sci-fi industrial design.
 */
const Avatar = forwardRef<THREE.Group>(function Avatar(_props, ref) {
  const groupRef = ref as React.RefObject<THREE.Group>;
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const chestGlowRef = useRef<THREE.Mesh>(null);
  const headAntennaRef = useRef<THREE.Mesh>(null);
  const mouse = useMouseTracker();

  // --- Materials ---
  const bodyMetal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#2a2d35',
    roughness: 0.25,
    metalness: 0.95,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  }), []);

  const darkMetal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#15171c',
    roughness: 0.35,
    metalness: 0.9,
    clearcoat: 0.4,
  }), []);

  const accentMetal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#4a4e5a',
    roughness: 0.3,
    metalness: 0.85,
  }), []);

  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#E8A87C',
    transparent: true,
    opacity: 0.9,
  }), []);

  const coolGlow = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#6C9BCF',
    transparent: true,
    opacity: 0.85,
  }), []);

  const eyeGlow = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#E8A87C',
    transparent: true,
    opacity: 0.95,
  }), []);

  const visorMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0a0c12',
    roughness: 0.05,
    metalness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.85,
  }), []);

  const jointMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#1a1c22',
    roughness: 0.5,
    metalness: 0.7,
  }), []);

  // Smooth eye tracking
  const currentEyeOffset = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Eye tracking
    const maxX = 0.018;
    const maxY = 0.012;
    const targetX = mouse.x * maxX;
    const targetY = -mouse.y * maxY;

    currentEyeOffset.current.x += (targetX - currentEyeOffset.current.x) * 0.06;
    currentEyeOffset.current.y += (targetY - currentEyeOffset.current.y) * 0.06;

    if (leftPupilRef.current) {
      leftPupilRef.current.position.x = currentEyeOffset.current.x;
      leftPupilRef.current.position.y = currentEyeOffset.current.y;
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x = currentEyeOffset.current.x;
      rightPupilRef.current.position.y = currentEyeOffset.current.y;
    }

    // Chest core pulse
    if (chestGlowRef.current) {
      const mat = chestGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }

    // Antenna blink
    if (headAntennaRef.current) {
      const mat = headAntennaRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(state.clock.elapsedTime * 4) > 0.3 ? 0.9 : 0.2;
    }
  });

  return (
    <group ref={groupRef as React.Ref<THREE.Group>}>

      {/* === FEET / BOOTS === */}
      {/* Left foot */}
      <group position={[-0.12, 0.04, 0]}>
        <mesh material={darkMetal} castShadow>
          <boxGeometry args={[0.13, 0.06, 0.22]} />
        </mesh>
        <mesh position={[0, 0.01, 0.06]} material={accentMetal}>
          <boxGeometry args={[0.11, 0.03, 0.08]} />
        </mesh>
        {/* Toe glow strip */}
        <mesh position={[0, -0.025, 0.08]} material={coolGlow}>
          <boxGeometry args={[0.08, 0.005, 0.02]} />
        </mesh>
      </group>
      {/* Right foot */}
      <group position={[0.12, 0.04, 0]}>
        <mesh material={darkMetal} castShadow>
          <boxGeometry args={[0.13, 0.06, 0.22]} />
        </mesh>
        <mesh position={[0, 0.01, 0.06]} material={accentMetal}>
          <boxGeometry args={[0.11, 0.03, 0.08]} />
        </mesh>
        <mesh position={[0, -0.025, 0.08]} material={coolGlow}>
          <boxGeometry args={[0.08, 0.005, 0.02]} />
        </mesh>
      </group>

      {/* === LOWER LEGS (Shin plates + pistons) === */}
      {/* Left shin */}
      <group position={[-0.12, 0.35, 0]}>
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.09, 0.42, 0.1]} />
        </mesh>
        {/* Piston rod */}
        <mesh position={[0.055, 0, 0.02]} material={accentMetal} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
        </mesh>
        {/* Knee joint ball */}
        <mesh position={[0, 0.22, 0]} material={jointMat} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
        {/* Shin accent strip */}
        <mesh position={[0, 0, 0.055]} material={glowMat}>
          <boxGeometry args={[0.03, 0.3, 0.005]} />
        </mesh>
      </group>
      {/* Right shin */}
      <group position={[0.12, 0.35, 0]}>
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.09, 0.42, 0.1]} />
        </mesh>
        <mesh position={[-0.055, 0, 0.02]} material={accentMetal} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
        </mesh>
        <mesh position={[0, 0.22, 0]} material={jointMat} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
        <mesh position={[0, 0, 0.055]} material={glowMat}>
          <boxGeometry args={[0.03, 0.3, 0.005]} />
        </mesh>
      </group>

      {/* === UPPER LEGS (Thigh armor) === */}
      {/* Left thigh */}
      <group position={[-0.13, 0.7, 0]}>
        <mesh material={darkMetal} castShadow>
          <boxGeometry args={[0.11, 0.3, 0.12]} />
        </mesh>
        <mesh position={[0.06, 0, 0]} material={bodyMetal} castShadow>
          <boxGeometry args={[0.02, 0.25, 0.1]} />
        </mesh>
      </group>
      {/* Right thigh */}
      <group position={[0.13, 0.7, 0]}>
        <mesh material={darkMetal} castShadow>
          <boxGeometry args={[0.11, 0.3, 0.12]} />
        </mesh>
        <mesh position={[-0.06, 0, 0]} material={bodyMetal} castShadow>
          <boxGeometry args={[0.02, 0.25, 0.1]} />
        </mesh>
      </group>

      {/* === HIP JOINT === */}
      <mesh position={[0, 0.88, 0]} material={jointMat} castShadow>
        <boxGeometry args={[0.32, 0.08, 0.12]} />
      </mesh>

      {/* === TORSO (Layered armor plates) === */}
      <group position={[0, 1.15, 0]}>
        {/* Main torso block */}
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.36, 0.45, 0.2]} />
        </mesh>
        {/* Front chest plate */}
        <mesh position={[0, 0.05, 0.105]} material={darkMetal} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.02]} />
        </mesh>
        {/* Back plate */}
        <mesh position={[0, 0, -0.105]} material={accentMetal} castShadow>
          <boxGeometry args={[0.28, 0.35, 0.02]} />
        </mesh>
        {/* Side armor panels */}
        <mesh position={[-0.185, 0, 0]} material={accentMetal} castShadow>
          <boxGeometry args={[0.02, 0.35, 0.16]} />
        </mesh>
        <mesh position={[0.185, 0, 0]} material={accentMetal} castShadow>
          <boxGeometry args={[0.02, 0.35, 0.16]} />
        </mesh>

        {/* Chest core reactor (glowing) */}
        <mesh ref={chestGlowRef} position={[0, 0, 0.12]} material={glowMat}>
          <circleGeometry args={[0.06, 16]} />
        </mesh>
        {/* Core ring */}
        <mesh position={[0, 0, 0.118]}>
          <torusGeometry args={[0.065, 0.008, 8, 24]} />
          <primitive object={accentMetal} attach="material" />
        </mesh>

        {/* Accent lines on chest */}
        <mesh position={[-0.12, 0.1, 0.116]} material={coolGlow}>
          <boxGeometry args={[0.04, 0.005, 0.005]} />
        </mesh>
        <mesh position={[0.12, 0.1, 0.116]} material={coolGlow}>
          <boxGeometry args={[0.04, 0.005, 0.005]} />
        </mesh>
        <mesh position={[-0.12, 0.05, 0.116]} material={coolGlow}>
          <boxGeometry args={[0.03, 0.005, 0.005]} />
        </mesh>
        <mesh position={[0.12, 0.05, 0.116]} material={coolGlow}>
          <boxGeometry args={[0.03, 0.005, 0.005]} />
        </mesh>
      </group>

      {/* === SHOULDERS === */}
      {/* Left shoulder pad */}
      <group position={[-0.26, 1.35, 0]}>
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.14]} />
        </mesh>
        <mesh position={[0, 0.045, 0]} material={darkMetal} castShadow>
          <boxGeometry args={[0.16, 0.02, 0.16]} />
        </mesh>
        {/* Shoulder joint */}
        <mesh position={[0, -0.05, 0]} material={jointMat} castShadow>
          <sphereGeometry args={[0.045, 10, 10]} />
        </mesh>
      </group>
      {/* Right shoulder pad */}
      <group position={[0.26, 1.35, 0]}>
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.14]} />
        </mesh>
        <mesh position={[0, 0.045, 0]} material={darkMetal} castShadow>
          <boxGeometry args={[0.16, 0.02, 0.16]} />
        </mesh>
        <mesh position={[0, -0.05, 0]} material={jointMat} castShadow>
          <sphereGeometry args={[0.045, 10, 10]} />
        </mesh>
      </group>

      {/* === ARMS === */}
      {/* Left upper arm */}
      <group position={[-0.3, 1.15, 0]}>
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
        </mesh>
        {/* Elbow joint */}
        <mesh position={[0, -0.16, 0]} material={jointMat} castShadow>
          <sphereGeometry args={[0.04, 10, 10]} />
        </mesh>
      </group>
      {/* Left forearm */}
      <group position={[-0.3, 0.86, 0]}>
        <mesh material={darkMetal} castShadow>
          <boxGeometry args={[0.07, 0.25, 0.07]} />
        </mesh>
        {/* Forearm glowing strip */}
        <mesh position={[0, 0, 0.04]} material={coolGlow}>
          <boxGeometry args={[0.02, 0.18, 0.005]} />
        </mesh>
      </group>
      {/* Left hand */}
      <group position={[-0.3, 0.7, 0]}>
        <mesh material={accentMetal} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.04]} />
        </mesh>
        {/* Fingers (3 simple blocks) */}
        <mesh position={[-0.015, -0.04, 0]} material={jointMat}>
          <boxGeometry args={[0.015, 0.04, 0.02]} />
        </mesh>
        <mesh position={[0.005, -0.045, 0]} material={jointMat}>
          <boxGeometry args={[0.015, 0.05, 0.02]} />
        </mesh>
        <mesh position={[0.025, -0.04, 0]} material={jointMat}>
          <boxGeometry args={[0.015, 0.04, 0.02]} />
        </mesh>
      </group>

      {/* Right upper arm */}
      <group position={[0.3, 1.15, 0]}>
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
        </mesh>
        <mesh position={[0, -0.16, 0]} material={jointMat} castShadow>
          <sphereGeometry args={[0.04, 10, 10]} />
        </mesh>
      </group>
      {/* Right forearm */}
      <group position={[0.3, 0.86, 0]}>
        <mesh material={darkMetal} castShadow>
          <boxGeometry args={[0.07, 0.25, 0.07]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={coolGlow}>
          <boxGeometry args={[0.02, 0.18, 0.005]} />
        </mesh>
      </group>
      {/* Right hand */}
      <group position={[0.3, 0.7, 0]}>
        <mesh material={accentMetal} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.04]} />
        </mesh>
        <mesh position={[-0.025, -0.04, 0]} material={jointMat}>
          <boxGeometry args={[0.015, 0.04, 0.02]} />
        </mesh>
        <mesh position={[-0.005, -0.045, 0]} material={jointMat}>
          <boxGeometry args={[0.015, 0.05, 0.02]} />
        </mesh>
        <mesh position={[0.015, -0.04, 0]} material={jointMat}>
          <boxGeometry args={[0.015, 0.04, 0.02]} />
        </mesh>
      </group>

      {/* === NECK === */}
      <group position={[0, 1.42, 0]}>
        <mesh material={jointMat} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.06, 12]} />
        </mesh>
        {/* Neck cables */}
        <mesh position={[0.03, 0, 0.02]} material={accentMetal}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
        </mesh>
        <mesh position={[-0.03, 0, 0.02]} material={accentMetal}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
        </mesh>
      </group>

      {/* === HEAD === */}
      <group position={[0, 1.58, 0]}>
        {/* Main skull block */}
        <mesh material={bodyMetal} castShadow>
          <boxGeometry args={[0.22, 0.2, 0.22]} />
        </mesh>
        {/* Visor (face plate) */}
        <mesh position={[0, -0.01, 0.112]} material={visorMat}>
          <boxGeometry args={[0.2, 0.1, 0.01]} />
        </mesh>
        {/* Top ridge */}
        <mesh position={[0, 0.105, 0]} material={darkMetal} castShadow>
          <boxGeometry args={[0.18, 0.02, 0.2]} />
        </mesh>
        {/* Side temple armor */}
        <mesh position={[-0.115, 0, 0]} material={accentMetal} castShadow>
          <boxGeometry args={[0.02, 0.16, 0.18]} />
        </mesh>
        <mesh position={[0.115, 0, 0]} material={accentMetal} castShadow>
          <boxGeometry args={[0.02, 0.16, 0.18]} />
        </mesh>
        {/* Chin guard */}
        <mesh position={[0, -0.1, 0.05]} material={darkMetal} castShadow>
          <boxGeometry args={[0.14, 0.025, 0.1]} />
        </mesh>

        {/* === EYES (behind visor) === */}
        {/* Left eye */}
        <group position={[-0.055, -0.01, 0.115]}>
          <mesh material={eyeGlow}>
            <circleGeometry args={[0.022, 12]} />
          </mesh>
          <mesh ref={leftPupilRef} position={[0, 0, 0.003]}>
            <circleGeometry args={[0.01, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
        {/* Right eye */}
        <group position={[0.055, -0.01, 0.115]}>
          <mesh material={eyeGlow}>
            <circleGeometry args={[0.022, 12]} />
          </mesh>
          <mesh ref={rightPupilRef} position={[0, 0, 0.003]}>
            <circleGeometry args={[0.01, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Antenna */}
        <mesh position={[0.06, 0.14, 0]} material={accentMetal} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.12, 6]} />
        </mesh>
        <mesh ref={headAntennaRef} position={[0.06, 0.2, 0]} material={glowMat}>
          <sphereGeometry args={[0.01, 6, 6]} />
        </mesh>

        {/* Head accent glow lines */}
        <mesh position={[0, 0.03, 0.115]} material={coolGlow}>
          <boxGeometry args={[0.16, 0.005, 0.005]} />
        </mesh>
        <mesh position={[0, -0.06, 0.115]} material={coolGlow}>
          <boxGeometry args={[0.12, 0.004, 0.005]} />
        </mesh>
      </group>

      {/* Robot ambient glow */}
      <pointLight position={[0, 1.15, 0.3]} color="#E8A87C" intensity={0.3} distance={3} />
      <pointLight position={[0, 1.58, 0.25]} color="#E8A87C" intensity={0.15} distance={2} />
    </group>
  );
});

export default Avatar;
