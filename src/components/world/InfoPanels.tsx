'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { projects, experience, education, skills, certifications, summary, personalInfo } from '@/data/resume';

/**
 * Holographic info panels arranged around the robot in a semicircle.
 * Each panel displays a section of the resume: projects, experience, education, skills, certs.
 */

function HoloPanel({
  position,
  rotation = [0, 0, 0],
  title,
  titleColor = '#E8A87C',
  children,
  width = 3.5,
  height = 3,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const borderRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (borderRef.current) {
      const mat = borderRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    }
  });

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

      {/* Content area */}
      <group position={[0, 0, 0.02]}>
        {children}
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

      {/* Glow */}
      <pointLight position={[0, 0, 0.5]} color={titleColor} intensity={0.3} distance={4} />
    </group>
  );
}

function TextLine({
  text,
  y,
  color = '#c8c4bf',
  size = 0.09,
  bold = false,
  maxW = 3,
  align = 'left' as const,
  xOffset = -1.5,
}: {
  text: string;
  y: number;
  color?: string;
  size?: number;
  bold?: boolean;
  maxW?: number;
  align?: 'left' | 'center';
  xOffset?: number;
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
    >
      {text}
    </Text>
  );
}

export function ProjectsPanel() {
  return (
    <HoloPanel position={[-6, 2.5, -3]} rotation={[0, 0.4, 0]} title="▸ PROJECTS" width={4} height={4.5}>
      {projects.map((p, pi) => {
        const yBase = 1.5 - pi * 1.4;
        return (
          <group key={pi}>
            <TextLine text={p.name} y={yBase} color={p.color} size={0.13} bold />
            <TextLine text={p.subtitle} y={yBase - 0.18} color="#6B7280" size={0.08} />
            <TextLine text={p.stack.join(' · ')} y={yBase - 0.32} color="#E8A87C" size={0.07} />
            {p.bullets.map((b, bi) => (
              <TextLine
                key={bi}
                text={`› ${b}`}
                y={yBase - 0.48 - bi * 0.22}
                color="#9a968f"
                size={0.065}
                maxW={3.5}
              />
            ))}
          </group>
        );
      })}
    </HoloPanel>
  );
}

export function ExperiencePanel() {
  return (
    <HoloPanel position={[6, 2.5, -3]} rotation={[0, -0.4, 0]} title="▸ EXPERIENCE" titleColor="#6C9BCF" width={3.8} height={3.2}>
      <TextLine text={experience.title} y={0.9} color="#E6E1DC" size={0.13} bold />
      <TextLine text={experience.company} y={0.7} color="#E8A87C" size={0.1} />
      <TextLine text={experience.period} y={0.52} color="#6B7280" size={0.08} />
      {experience.bullets.map((b, i) => (
        <TextLine key={i} text={`› ${b}`} y={0.3 - i * 0.28} color="#9a968f" size={0.07} maxW={3.3} />
      ))}
    </HoloPanel>
  );
}

export function EducationPanel() {
  return (
    <HoloPanel position={[0, 2.8, -8]} rotation={[0, 0, 0]} title="▸ EDUCATION & CERTS" titleColor="#D35F5F" width={4.5} height={3}>
      {education.map((edu, i) => {
        const yBase = 0.7 - i * 0.8;
        return (
          <group key={i}>
            <TextLine text={edu.degree} y={yBase} color="#E6E1DC" size={0.11} bold />
            <TextLine text={edu.institution} y={yBase - 0.16} color="#E8A87C" size={0.09} />
            <TextLine text={`${edu.period} — ${edu.location}`} y={yBase - 0.3} color="#6B7280" size={0.08} />
          </group>
        );
      })}
      <TextLine text="─── CERTIFICATIONS ───" y={-1.0} color="#D35F5F" size={0.08} align="center" />
      {certifications.map((cert, i) => (
        <TextLine key={i} text={`◆ ${cert}`} y={-1.2 - i * 0.18} color="#9a968f" size={0.07} maxW={4} />
      ))}
    </HoloPanel>
  );
}

export function SkillsPanel() {
  const categories = [
    { label: 'LANGUAGES', items: skills.languages, color: '#E8A87C' },
    { label: 'AI / ML', items: skills.ai, color: '#6C9BCF' },
    { label: 'COMPUTER VISION', items: skills.cv, color: '#D35F5F' },
    { label: 'WEB & BACKEND', items: skills.web, color: '#E8A87C' },
    { label: 'SECURITY', items: skills.security, color: '#6C9BCF' },
    { label: 'DATA', items: skills.data, color: '#D35F5F' },
  ];

  return (
    <HoloPanel position={[-4, 2.5, -7]} rotation={[0, 0.25, 0]} title="▸ SKILLS" titleColor="#E8A87C" width={3.5} height={4.5}>
      {categories.map((cat, ci) => {
        const yBase = 1.5 - ci * 0.68;
        return (
          <group key={ci}>
            <TextLine text={cat.label} y={yBase} color={cat.color} size={0.09} bold />
            <TextLine
              text={cat.items.join(' • ')}
              y={yBase - 0.15}
              color="#8a867f"
              size={0.065}
              maxW={3}
            />
          </group>
        );
      })}
    </HoloPanel>
  );
}

export function IdentityPanel() {
  return (
    <HoloPanel position={[4, 2.5, -7]} rotation={[0, -0.25, 0]} title="▸ IDENTITY" titleColor="#6C9BCF" width={3} height={2.5}>
      <TextLine text={personalInfo.name} y={0.5} color="#E6E1DC" size={0.22} bold align="center" xOffset={0} />
      <TextLine text="Software Developer" y={0.2} color="#E8A87C" size={0.1} align="center" xOffset={0} />
      <TextLine text={summary.slice(0, 120) + '...'} y={-0.05} color="#8a867f" size={0.065} maxW={2.5} align="center" xOffset={0} />
      <TextLine text={`✉ ${personalInfo.email}`} y={-0.55} color="#6C9BCF" size={0.07} align="center" xOffset={0} />
      <TextLine text={`⌂ ${personalInfo.github}`} y={-0.7} color="#6C9BCF" size={0.07} align="center" xOffset={0} />
      <TextLine text={`☏ ${personalInfo.phone}`} y={-0.85} color="#6B7280" size={0.065} align="center" xOffset={0} />
    </HoloPanel>
  );
}
