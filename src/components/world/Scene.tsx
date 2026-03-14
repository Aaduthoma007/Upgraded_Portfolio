'use client';

import React, { Suspense, useRef, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Grid } from '@react-three/drei';
import Avatar from './Avatar';
import ThirdPersonController from './ThirdPersonController';
import CinematicCamera from './CinematicCamera';
import { ProjectsPanel, ExperiencePanel, EducationPanel, SkillsPanel, IdentityPanel } from './InfoPanels';
import * as THREE from 'three';

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#667799" />
      <directionalLight
        position={[8, 18, 8]}
        intensity={1.8}
        color="#E8A87C"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-12, 14, -8]}
        angle={0.5}
        penumbra={0.9}
        intensity={2.2}
        color="#6C9BCF"
      />
      <pointLight position={[0, 6, 0]} intensity={1.0} color="#E8A87C" distance={30} />
      <pointLight position={[0, 2, 4]} intensity={0.6} color="#ffffff" distance={15} />
      <hemisphereLight args={['#334466', '#0B0E17', 0.3]} />
    </>
  );
}

/**
 * Structured command center floor — hexagonal pad with concentric rings
 * replacing the random infinite grid.
 */
function CommandCenterFloor() {
  return (
    <>
      {/* Central platform */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[4, 6]} />
        <meshPhysicalMaterial color="#0e1220" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Platform edge ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
        <ringGeometry args={[3.9, 4.05, 6]} />
        <meshBasicMaterial color="#E8A87C" transparent opacity={0.3} />
      </mesh>

      {/* Outer ring 1 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
        <ringGeometry args={[6, 6.05, 48]} />
        <meshBasicMaterial color="#6C9BCF" transparent opacity={0.12} />
      </mesh>

      {/* Outer ring 2 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
        <ringGeometry args={[9, 9.04, 48]} />
        <meshBasicMaterial color="#E8A87C" transparent opacity={0.08} />
      </mesh>

      {/* Subtle grid extending outward */}
      <Grid
        position={[0, 0, 0]}
        args={[80, 80]}
        cellSize={2}
        cellThickness={0.4}
        cellColor="#121830"
        sectionSize={8}
        sectionThickness={0.6}
        sectionColor="#1a2240"
        fadeDistance={45}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid
      />

      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#060912" roughness={0.95} metalness={0.1} />
      </mesh>
    </>
  );
}

/**
 * Floating geometric decorations around the perimeter
 * to give depth and structure without looking random.
 */
function AtmosphericElements() {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group1Ref.current) group1Ref.current.rotation.y += 0.001;
    if (group2Ref.current) group2Ref.current.rotation.y -= 0.0008;
  });

  const pillars = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = 14;
      positions.push([Math.cos(angle) * r, 0, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  return (
    <>
      {/* Perimeter marker pillars */}
      <group ref={group1Ref}>
        {pillars.map((pos, i) => (
          <group key={i} position={pos}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 4, 0.15]} />
              <meshPhysicalMaterial color="#141825" roughness={0.4} metalness={0.8} />
            </mesh>
            {/* Pillar accent */}
            <mesh position={[0, 2.05, 0]}>
              <boxGeometry args={[0.2, 0.05, 0.2]} />
              <meshPhysicalMaterial color="#1a2035" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Top glow */}
            <mesh position={[0, 2.1, 0]}>
              <boxGeometry args={[0.05, 0.02, 0.05]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#E8A87C' : '#6C9BCF'} transparent opacity={0.6} />
            </mesh>
            <pointLight
              position={[0, 2.2, 0]}
              color={i % 2 === 0 ? '#E8A87C' : '#6C9BCF'}
              intensity={0.15}
              distance={5}
            />
          </group>
        ))}
      </group>

      {/* Slow rotating outer ring of dust particles */}
      <group ref={group2Ref}>
        <Stars radius={60} depth={30} count={1500} factor={2} saturation={0.1} fade speed={0.3} />
      </group>
    </>
  );
}

// Standard React ErrorBoundary to catch WebGL context drops or crashes
class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL/Three.js Scene crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: '#0B0E17', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#E8A87C', fontFamily: 'var(--font-mono)', fontSize: 14,
        }}>
          [CRITICAL ERROR] 3D Environment Offline. Proceed in safe mode.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Scene() {
  const avatarRef = useRef<THREE.Group>(null);
  const [interactionState, setInteractionState] = React.useState<'idle' | 'reading'>('idle');

  return (
    <div className="world-container">
      <SceneErrorBoundary>
        <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#060912');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.6;
        }}
      >
        <fog attach="fog" args={['#060912', 30, 90]} />

        <SceneLights />
        <CommandCenterFloor />
        <AtmosphericElements />

        <Suspense fallback={null}>
          <ThirdPersonController avatarRef={avatarRef} isInteracting={interactionState === 'reading'}>
            {({ isMoving, isRunning }: { isMoving: boolean; isRunning: boolean }) => (
              <Avatar
                ref={avatarRef}
                isInteracting={interactionState === 'reading'}
                isMoving={isMoving}
                isRunning={isRunning}
              />
            )}
          </ThirdPersonController>

          <CinematicCamera avatarRef={avatarRef} />

          {/* Holographic info panels with ALL resume data */}
          <ProjectsPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} />
          <ExperiencePanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} />
          <EducationPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} />
          <SkillsPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} />
          <IdentityPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
    </div>
  );
}
