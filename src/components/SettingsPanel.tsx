import { useEffect, useRef, useState } from 'react';
import { TEXT_SCALE_MAX, TEXT_SCALE_MIN, TEXT_SCALE_STEP } from '../hooks/useHotkeysState';
import type { Palette, ThemeMode } from '../types';

interface Props {
  themeMode: ThemeMode;
  palette: Palette;
  showStars: boolean;
  textScale: number;
  onThemeModeChange: (mode: ThemeMode) => void;
  onPaletteChange: (palette: Palette) => void;
  onShowStarsChange: (show: boolean) => void;
  onTextScaleChange: (scale: number) => void;
}

const MODES: { value: ThemeMode; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'night', label: 'Night' },
  { value: 'system', label: 'System' },
];

const PALETTES: { value: Palette; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'catppuccin', label: 'Catppuccin' },
  { value: 'github', label: 'GitHub' },
];

export function SettingsPanel({
  themeMode,
  palette,
  showStars,
  textScale,
  onThemeModeChange,
  onPaletteChange,
  onShowStarsChange,
  onTextScaleChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="settings" ref={rootRef}>
      <button
        className="settings__trigger"
        aria-label="Settings"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ⚙
      </button>

      {open && (
        <div className="settings__panel" role="dialog" aria-label="Settings">
          <div className="settings__section">
            <span className="settings__label">Appearance</span>
            <div className="seg-group" role="radiogroup" aria-label="Day or night">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  className={themeMode === m.value ? 'is-active' : ''}
                  aria-pressed={themeMode === m.value}
                  onClick={() => onThemeModeChange(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings__section">
            <span className="settings__label">Palette</span>
            <div className="seg-group" role="radiogroup" aria-label="Color palette">
              {PALETTES.map((p) => (
                <button
                  key={p.value}
                  className={palette === p.value ? 'is-active' : ''}
                  aria-pressed={palette === p.value}
                  onClick={() => onPaletteChange(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings__section">
            <span className="settings__label">Text &amp; icon size</span>
            <div className="stepper">
              <button
                aria-label="Decrease size"
                disabled={textScale <= TEXT_SCALE_MIN}
                onClick={() => onTextScaleChange(Math.round((textScale - TEXT_SCALE_STEP) * 100) / 100)}
              >
                –
              </button>
              <span className="stepper__value">{Math.round(textScale * 100)}%</span>
              <button
                aria-label="Increase size"
                disabled={textScale >= TEXT_SCALE_MAX}
                onClick={() => onTextScaleChange(Math.round((textScale + TEXT_SCALE_STEP) * 100) / 100)}
              >
                +
              </button>
            </div>
          </div>

          <label className="settings__toggle">
            <input
              type="checkbox"
              checked={showStars}
              onChange={(e) => onShowStarsChange(e.target.checked)}
            />
            Show star ratings
          </label>
        </div>
      )}
    </div>
  );
}
