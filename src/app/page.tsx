'use client';

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { useAudio } from '@/hooks/useAudio';
import { useKeyboard } from '@/hooks/useKeyboard';
import BoringResume from '@/components/boring/BoringResume';
import GlitchText from '@/components/boring/GlitchText';
import BiometricScanner from '@/components/boring/BiometricScanner';
import DiagnosticOverlay from '@/components/diagnostic/DiagnosticOverlay';

// Lazy-load heavy 3D components
const Scene = lazy(() => import('@/components/world/Scene'));
const BreachTransition = lazy(() => import('@/components/breach/BreachTransition'));

export default function HomePage() {
  const { isBreached, isDiagnostic, isTransitioning, toggleDiagnostic } = usePortfolioStore();
  const { initAndPreload, playBoring, audioReady } = useAudio();
  const keys = useKeyboard();

  const [showScene, setShowScene] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showBreach, setShowBreach] = useState(false);

  // Handle first interaction — unlock audio
  const handleFirstInteraction = useCallback(async () => {
    if (hasInteracted) return;
    setHasInteracted(true);
    try {
      await initAndPreload();
      playBoring();
    } catch (e) {
      console.warn('Audio init failed, continuing without audio:', e);
    }
    setIsLoading(false);
  }, [hasInteracted, initAndPreload, playBoring]);

  // Click anywhere to init audio
  useEffect(() => {
    const handler = () => handleFirstInteraction();
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [handleFirstInteraction]);

  // Auto-init (loading screen will show until ready)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && !hasInteracted) {
        // Show the resume even before interaction
        setIsLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isLoading, hasInteracted]);

  // TAB key for diagnostic mode
  useEffect(() => {
    if (keys.tab && isBreached) {
      toggleDiagnostic();
    }
  }, [keys.tab, isBreached, toggleDiagnostic]);

  // Breach trigger
  const handleScan = useCallback(() => {
    if (isTransitioning || isBreached) return;
    setShowBreach(true);
  }, [isTransitioning, isBreached]);

  const handleBreachComplete = useCallback(() => {
    setShowScene(true);
  }, []);

  return (
    <>
      {/* Loading screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-text">
            Loading<span className="loading-dots" />
          </div>
        </div>
      )}

      {/* Boring state */}
      {!isBreached && !isLoading && (
        <>
          <BoringResume />
          <GlitchText />
          <BiometricScanner onScan={handleScan} />
        </>
      )}

      {/* Breach transition */}
      {showBreach && !isBreached && (
        <Suspense fallback={null}>
          <BreachTransition onComplete={handleBreachComplete} />
        </Suspense>
      )}

      {/* 3D World */}
      {showScene && isBreached && (
        <Suspense fallback={
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: '#0B0E17', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#E8A87C', fontFamily: 'var(--font-mono)', fontSize: 12,
          }}>
            Initializing environment...
          </div>
        }>
          <Scene />
        </Suspense>
      )}

      {/* Diagnostic overlay */}
      <DiagnosticOverlay active={isDiagnostic && isBreached} />

      {/* HUD */}
      <div className={`hud-controls ${isBreached ? 'visible' : ''}`}>
        <div style={{ marginBottom: 6 }}>
          <span className="key">W</span>
          <span className="key">A</span>
          <span className="key">S</span>
          <span className="key">D</span>
          {' '}Move
        </div>
        <div style={{ marginBottom: 6 }}>
          <span className="key">SHIFT</span> Run
        </div>
        <div>
          <span className="key">TAB</span> Diagnostic
        </div>
      </div>
    </>
  );
}
