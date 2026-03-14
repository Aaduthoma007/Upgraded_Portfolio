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
  readableContent?: React.ReactNode;
  width?: number;
  height?: number;
  avatarRef: React.RefObject<THREE.Group> | null;
  setInteractionState: React.Dispatch<React.SetStateAction<"idle" | "reading">>;
  onOpenOverlay?: (title: string, titleColor: string, content: React.ReactNode) => void;
}

function HoloPanel({
  position,
  rotation = [0, 0, 0],
  title,
  titleColor = '#E8A87C',
  children,
  readableContent,
  width = 3.5,
  height = 3,
  avatarRef,
  setInteractionState,
  onOpenOverlay,
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
        const avatarWorldPos = new THREE.Vector3();
        avatarRef.current.getWorldPosition(avatarWorldPos);
        const panelWorldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(panelWorldPos);
        const dist = avatarWorldPos.distanceTo(panelWorldPos);
        const near = dist < 3.5;
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

      {/* Clickable VIEW button when near panel */}
      {inProximity && !isReading && (
        <Html position={[0, -height / 2 - 0.15, 0.1]} center style={{ pointerEvents: 'auto' }}>
          <button
            onClick={() => {
              if (onOpenOverlay && readableContent) {
                setIsReading(true);
                onOpenOverlay(title, titleColor, readableContent);
              }
            }}
            style={{
              color: '#00e5ff',
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(0, 15, 25, 0.7)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              padding: '6px 18px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '1.5px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase' as const,
              opacity: 0.85,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.12)';
              e.currentTarget.style.borderColor = '#00e5ff';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 15, 25, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
              e.currentTarget.style.opacity = '0.85';
            }}
          >
            ⟩ view
          </button>
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

export function ProjectsPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'width' | 'height' | 'children' | 'readableContent'>) {
  const htmlContent = (
    <div>
      {projects.map((p, pi) => (
        <div key={pi} style={{ marginBottom: '24px' }}>
          <div style={{ color: p.color, fontSize: '16px', fontWeight: 700 }}>{p.name}</div>
          <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>{p.subtitle}</div>
          <div style={{ color: '#E8A87C', fontSize: '11px', marginTop: '6px' }}>{p.stack.join(' · ')}</div>
          <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
            {p.bullets.map((b, bi) => (
              <li key={bi} style={{ color: '#9a968f', fontSize: '12px', lineHeight: '1.7', marginTop: '4px' }}>› {b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
  return (
    <HoloPanel position={[-6, 2.5, -3]} rotation={[0, 0.4, 0]} title="▸ PROJECTS" width={4.5} height={5} readableContent={htmlContent} {...props}>
      {projects.map((p, pi) => {
        const yBase = 1.8 - pi * 1.6;
        return (
          <group key={pi}>
            <TextLine text={p.name} y={yBase} color={p.color} size={0.16} bold />
            <TextLine text={p.subtitle} y={yBase - 0.22} color="#6B7280" size={0.1} />
            <TextLine text={p.stack.join(' · ')} y={yBase - 0.38} color="#E8A87C" size={0.09} />
            {p.bullets.map((b, bi) => (
              <TextLine key={bi} text={`› ${b}`} y={yBase - 0.56 - bi * 0.26} color="#9a968f" size={0.08} maxW={4} />
            ))}
          </group>
        );
      })}
    </HoloPanel>
  );
}

export function ExperiencePanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children' | 'readableContent'>) {
  const htmlContent = (
    <div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#E6E1DC' }}>{experience.title}</div>
      <div style={{ color: '#E8A87C', fontSize: '13px', marginTop: '4px' }}>{experience.company}</div>
      <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{experience.period}</div>
      <ul style={{ margin: '12px 0 0 0', padding: 0, listStyle: 'none' }}>
        {experience.bullets.map((b, i) => (
          <li key={i} style={{ color: '#9a968f', fontSize: '12px', lineHeight: '1.7', marginTop: '6px' }}>› {b}</li>
        ))}
      </ul>
    </div>
  );
  return (
    <HoloPanel position={[6, 2.5, -3]} rotation={[0, -0.4, 0]} title="▸ EXPERIENCE" titleColor="#6C9BCF" width={4.2} height={3.8} readableContent={htmlContent} {...props}>
      <TextLine text={experience.title} y={1.1} color="#E6E1DC" size={0.16} bold />
      <TextLine text={experience.company} y={0.85} color="#E8A87C" size={0.12} />
      <TextLine text={experience.period} y={0.65} color="#6B7280" size={0.1} />
      {experience.bullets.map((b, i) => (
        <TextLine key={i} text={`› ${b}`} y={0.4 - i * 0.32} color="#9a968f" size={0.09} maxW={3.8} />
      ))}
    </HoloPanel>
  );
}

export function EducationPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children' | 'readableContent'>) {
  const htmlContent = (
    <div>
      {education.map((edu, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#E6E1DC' }}>{edu.degree}</div>
          <div style={{ color: '#E8A87C', fontSize: '12px', marginTop: '4px' }}>{edu.institution}</div>
          <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{edu.period} — {edu.location}</div>
        </div>
      ))}
      <div style={{ color: '#D35F5F', fontSize: '12px', marginTop: '16px', textAlign: 'center', letterSpacing: '2px' }}>─── CERTIFICATIONS ───</div>
      {certifications.map((cert, i) => (
        <div key={i} style={{ color: '#9a968f', fontSize: '12px', marginTop: '8px' }}>◆ {cert}</div>
      ))}
    </div>
  );
  return (
    <HoloPanel position={[0, 2.8, -8]} rotation={[0, 0, 0]} title="▸ EDUCATION & CERTS" titleColor="#D35F5F" width={5} height={3.5} readableContent={htmlContent} {...props}>
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

export function SkillsPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children' | 'readableContent'>) {
  const categories = [
    { label: 'LANGUAGES', items: skills.languages, color: '#E8A87C' },
    { label: 'AI / ML', items: skills.ai, color: '#6C9BCF' },
    { label: 'COMPUTER VISION', items: skills.cv, color: '#D35F5F' },
    { label: 'WEB & BACKEND', items: skills.web, color: '#E8A87C' },
    { label: 'SECURITY', items: skills.security, color: '#6C9BCF' },
    { label: 'DATA', items: skills.data, color: '#D35F5F' },
  ];
  const htmlContent = (
    <div>
      {categories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: '14px' }}>
          <div style={{ color: cat.color, fontSize: '13px', fontWeight: 700, letterSpacing: '1px' }}>{cat.label}</div>
          <div style={{ color: '#8a867f', fontSize: '12px', marginTop: '4px', lineHeight: '1.6' }}>{cat.items.join(' • ')}</div>
        </div>
      ))}
    </div>
  );
  return (
    <HoloPanel position={[-4, 2.5, -7]} rotation={[0, 0.25, 0]} title="▸ SKILLS" titleColor="#E8A87C" width={4} height={5} readableContent={htmlContent} {...props}>
      {categories.map((cat, ci) => {
        const yBase = 1.8 - ci * 0.78;
        return (
          <group key={ci}>
            <TextLine text={cat.label} y={yBase} color={cat.color} size={0.12} bold />
            <TextLine text={cat.items.join(' • ')} y={yBase - 0.18} color="#8a867f" size={0.085} maxW={3.5} />
          </group>
        );
      })}
    </HoloPanel>
  );
}

export function IdentityPanel(props: Omit<HoloPanelProps, 'position' | 'rotation' | 'title' | 'titleColor' | 'width' | 'height' | 'children' | 'readableContent'>) {
  const htmlContent = (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#E6E1DC' }}>{personalInfo.name}</div>
      <div style={{ color: '#E8A87C', fontSize: '14px', marginTop: '8px' }}>Software Developer</div>
      <div style={{ color: '#8a867f', fontSize: '12px', marginTop: '12px', lineHeight: '1.7' }}>{summary}</div>
      <div style={{ marginTop: '20px', color: '#6C9BCF', fontSize: '12px' }}>✉ {personalInfo.email}</div>
      <div style={{ color: '#6C9BCF', fontSize: '12px', marginTop: '6px' }}>⌂ {personalInfo.github}</div>
      <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '6px' }}>☏ {personalInfo.phone}</div>
    </div>
  );
  return (
    <HoloPanel position={[4, 2.5, -7]} rotation={[0, -0.25, 0]} title="▸ IDENTITY" titleColor="#6C9BCF" width={3.5} height={3} readableContent={htmlContent} {...props}>
      <TextLine text={personalInfo.name} y={0.7} color="#E6E1DC" size={0.28} bold align="center" xOffset={0} />
      <TextLine text="Software Developer" y={0.35} color="#E8A87C" size={0.14} align="center" xOffset={0} />
      <TextLine text={summary.slice(0, 150) + '...'} y={0.1} color="#8a867f" size={0.08} maxW={3} align="center" xOffset={0} />
      <TextLine text={`✉ ${personalInfo.email}`} y={-0.5} color="#6C9BCF" size={0.1} align="center" xOffset={0} />
      <TextLine text={`⌂ ${personalInfo.github}`} y={-0.68} color="#6C9BCF" size={0.1} align="center" xOffset={0} />
      <TextLine text={`☏ ${personalInfo.phone}`} y={-0.86} color="#6B7280" size={0.09} align="center" xOffset={0} />
    </HoloPanel>
  );
}
