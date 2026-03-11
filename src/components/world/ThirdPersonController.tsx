'use client';

import React, { useRef, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboard } from '@/hooks/useKeyboard';

interface ThirdPersonControllerProps {
  avatarRef: React.RefObject<THREE.Group | null>;
  children: ReactNode;
}

export default function ThirdPersonController({ avatarRef, children }: ThirdPersonControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const keys = useKeyboard();

  const WALK_SPEED = 3.5;
  const RUN_SPEED = 7.0;
  const DAMPING = 0.88;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const speed = keys.shift ? RUN_SPEED : WALK_SPEED;

    // Calculate movement direction relative to camera
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

    if (direction.current.length() > 0) {
      direction.current.normalize();
      velocity.current.lerp(direction.current.multiplyScalar(speed * delta), 0.15);

      // Rotate avatar to face movement direction
      const angle = Math.atan2(direction.current.x, direction.current.z);
      const currentAngle = groupRef.current.rotation.y;
      const diff = angle - currentAngle;
      const wrappedDiff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      groupRef.current.rotation.y += wrappedDiff * 0.1;
    } else {
      velocity.current.multiplyScalar(DAMPING);
    }

    // Apply velocity
    groupRef.current.position.add(velocity.current);

    // Clamp to world bounds
    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -40, 40);
    groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -40, 40);
    groupRef.current.position.y = 0; // Stay on ground

    // Simple "walking" animation - bob up and down
    const isMoving = velocity.current.length() > 0.005;
    if (isMoving && avatarRef.current) {
      const bobSpeed = keys.shift ? 12 : 8;
      const bobAmount = keys.shift ? 0.06 : 0.04;
      avatarRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * bobSpeed)) * bobAmount;

      // Slight lean forward when moving
      avatarRef.current.rotation.x = 0.05;

      // Arm swing
      const armSwing = Math.sin(state.clock.elapsedTime * bobSpeed) * (keys.shift ? 0.3 : 0.15);
      const leftArm = avatarRef.current.children[5]; // left arm
      const rightArm = avatarRef.current.children[6]; // right arm
      if (leftArm) leftArm.rotation.x = armSwing;
      if (rightArm) rightArm.rotation.x = -armSwing;

      // Leg swing
      const legSwing = Math.sin(state.clock.elapsedTime * bobSpeed) * (keys.shift ? 0.4 : 0.2);
      const leftLeg = avatarRef.current.children[11]; // left leg
      const rightLeg = avatarRef.current.children[12]; // right leg
      if (leftLeg) leftLeg.rotation.x = legSwing;
      if (rightLeg) rightLeg.rotation.x = -legSwing;
    } else if (avatarRef.current) {
      // Idle breathing
      avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
      avatarRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
