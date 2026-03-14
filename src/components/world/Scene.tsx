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
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(t * 1.2) * 0.1;
    if (ring2Ref.current) (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 0.8 + 1) * 0.08;
    if (ring3Ref.current) (ring3Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 0.6 + 2) * 0.06;
  });

  return (
    <>
      {/* Central hexagonal platform */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[4, 6]} />
        <meshPhysicalMaterial color="#0a0f1e" roughness={0.3} metalness={0.7} clearcoat={0.4} />
      </mesh>

      {/* Platform neon edge */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.85, 4.08, 6]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.18} />
      </mesh>

      {/* Inner pulsing ring */}
      <mesh ref={ring1Ref} rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
        <ringGeometry args={[5.8, 6.0, 48]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.1} />
      </mesh>

      {/* Mid pulsing ring */}
      <mesh ref={ring2Ref} rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
        <ringGeometry args={[9.5, 9.65, 64]} />
        <meshBasicMaterial color="#E8A87C" transparent opacity={0.06} />
      </mesh>

      {/* Outer pulsing ring */}
      <mesh ref={ring3Ref} rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[14, 14.1, 64]} />
        <meshBasicMaterial color="#6C9BCF" transparent opacity={0.04} />
      </mesh>

      {/* Neon grid floor */}
      <Grid
        position={[0, 0.001, 0]}
        args={[200, 200]}
        cellSize={2}
        cellThickness={0.3}
        cellColor="#0a3a50"
        sectionSize={10}
        sectionThickness={0.5}
        sectionColor="#082a3a"
        fadeDistance={50}
        fadeStrength={1.8}
        followCamera={false}
        infiniteGrid
      />

      {/* Ground glow lights */}
      <pointLight position={[0, 0.1, 0]} color="#00e5ff" intensity={0.15} distance={10} />
      <pointLight position={[8, 0.1, -4]} color="#6C9BCF" intensity={0.08} distance={6} />
      <pointLight position={[-8, 0.1, -4]} color="#E8A87C" intensity={0.08} distance={6} />

      {/* Ground plane — dark reflective */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshPhysicalMaterial color="#040810" roughness={0.7} metalness={0.3} clearcoat={0.15} />
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
  const nebulaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group1Ref.current) group1Ref.current.rotation.y += 0.001;
    if (group2Ref.current) group2Ref.current.rotation.y -= 0.0005;
    if (nebulaRef.current) nebulaRef.current.rotation.y += 0.0002;
  });

  const pillars = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 16;
      positions.push([Math.cos(angle) * r, 0, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  return (
    <>
      {/* ═══ MASSIVE STARFIELD SKY ═══ */}
      <group position={[0, 30, 0]}>
        <Stars radius={150} depth={80} count={8000} factor={4} saturation={0.2} fade speed={0.4} />
      </group>
      {/* Second warm star layer for depth */}
      <group ref={group2Ref} position={[0, 20, 0]}>
        <Stars radius={100} depth={50} count={3000} factor={2.5} saturation={0.5} fade speed={0.2} />
      </group>

      {/* ═══ NEBULA GLOW (distant colored lights) ═══ */}
      <group ref={nebulaRef}>
        <pointLight position={[40, 30, -60]} color="#6C9BCF" intensity={0.8} distance={120} />
        <pointLight position={[-50, 25, -40]} color="#E8A87C" intensity={0.5} distance={100} />
        <pointLight position={[30, 40, 50]} color="#9b59b6" intensity={0.3} distance={80} />
        <pointLight position={[-40, 35, 30]} color="#00e5ff" intensity={0.25} distance={90} />
      </group>

      {/* ═══ PERIMETER PILLARS ═══ */}
      <group ref={group1Ref}>
        {pillars.map((pos, i) => (
          <group key={i} position={pos}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 5, 0.12]} />
              <meshPhysicalMaterial color="#0c1020" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Pillar neon strip */}
            <mesh position={[0, 0, 0.065]}>
              <boxGeometry args={[0.02, 4.5, 0.01]} />
              <meshBasicMaterial color={i % 3 === 0 ? '#00e5ff' : i % 3 === 1 ? '#E8A87C' : '#6C9BCF'} transparent opacity={0.5} />
            </mesh>
            {/* Top accent */}
            <mesh position={[0, 2.55, 0]}>
              <boxGeometry args={[0.2, 0.04, 0.2]} />
              <meshPhysicalMaterial color="#141A2e" roughness={0.2} metalness={0.95} />
            </mesh>
            {/* Top glow */}
            <mesh position={[0, 2.6, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#00e5ff' : '#E8A87C'} />
            </mesh>
            <pointLight
              position={[0, 2.7, 0]}
              color={i % 2 === 0 ? '#00e5ff' : '#E8A87C'}
              intensity={0.3}
              distance={6}
            />
          </group>
        ))}
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
  const [readingPanel, setReadingPanel] = React.useState<{
    title: string;
    titleColor: string;
    content: React.ReactNode;
  } | null>(null);

  const openOverlay = React.useCallback((title: string, titleColor: string, content: React.ReactNode) => {
    setReadingPanel({ title, titleColor, content });
    setInteractionState('reading');
  }, []);

  const closeOverlay = React.useCallback(() => {
    setReadingPanel(null);
    setInteractionState('idle');
  }, []);

  // Escape key to close overlay
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && readingPanel) closeOverlay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [readingPanel, closeOverlay]);

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
        <fog attach="fog" args={['#060912', 50, 150]} />

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
          <ProjectsPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} onOpenOverlay={openOverlay} />
          <ExperiencePanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} onOpenOverlay={openOverlay} />
          <EducationPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} onOpenOverlay={openOverlay} />
          <SkillsPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} onOpenOverlay={openOverlay} />
          <IdentityPanel avatarRef={avatarRef as React.RefObject<THREE.Group>} setInteractionState={setInteractionState} onOpenOverlay={openOverlay} />
        </Suspense>
      </Canvas>

      {/* ═══ FULLSCREEN READABLE OVERLAY (outside Canvas) ═══ */}
      {readingPanel && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(6, 9, 18, 0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            width: '90%',
            maxWidth: '720px',
            maxHeight: '82vh',
            overflowY: 'auto',
            background: 'linear-gradient(145deg, rgba(14, 18, 32, 0.97), rgba(10, 14, 28, 0.95))',
            border: `1px solid ${readingPanel.titleColor}35`,
            borderRadius: '16px',
            padding: '32px 36px',
            color: '#E6E1DC',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '13px',
            lineHeight: '1.7',
            boxShadow: `0 0 80px ${readingPanel.titleColor}15, 0 0 200px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: `1px solid ${readingPanel.titleColor}25`, paddingBottom: '16px', marginBottom: '24px'
            }}>
              <div style={{
                color: readingPanel.titleColor, fontSize: '14px', letterSpacing: '3px', fontWeight: 600,
                textShadow: `0 0 20px ${readingPanel.titleColor}40`,
              }}>
                {readingPanel.title}
              </div>
              <button
                onClick={closeOverlay}
                style={{
                  color: '#ff6b6b',
                  fontFamily: "'JetBrains Mono', monospace",
                  background: 'rgba(255, 107, 107, 0.06)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 107, 107, 0.15)';
                  e.currentTarget.style.borderColor = '#ff6b6b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 107, 107, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                }}
              >
                ✕ BACK
              </button>
            </div>
            {/* Content */}
            <div>{readingPanel.content}</div>
          </div>
        </div>
      )}

    </SceneErrorBoundary>
    </div>
  );
}
