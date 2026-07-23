import { useCallback, useEffect, useState } from 'react';
import type { PersistedState } from '../types';

const STORAGE_KEY = 'hotkeys-view_state_v1';

const DEFAULT_STATE: PersistedState = {
  enabled: ['nvim'],
  favGroups: {},
  favKeys: {},
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

  return { state, toggleTool, toggleFavGroup, toggleFavKey };
}
