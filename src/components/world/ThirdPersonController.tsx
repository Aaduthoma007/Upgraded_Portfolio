'use client';

import React, { useRef, ReactNode, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboard } from '@/hooks/useKeyboard';

interface ThirdPersonControllerProps {
  avatarRef: React.RefObject<THREE.Group | null>;
  isInteracting?: boolean;
  children: ReactNode | ((state: { isMoving: boolean; isRunning: boolean }) => ReactNode);
}

// Panel collision boxes (position + half-extents)
const PANEL_COLLIDERS = [
  { pos: [-6, 0, -3], hw: 2.5, hd: 0.5 },
  { pos: [6, 0, -3], hw: 2.3, hd: 0.5 },
  { pos: [0, 0, -8], hw: 2.8, hd: 0.5 },
  { pos: [-4, 0, -7], hw: 2.2, hd: 0.5 },
  { pos: [4, 0, -7], hw: 2.0, hd: 0.5 },
];

function checkCollision(newPos: THREE.Vector3, radius: number): boolean {
  for (const col of PANEL_COLLIDERS) {
    const dx = Math.abs(newPos.x - col.pos[0]);
    const dz = Math.abs(newPos.z - col.pos[2]);
    if (dx < col.hw + radius && dz < col.hd + radius) return true;
  }
  return false;
}

export default function ThirdPersonController({ avatarRef, isInteracting = false, children }: ThirdPersonControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const keys = useKeyboard();
  const [motionState, setMotionState] = useState({ isMoving: false, isRunning: false });

  const WALK_SPEED = 3.5;
  const RUN_SPEED = 7.0;
  const DAMPING = 0.88;
  const AVATAR_RADIUS = 0.35;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isInteracting) {
      velocity.current.multiplyScalar(0.5);
      groupRef.current.position.add(velocity.current);
      if (motionState.isMoving) setMotionState({ isMoving: false, isRunning: false });
      return;
    }

    const speed = keys.shift ? RUN_SPEED : WALK_SPEED;

    // Camera-relative movement
    const camera = state.camera;
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();

    direction.current.set(0, 0, 0);
    if (keys.forward) direction.current.add(cameraDirection);
    if (keys.backward) direction.current.sub(cameraDirection);
    if (keys.left) direction.current.sub(cameraRight);
    if (keys.right) direction.current.add(cameraRight);

    const hasInput = direction.current.length() > 0;

    if (hasInput) {
      direction.current.normalize();
      velocity.current.lerp(direction.current.multiplyScalar(speed * delta), 0.15);

      // Rotate avatar to face movement
      const angle = Math.atan2(direction.current.x, direction.current.z);
      const currentAngle = groupRef.current.rotation.y;
      const diff = angle - currentAngle;
      const wrappedDiff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      groupRef.current.rotation.y += wrappedDiff * 0.1;
    } else {
      velocity.current.multiplyScalar(DAMPING);
    }

    // === COLLISION CHECK ===
    const candidatePos = groupRef.current.position.clone().add(velocity.current);
    if (checkCollision(candidatePos, AVATAR_RADIUS)) {
      // Try sliding along X
      const slideX = groupRef.current.position.clone();
      slideX.x += velocity.current.x;
      if (!checkCollision(slideX, AVATAR_RADIUS)) {
        groupRef.current.position.x = slideX.x;
      }
      // Try sliding along Z
      const slideZ = groupRef.current.position.clone();
      slideZ.z += velocity.current.z;
      if (!checkCollision(slideZ, AVATAR_RADIUS)) {
        groupRef.current.position.z = slideZ.z;
      }
      velocity.current.multiplyScalar(0.3);
    } else {
      groupRef.current.position.add(velocity.current);
    }

    // Clamp to world bounds
    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -40, 40);
    groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -40, 40);
    groupRef.current.position.y = 0;

    // Update motion state for animation
    const moving = velocity.current.length() > 0.005;
    if (moving !== motionState.isMoving || keys.shift !== motionState.isRunning) {
      setMotionState({ isMoving: moving, isRunning: keys.shift });
    }
  });

  return (
    <group ref={groupRef}>
      {typeof children === 'function'
        ? children(motionState)
        : children}
    </group>
  );
}
