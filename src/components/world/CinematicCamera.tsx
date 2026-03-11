'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAudioEngine } from '@/engine/AudioEngine';

interface CinematicCameraProps {
  avatarRef: React.RefObject<THREE.Group | null>;
}

export default function CinematicCamera({ avatarRef }: CinematicCameraProps) {
  const offset = useRef(new THREE.Vector3(0, 3.5, 7));
  const lookAtTarget = useRef(new THREE.Vector3());
  const shakeOffset = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!avatarRef.current) return;

    // Get avatar world position (through the controller group parent)
    const avatarWorldPos = new THREE.Vector3();
    avatarRef.current.parent?.getWorldPosition(avatarWorldPos);

    // Target camera position
    const targetPos = avatarWorldPos.clone().add(offset.current);

    // Smooth follow
    state.camera.position.lerp(targetPos, 0.04);

    // Look at avatar (slightly above feet)
    lookAtTarget.current.copy(avatarWorldPos);
    lookAtTarget.current.y += 1.6;
    state.camera.lookAt(lookAtTarget.current);

    // Camera shake from music
    const engine = getAudioEngine();
    const freqData = engine.getFrequencyData();
    if (freqData) {
      // Bass frequencies (first few bins)
      const bass = (freqData[0] + freqData[1] + freqData[2] + freqData[3]) / 4 / 255;
      if (bass > 0.7) {
        const intensity = (bass - 0.7) * 0.08;
        shakeOffset.current.set(
          (Math.random() - 0.5) * intensity,
          (Math.random() - 0.5) * intensity * 0.5,
          (Math.random() - 0.5) * intensity * 0.3,
        );
        state.camera.position.add(shakeOffset.current);
      }
    }
  });

  return null;
}
