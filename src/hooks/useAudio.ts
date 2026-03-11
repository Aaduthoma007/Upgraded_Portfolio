'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getAudioEngine, AudioEngine } from '@/engine/AudioEngine';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

export function useAudio() {
  const engineRef = useRef<AudioEngine | null>(null);
  const { audioReady, setAudioReady } = usePortfolioStore();

  useEffect(() => {
    engineRef.current = getAudioEngine();
  }, []);

  const initAndPreload = useCallback(async () => {
    const engine = getAudioEngine();
    engineRef.current = engine;
    await engine.init();
    await engine.preload('/audio/boring-track.mp3', '/audio/mass-track.mp3');
    setAudioReady(true);
  }, [setAudioReady]);

  const playBoring = useCallback(() => {
    engineRef.current?.resume();
    engineRef.current?.playBoring();
  }, []);

  const triggerBreach = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    await engine.tapeStop();
    engine.playMass();
  }, []);

  const getFrequencyData = useCallback(() => {
    return engineRef.current?.getFrequencyData() ?? null;
  }, []);

  return { initAndPreload, playBoring, triggerBreach, getFrequencyData, audioReady };
}
