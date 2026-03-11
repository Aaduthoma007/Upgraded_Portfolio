'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Tube } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '@/data/resume';

interface NetworkHubProps {
  position: [number, number, number];
}

export function NetworkHub({ position }: NetworkHubProps) {
  const packetsRef = useRef<THREE.Group>(null);

  // Create tube curves
  const curves = useMemo(() => {
    return [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3, 0.5, 0),
        new THREE.Vector3(-1, 1.5, 1),
        new THREE.Vector3(1, 0.8, -1),
        new THREE.Vector3(3, 1.2, 0),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 2, 1),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(2, 2.5, -1),
        new THREE.Vector3(4, 1, 1),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3, 1, -1),
        new THREE.Vector3(-1, 0.5, 1),
        new THREE.Vector3(1, 2, 0),
        new THREE.Vector3(3, 0.5, -1),
      ]),
    ];
  }, []);

  // Data packet positions (t values along curves)
  const packetData = useRef(
    curves.flatMap((_, ci) =>
      Array.from({ length: 3 }, (_, i) => ({
        curve: ci,
        t: (i / 3) + Math.random() * 0.2,
        speed: 0.15 + Math.random() * 0.1,
      }))
    )
  );

  useFrame((state) => {
    if (!packetsRef.current) return;

    packetData.current.forEach((packet, i) => {
      packet.t += packet.speed * 0.01;
      if (packet.t > 1) packet.t -= 1;

      const point = curves[packet.curve].getPoint(packet.t);
      const child = packetsRef.current!.children[i];
      if (child) {
        child.position.copy(point);
        // Pulse effect
        const scale = 0.06 + Math.sin(state.clock.elapsedTime * 5 + i) * 0.02;
        child.scale.setScalar(scale);
      }
    });
  });

  const project = projects[2]; // Network Analytics

  return (
    <group position={position}>
      {/* Glass pathway base */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[8, 0.1, 3]} />
        <meshPhysicalMaterial
          color="#1a2540"
          transmission={0.7}
          thickness={0.5}
          roughness={0.1}
          metalness={0.0}
          ior={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Data tubes */}
      {curves.map((curve, i) => (
        <Tube key={i} args={[curve, 64, 0.03, 8, false]}>
          <meshPhysicalMaterial
            color={['#E8A87C', '#6C9BCF', '#D35F5F'][i]}
            transmission={0.6}
            roughness={0.1}
            thickness={0.3}
            transparent
            opacity={0.4}
          />
        </Tube>
      ))}

      {/* Data packets */}
      <group ref={packetsRef}>
        {packetData.current.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={['#E8A87C', '#6C9BCF', '#D35F5F'][Math.floor(i / 3)]}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Hub nodes */}
      {[[-3, 0.8, 0], [0, 1.2, 0], [3, 0.8, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <octahedronGeometry args={[0.2, 0]} />
          <meshPhysicalMaterial
            color={['#E8A87C', '#6C9BCF', '#D35F5F'][i]}
            roughness={0.2}
            metalness={0.8}
            emissive={['#E8A87C', '#6C9BCF', '#D35F5F'][i]}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color="#6C9BCF"
        anchorX="center"
      >
        NETWORK HUB
      </Text>

      {/* Project info */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.15}
        color="#E6E1DC"
        anchorX="center"
        maxWidth={4}
      >
        {project.name}
      </Text>
      <Text
        position={[0, 2.7, 0]}
        fontSize={0.1}
        color="#6B7280"
        anchorX="center"
      >
        {project.stack.join(' • ')}
      </Text>

      {/* Ambient glow */}
      <pointLight position={[0, 1.5, 0]} color="#6C9BCF" intensity={1} distance={8} />
    </group>
  );
}
