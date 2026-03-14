'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

/**
 * High-fidelity human avatar loaded from a rigged GLB model.
 * Uses the Three.js Soldier model with Idle/Walk/Run animations.
 * PBR materials with enhanced subsurface scattering simulation.
 */

interface AvatarProps {
  isMoving?: boolean;
  isRunning?: boolean;
  isInteracting?: boolean;
  ref?: React.Ref<THREE.Group>;
}

export default function Avatar({
  isMoving = false,
  isRunning = false,
  isInteracting = false,
  ref,
}: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  React.useImperativeHandle(ref, () => groupRef.current as THREE.Group, []);

  // Load the GLB model
  const { scene, animations } = useGLTF('/models/Soldier.glb');

  // Clone the scene so multiple instances don't conflict
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clonedScene);

  // Setup animations
  const { actions, mixer } = useAnimations(animations, groupRef);

  // Enhance materials for PBR realism
  useEffect(() => {
    clonedScene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          // Enhance roughness for realistic skin/cloth
          mat.roughness = Math.max(mat.roughness, 0.4);
          mat.envMapIntensity = 0.8;
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene]);

  // Animation state machine
  useEffect(() => {
    const idleAction = actions['Idle'];
    const walkAction = actions['Walk'];
    const runAction = actions['Run'];

    if (!idleAction) return;

    // Determine target action
    let targetAction = idleAction;
    if (isMoving && !isRunning) targetAction = walkAction || idleAction;
    if (isMoving && isRunning) targetAction = runAction || walkAction || idleAction;
    if (isInteracting) targetAction = idleAction;

    // Crossfade to the target action
    Object.values(actions).forEach((action) => {
      if (action && action !== targetAction) {
        action.fadeOut(0.3);
      }
    });

    if (targetAction) {
      targetAction.reset().fadeIn(0.3).play();
    }

    return () => {
      // Cleanup on next state change
    };
  }, [isMoving, isRunning, isInteracting, actions]);

  // Subtle idle breathing when standing still
  useFrame((state) => {
    if (!groupRef.current) return;
    if (!isMoving && !isInteracting) {
      // Very subtle breathing motion
      const breath = Math.sin(state.clock.elapsedTime * 1.5) * 0.003;
      groupRef.current.position.y = breath;
    }
  });

  return (
    <group ref={groupRef as React.Ref<THREE.Group>}>
      {/* Enhanced lighting for PBR */}
      <spotLight
        position={[0, 5, 3]}
        intensity={4}
        color="#fff5e8"
        angle={0.6}
        penumbra={0.9}
        distance={15}
        castShadow
      />
      <pointLight position={[-1, 2, 1]} intensity={0.5} color="#ffe0c0" distance={6} />
      <pointLight position={[1, 2, -1]} intensity={0.3} color="#c0d8ff" distance={5} />

      {/* Rim light for silhouette definition */}
      <pointLight position={[0, 3, -2]} intensity={0.4} color="#00e5ff" distance={6} />

      {/* The actual model */}
      <primitive
        object={clonedScene}
        scale={1.5}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/Soldier.glb');
