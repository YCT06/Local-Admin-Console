import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';
type Density = 'compact' | 'regular' | 'comfy';

interface UiState {
  theme: Theme;
  density: Density;
  setTheme: (theme: Theme) => void;
  setDensity: (density: Density) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      density: 'regular',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      setDensity: (density) => {
        document.body.setAttribute('data-density', density);
        set({ density });
      },
    }),
    { name: 'ui' },
  ),
);
