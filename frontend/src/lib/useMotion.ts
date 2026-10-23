import { useState, useEffect } from 'react';
import { useSettingsStore, MotionLevel } from '@/data/settingsStore';

export interface MotionConfig {
  level: MotionLevel;
  pieceMs: number;
  fadeMs: number;
  typeCps: number;
  systemPrefersReduced: boolean;
  isFull: boolean;
  isReduced: boolean;
  isOff: boolean;
}

export function useMotion(): MotionConfig {
  const motionSetting = useSettingsStore((s) => s.motionLevel) || 'full';
  const [systemPrefersReduced, setSystemPrefersReduced] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersReduced(e.matches);
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else if (mq.addListener) {
      // Legacy fallback
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  const level: MotionLevel = motionSetting;

  // Full-mode timings from design tokens / prompt spec
  // Reduced mode keeps coach text reveal (60 cps), crossfades (120-150ms), piece slide (80ms)
  let pieceMs = 200;
  let fadeMs = 200;
  let typeCps = 35;

  if (level === 'reduced') {
    pieceMs = 80;
    fadeMs = 120;
    typeCps = 60;
  } else if (level === 'off') {
    pieceMs = 0;
    fadeMs = 0;
    typeCps = 9999;
  }

  return {
    level,
    pieceMs,
    fadeMs,
    typeCps,
    systemPrefersReduced,
    isFull: level === 'full',
    isReduced: level === 'reduced',
    isOff: level === 'off',
  };
}
