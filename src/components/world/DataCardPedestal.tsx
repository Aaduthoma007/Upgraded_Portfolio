'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

interface DataCardPedestalProps {
  position?: [number, number, number];
  avatarRef: React.RefObject<THREE.Group | null>;
  onStateChange: (state: 'idle' | 'reading') => void;
}

export default function DataCardPedestal({ position = [0, 0, -4], avatarRef, onStateChange }: DataCardPedestalProps) {
  const pedestalRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  
  const [inProximity, setInProximity] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  // Proximity check
  useFrame(() => {
    if (!avatarRef.current || !pedestalRef.current) return;
    
    const dist = avatarRef.current.position.distanceTo(pedestalRef.current.position);
    const near = dist < 2.5; // Trigger range
    
    if (near !== inProximity) {
      setInProximity(near);
    }
  });

  // Card bobbing animation
  useFrame((state) => {
    if (cardRef.current && !isReading) {
      cardRef.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      cardRef.current.rotation.y += 0.01;
    }
  });

  // Progress logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      setReadProgress(0);
      onStateChange('reading');
      interval = setInterval(() => {
        setReadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setReadProgress(0);
      onStateChange('idle');
    }
    return () => clearInterval(interval);
  }, [isReading, onStateChange]);

  const handleReadClick = () => {
    setIsReading(true);
  };

  const handleDoneClick = () => {
    setIsReading(false);
  };

  return (
    <group ref={pedestalRef} position={position}>
      {/* Pedestal Base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 32]} />
        <meshPhysicalMaterial color="#1a1d24" roughness={0.7} metalness={0.5} />
      </mesh>
      
      {/* Pedestal Top Ring */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[0.3, 0.02, 16, 32]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      {/* Floating Data Card */}
      <mesh ref={cardRef} castShadow>
        <boxGeometry args={[0.4, 0.25, 0.02]} />
        <meshPhysicalMaterial 
          color="#00e5ff" 
          transparent 
          opacity={0.8}
          transmission={0.9} 
          roughness={0.1}
          clearcoat={1}
        />
        {/* Inner Card Glow */}
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      
      {/* Card Light */}
      <pointLight position={[0, 1.2, 0]} color="#00e5ff" intensity={0.5} distance={3} />

      {/* Interaction UI */}
      {inProximity && !isReading && (
        <Html position={[0, 1.7, 0]} center>
          <div className="interaction-prompt" onClick={handleReadClick}>
            <div className="bracket">[</div>
            <span>READ DATA</span>
            <div className="bracket">]</div>
          </div>
        </Html>
      )}

      {/* Reading UI */}
      {isReading && (
        <Html position={[0, 1.7, 0]} center zIndexRange={[100, 0]}>
          <div className="scanning-ui">
            <div className="scan-header">SYSTEM DIAGNOSTIC . . .</div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${readProgress}%` }}
              />
            </div>
            <div className="scan-text">
              {readProgress < 100 ? `ANALYZING... ${readProgress}%` : 'DATA ACQUIRED'}
            </div>
            {readProgress === 100 && (
              <button className="done-btn" onClick={handleDoneClick}>
                [ DONE ]
              </button>
            )}
          </div>
        </Html>
      )}

      {/* Global styles for this component */}
      <Html>
        <style>{`
          .interaction-prompt {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            color: #00e5ff;
            font-family: var(--font-mono);
            font-size: 14px;
            background: rgba(0, 20, 30, 0.8);
            padding: 8px 16px;
            border: 1px solid rgba(0, 229, 255, 0.3);
            backdrop-filter: blur(4px);
            transition: all 0.2s;
          }
          .interaction-prompt:hover {
            background: rgba(0, 229, 255, 0.2);
            transform: scale(1.05);
          }
          .bracket {
            opacity: 0.5;
          }
          .scanning-ui {
            width: 250px;
            background: rgba(0, 10, 15, 0.9);
            border: 1px solid #00e5ff;
            padding: 16px;
            color: #00e5ff;
            font-family: var(--font-mono);
            font-size: 12px;
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
          }
          .scan-header {
            margin-bottom: 12px;
            opacity: 0.8;
            letter-spacing: 2px;
          }
          .progress-bar-container {
            width: 100%;
            height: 4px;
            background: rgba(0, 229, 255, 0.2);
            margin-bottom: 8px;
            overflow: hidden;
          }
          .progress-bar-fill {
            height: 100%;
            background: #00e5ff;
            transition: width 0.1s linear;
            box-shadow: 0 0 10px #00e5ff;
          }
          .scan-text {
            margin-bottom: 16px;
          }
          .done-btn {
            width: 100%;
            background: transparent;
            border: 1px solid #00e5ff;
            color: #00e5ff;
            font-family: var(--font-mono);
            padding: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .done-btn:hover {
            background: rgba(0, 229, 255, 0.2);
          }
        `}</style>
      </Html>
    </group>
  );
}
