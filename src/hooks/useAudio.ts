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
    try {
      const engine = getAudioEngine();
      engineRef.current = engine;
      await engine.init();
      // Await only the small track so the UI unlocks instantly
      await engine.preloadBoring('/audio/boring-track.mp3');
      setAudioReady(true);

      // Fire and forget the heavy mass track
      engine.preloadMass('/audio/mass-track.mp3');
    } catch (err) {
      console.warn('Audio system failed to initialize:', err);
      // Let the UI fall back gracefully by pretending audio is "ready" but silent
      setAudioReady(true); 
    }
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
