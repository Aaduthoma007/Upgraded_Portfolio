'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { useAudio } from '@/hooks/useAudio';

declare const gsap: {
  timeline: (opts?: Record<string, unknown>) => GSAPTimeline;
  to: (target: unknown, vars: Record<string, unknown>) => void;
  set: (target: unknown, vars: Record<string, unknown>) => void;
};

interface GSAPTimeline {
  to: (target: unknown, vars: Record<string, unknown>, position?: string | number) => GSAPTimeline;
  set: (target: unknown, vars: Record<string, unknown>, position?: string | number) => GSAPTimeline;
  call: (fn: () => void, args?: unknown[], position?: string | number) => GSAPTimeline;
  add: (fn: () => void, position?: string | number) => GSAPTimeline;
}

interface BreachTransitionProps {
  onComplete: () => void;
}

export default function BreachTransition({ onComplete }: BreachTransitionProps) {
  const flashRef = useRef<HTMLDivElement>(null);
  const { triggerBreach } = useAudio();
  const { setTransitioning, breach } = usePortfolioStore();
  const hasRun = useRef(false);

  const runTimeline = useCallback(async () => {
    if (hasRun.current) return;
    hasRun.current = true;
    setTransitioning(true);

    const boringWrapper = document.getElementById('boring-wrapper');
    const flash = flashRef.current;
    if (!boringWrapper || !flash) return;

    // Dynamic import GSAP
    const gsapModule = await import('gsap');
    const gsapLib = gsapModule.gsap || gsapModule.default;

    const tl = gsapLib.timeline({ onComplete: () => {
      setTransitioning(false);
      breach();
      document.body.classList.add('breached');
      onComplete();
    }});

    // t=0: Start tape stop + crack the resume
    tl.call(() => { triggerBreach(); }, [], 0);

    tl.to(boringWrapper, {
      duration: 0.6,
      scale: 0.98,
      filter: 'brightness(1.3) saturate(0)',
      ease: 'power2.in',
    }, 0);

    // t=0.6: Flash + hue rotate
    tl.to(flash, {
      duration: 0.15,
      opacity: 1,
      ease: 'power4.in',
    }, 0.6);

    tl.to(flash, {
      duration: 0.3,
      opacity: 0,
      ease: 'power2.out',
    }, 0.75);

    // t=0.8: Resume fragments fly apart
    tl.to(boringWrapper, {
      duration: 0.8,
      scale: 1.15,
      opacity: 0,
      filter: 'brightness(3) blur(8px) hue-rotate(180deg)',
      rotateX: -5,
      y: -60,
      ease: 'power3.in',
    }, 0.8);

    // t=1.6: Fully gone -> show world
    tl.set(boringWrapper, { display: 'none' }, 1.8);

  }, [triggerBreach, setTransitioning, breach, onComplete]);

  useEffect(() => {
    runTimeline();
  }, [runTimeline]);

  return (
    <div className="breach-overlay">
      <div ref={flashRef} className="breach-flash" />
    </div>
  );
}
