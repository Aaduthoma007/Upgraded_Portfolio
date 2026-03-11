import { create } from 'zustand';

interface PortfolioState {
  isBreached: boolean;
  isDiagnostic: boolean;
  audioReady: boolean;
  isTransitioning: boolean;

  breach: () => void;
  toggleDiagnostic: () => void;
  setAudioReady: (ready: boolean) => void;
  setTransitioning: (transitioning: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  isBreached: false,
  isDiagnostic: false,
  audioReady: false,
  isTransitioning: false,

  breach: () => set({ isBreached: true }),
  toggleDiagnostic: () => set((state) => ({ isDiagnostic: !state.isDiagnostic })),
  setAudioReady: (ready: boolean) => set({ audioReady: ready }),
  setTransitioning: (transitioning: boolean) => set({ isTransitioning: transitioning }),
}));
