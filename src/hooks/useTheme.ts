import { useEffect, useState } from 'react';
import type { Palette, ThemeMode } from '../types';

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Resolves 'system' against the OS preference and stamps the result onto <html>. */
export function useTheme(mode: ThemeMode, palette: Palette) {
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolvedMode = mode === 'system' ? (systemDark ? 'night' : 'day') : mode;

  useEffect(() => {
    document.documentElement.dataset.mode = resolvedMode;
    document.documentElement.dataset.palette = palette;
  }, [resolvedMode, palette]);

  return resolvedMode;
}
