'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { projects, experience, education, skills, certifications, summary, personalInfo } from '@/data/resume';
import { useKeyboard } from '@/hooks/useKeyboard';

interface HoloPanelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  titleColor?: string;
  children: React.ReactNode | ((opacity: number) => React.ReactNode);
  width?: number;
  height?: number;
  avatarRef: React.RefObject<THREE.Group> | null;
  setInteractionState: React.Dispatch<React.SetStateAction<"idle" | "reading">>;
}

function HoloPanel({
  position,
  rotation = [0, 0, 0],
  title,
  titleColor = '#E8A87C',
  children,
  width = 3.5,
  height = 3,
  avatarRef,
  setInteractionState,
}: HoloPanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const borderRef = useRef<THREE.Mesh>(null);
  
  const [inProximity, setInProximity] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  
  const keys = useKeyboard();

  // Proximity check and content fade
  useFrame((state) => {
    // Floating animation
    if (borderRef.current) {
      const mat = borderRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      
      // Distance check
      if (avatarRef?.current) {
        const dist = avatarRef.current.position.distanceTo(groupRef.current.position);
        const near = dist < 4.0;
        if (near !== inProximity) {
          setInProximity(near);
          if (!near && isReading) {
            setIsReading(false);
            setInteractionState('idle');
          }
        }
      }
    }

    // Content always visible
    const targetOpacity = 1;
    setContentOpacity((prev) => prev + (targetOpacity - prev) * 0.1);
  });

  // Handle Enter key to toggle reading, Escape to close
  useEffect(() => {
    if (inProximity && keys.enter) {
      setIsReading((prev) => {
        const next = !prev;
        setInteractionState(next ? 'reading' : 'idle');
        return next;
      });
    }
    if (isReading && keys.escape) {
      setIsReading(false);
      setInteractionState('idle');
    }
  }, [inProximity, keys.enter, keys.escape, isReading, setInteractionState]);

  return (
    <group ref={groupRef} position={position} rotation={rotation as unknown as THREE.Euler}>
      {/* Panel background */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#0B0E17" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Border frame */}
      <mesh ref={borderRef} position={[0, 0, -0.005]}>
        <planeGeometry args={[width + 0.05, height + 0.05]} />
        <meshBasicMaterial color={titleColor} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Top accent line */}
      <mesh position={[0, height / 2 - 0.01, 0.01]}>
        <planeGeometry args={[width - 0.1, 0.005]} />
        <meshBasicMaterial color={titleColor} transparent opacity={0.6} />
      </mesh>

      {/* Bottom accent line */}
      <mesh position={[0, -height / 2 + 0.01, 0.01]}>
        <planeGeometry args={[width - 0.1, 0.003]} />
        <meshBasicMaterial color={titleColor} transparent opacity={0.3} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, height / 2 - 0.18, 0.02]}
        fontSize={0.16}
        color={titleColor}
        anchorX="center"
        letterSpacing={0.1}
      >
        {title}
      </Text>

      {/* Content area — always visible */}
      <group position={[0, 0, 0.02]}>
        {typeof children === 'function' ? children(contentOpacity) : children}
      </group>

      {/* Corner brackets */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => (
        <group key={i} position={[(width / 2 - 0.05) * sx, (height / 2 - 0.05) * sy, 0.01]}>
          <mesh>
            <planeGeometry args={[0.08, 0.005]} />
            <meshBasicMaterial color={titleColor} transparent opacity={0.5} />
          </mesh>
          <mesh>
            <planeGeometry args={[0.005, 0.08]} />
            <meshBasicMaterial color={titleColor} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Interaction Prompt */}
      {inProximity && !isReading && (
        <Html position={[0, 0, 0.1]} center>
          <div style={{
            color: '#00e5ff',
            fontFamily: 'monospace',
            background: 'rgba(0,20,30,0.85)',
            border: '1px solid #00e5ff',
            padding: '10px 20px',
            whiteSpace: 'nowrap',
            borderRadius: '8px',
            fontSize: '14px',
            letterSpacing: '2px',
            boxShadow: '0 0 20px rgba(0,229,255,0.3)',
            animation: 'pulse 1.5s infinite'
          }}>
            ⟩ PRESS ENTER TO VIEW
          </div>
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.6; box-shadow: 0 0 5px #00e5ff; }
              50% { opacity: 1; box-shadow: 0 0 20px #00e5ff; }
              100% { opacity: 0.6; box-shadow: 0 0 5px #00e5ff; }
            }
          `}</style>
        </Html>
      )}

      {/* Full-screen readable overlay when reading */}
      {isReading && (
        <Html fullscreen zIndexRange={[100, 0]}>
          <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(6, 9, 18, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}>
            <div style={{
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflowY: 'auto',
              background: 'rgba(14, 18, 32, 0.95)',
              border: `1px solid ${titleColor}40`,
              borderRadius: '16px',
              padding: '32px 36px',
              color: '#E6E1DC',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '13px',
              lineHeight: '1.7',
              boxShadow: `0 0 60px ${titleColor}20, 0 0 120px rgba(0,0,0,0.5)`,
            }}>
              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: `1px solid ${titleColor}30`, paddingBottom: '16px', marginBottom: '20px'
              }}>
                <div style={{ color: titleColor, fontSize: '15px', letterSpacing: '3px', fontWeight: 600 }}>
                  {title}
                </div>
                <div style={{
                  color: '#6B7280', fontSize: '11px', letterSpacing: '1px',
                }}>
                  PRESS ENTER OR ESC TO CLOSE
                </div>
              </div>
              {/* Render children content */}
              <div>
                {typeof children === 'function' ? children(1) : children}
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Glow */}
      <pointLight position={[0, 0, 0.5]} color={titleColor} intensity={0.3} distance={4} />
    </group>
  );
}

function TextLine({
  text,
  y,
  color = '#c8c4bf',
  size = 0.12,
  bold = false,
  maxW = 3.5,
  align = 'left' as const,
  xOffset = -1.8,
  opacity = 1,
}: {
  text: string;
  y: number;
  color?: string;
  size?: number;
  bold?: boolean;
  maxW?: number;
  align?: 'left' | 'center';
  xOffset?: number;
  opacity?: number;
}) {
  return (
    <Text
      position={[align === 'center' ? 0 : xOffset, y, 0]}
      fontSize={size}
      color={color}
      anchorX={align}
      anchorY="top"
      maxWidth={maxW}
      fontWeight={bold ? 'bold' : undefined}
      fillOpacity={opacity}
    >
      {text}
    </Text>
  );
}

export function ProjectsPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'width' | 'height' | 'children'>) {
  return (
    <HoloPanel position={[-6, 2.5, -3]} rotation={[0, 0.4, 0]} title="▸ PROJECTS" width={4.5} height={5} {...props}>
      {projects.map((p, pi) => {
        const yBase = 1.8 - pi * 1.6;
        return (
          <group key={pi}>
            <TextLine text={p.name} y={yBase} color={p.color} size={0.16} bold />
            <TextLine text={p.subtitle} y={yBase - 0.22} color="#6B7280" size={0.1} />
            <TextLine text={p.stack.join(' · ')} y={yBase - 0.38} color="#E8A87C" size={0.09} />
            {p.bullets.map((b, bi) => (
              <TextLine
                key={bi}
                text={`› ${b}`}
                y={yBase - 0.56 - bi * 0.26}
                color="#9a968f"
                size={0.08}
                maxW={4}
              />
            ))}
          </group>
        );
      })}
    </HoloPanel>
  );
}

export function ExperiencePanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children'>) {
  return (
    <HoloPanel position={[6, 2.5, -3]} rotation={[0, -0.4, 0]} title="▸ EXPERIENCE" titleColor="#6C9BCF" width={4.2} height={3.8} {...props}>
      <TextLine text={experience.title} y={1.1} color="#E6E1DC" size={0.16} bold />
      <TextLine text={experience.company} y={0.85} color="#E8A87C" size={0.12} />
      <TextLine text={experience.period} y={0.65} color="#6B7280" size={0.1} />
      {experience.bullets.map((b, i) => (
        <TextLine key={i} text={`› ${b}`} y={0.4 - i * 0.32} color="#9a968f" size={0.09} maxW={3.8} />
      ))}
    </HoloPanel>
  );
}

export function EducationPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children'>) {
  return (
    <HoloPanel position={[0, 2.8, -8]} rotation={[0, 0, 0]} title="▸ EDUCATION & CERTS" titleColor="#D35F5F" width={5} height={3.5} {...props}>
      {education.map((edu, i) => {
        const yBase = 0.9 - i * 0.9;
        return (
          <group key={i}>
            <TextLine text={edu.degree} y={yBase} color="#E6E1DC" size={0.14} bold />
            <TextLine text={edu.institution} y={yBase - 0.2} color="#E8A87C" size={0.11} />
            <TextLine text={`${edu.period} — ${edu.location}`} y={yBase - 0.36} color="#6B7280" size={0.1} />
          </group>
        );
      })}
      <TextLine text="─── CERTIFICATIONS ───" y={-1.0} color="#D35F5F" size={0.1} align="center" />
      {certifications.map((cert, i) => (
        <TextLine key={i} text={`◆ ${cert}`} y={-1.2 - i * 0.22} color="#9a968f" size={0.09} maxW={4.5} />
      ))}
    </HoloPanel>
  );
}

export function SkillsPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children'>) {
  const categories = [
    { label: 'LANGUAGES', items: skills.languages, color: '#E8A87C' },
    { label: 'AI / ML', items: skills.ai, color: '#6C9BCF' },
    { label: 'COMPUTER VISION', items: skills.cv, color: '#D35F5F' },
    { label: 'WEB & BACKEND', items: skills.web, color: '#E8A87C' },
    { label: 'SECURITY', items: skills.security, color: '#6C9BCF' },
    { label: 'DATA', items: skills.data, color: '#D35F5F' },
  ];

  return (
    <HoloPanel position={[-4, 2.5, -7]} rotation={[0, 0.25, 0]} title="▸ SKILLS" titleColor="#E8A87C" width={4} height={5} {...props}>
      {categories.map((cat, ci) => {
        const yBase = 1.8 - ci * 0.78;
        return (
          <group key={ci}>
            <TextLine text={cat.label} y={yBase} color={cat.color} size={0.12} bold />
            <TextLine
              text={cat.items.join(' • ')}
              y={yBase - 0.18}
              color="#8a867f"
              size={0.085}
              maxW={3.5}
            />
          </group>
        );
      })}
    </HoloPanel>
  );
}

export function IdentityPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children'>) {
  return (
    <HoloPanel position={[4, 2.5, -7]} rotation={[0, -0.25, 0]} title="▸ IDENTITY" titleColor="#6C9BCF" width={3.5} height={3} {...props}>
      <TextLine text={personalInfo.name} y={0.7} color="#E6E1DC" size={0.28} bold align="center" xOffset={0} />
      <TextLine text="Software Developer" y={0.35} color="#E8A87C" size={0.14} align="center" xOffset={0} />
      <TextLine text={summary.slice(0, 150) + '...'} y={0.1} color="#8a867f" size={0.08} maxW={3} align="center" xOffset={0} />
      <TextLine text={`✉ ${personalInfo.email}`} y={-0.5} color="#6C9BCF" size={0.1} align="center" xOffset={0} />
      <TextLine text={`⌂ ${personalInfo.github}`} y={-0.68} color="#6C9BCF" size={0.1} align="center" xOffset={0} />
      <TextLine text={`☏ ${personalInfo.phone}`} y={-0.86} color="#6B7280" size={0.09} align="center" xOffset={0} />
    </HoloPanel>
  );
}
