import { useCallback, useEffect, useState } from 'react';
import type { Palette, PersistedState, ThemeMode } from '../types';

// Also hard-coded in index.html's pre-paint theme script — keep the two in sync.
export const STORAGE_KEY = 'hotkeys-view_state_v1';

const DEFAULT_STATE: PersistedState = {
  enabled: ['nvim'],
  favGroups: {},
  favKeys: {},
  showStars: true,
  themeMode: 'system',
  palette: 'default',
};

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      enabled: Array.isArray(parsed.enabled) ? parsed.enabled : DEFAULT_STATE.enabled,
      favGroups: parsed.favGroups ?? {},
      favKeys: parsed.favKeys ?? {},
      showStars: typeof parsed.showStars === 'boolean' ? parsed.showStars : DEFAULT_STATE.showStars,
      themeMode: parsed.themeMode ?? DEFAULT_STATE.themeMode,
      palette: parsed.palette ?? DEFAULT_STATE.palette,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useHotkeysState() {
  const [state, setState] = useState<PersistedState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable (private browsing, etc.) — state just won't persist.
    }
  }, [state]);

  const toggleTool = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      enabled: s.enabled.includes(id) ? s.enabled.filter((x) => x !== id) : [...s.enabled, id],
    }));
  }, []);

  const toggleFavGroup = useCallback((gid: string) => {
    setState((s) => {
      const favGroups = { ...s.favGroups };
      if (favGroups[gid]) delete favGroups[gid];
      else favGroups[gid] = true;
      return { ...s, favGroups };
    });
  }, []);

  const toggleFavKey = useCallback((kid: string) => {
    setState((s) => {
      const favKeys = { ...s.favKeys };
      if (favKeys[kid]) delete favKeys[kid];
      else favKeys[kid] = true;
      return { ...s, favKeys };
    });
  }, []);

  const setShowStars = useCallback((showStars: boolean) => {
    setState((s) => ({ ...s, showStars }));
  }, []);

  const setThemeMode = useCallback((themeMode: ThemeMode) => {
    setState((s) => ({ ...s, themeMode }));
  }, []);

  const setPalette = useCallback((palette: Palette) => {
    setState((s) => ({ ...s, palette }));
  }, []);

  return { state, toggleTool, toggleFavGroup, toggleFavKey, setShowStars, setThemeMode, setPalette };
}
