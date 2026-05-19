import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontScale = 'sm' | 'md' | 'lg';

interface A11yState {
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
}

interface A11yContextType extends A11yState {
  setFontScale: (s: FontScale) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
}

const A11yContext = createContext<A11yContextType | null>(null);

const STORAGE_KEY = 'masp-a11y';

// Maps the three font scales to the html font-size used as base unit.
// Tailwind's "rem" units cascade from here, so all UI text scales together.
const FONT_SIZE_BY_SCALE: Record<FontScale, string> = {
  sm: '14px',
  md: '16px',
  lg: '20px',
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<A11yState>(() => {
    if (typeof window === 'undefined') {
      return { fontScale: 'md', highContrast: false, reduceMotion: false };
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...{ fontScale: 'md', highContrast: false, reduceMotion: false }, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return {
      fontScale: 'md',
      highContrast: false,
      // Respeita prefers-reduced-motion do sistema operacional como default
      reduceMotion:
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });

  // Aplica as preferências no <html> via classes e variável de font-size.
  // Isso permite que CSS e Tailwind respondam globalmente.
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = FONT_SIZE_BY_SCALE[state.fontScale];
    root.classList.toggle('a11y-high-contrast', state.highContrast);
    root.classList.toggle('a11y-reduce-motion', state.reduceMotion);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  const value: A11yContextType = {
    ...state,
    setFontScale: (fontScale) => setState((s) => ({ ...s, fontScale })),
    toggleHighContrast: () => setState((s) => ({ ...s, highContrast: !s.highContrast })),
    toggleReduceMotion: () => setState((s) => ({ ...s, reduceMotion: !s.reduceMotion })),
  };

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used within AccessibilityProvider');
  return ctx;
}
