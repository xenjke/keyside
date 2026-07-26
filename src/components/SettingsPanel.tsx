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
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstControlRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeAndRestoreFocus() {
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    }

    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAndRestoreFocus();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeAndRestoreFocus();
        return;
      }

      if (e.key === 'Tab' && panelRef.current) {
        const controls = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)'),
        );
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => firstControlRef.current?.focus());
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="settings" ref={rootRef}>
      <button
        className="settings__trigger"
        ref={triggerRef}
        type="button"
        aria-label="Settings"
        aria-expanded={open}
        aria-controls="settings-dialog"
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">⚙</span>
      </button>

      {open && (
        <div
          className="settings__panel"
          id="settings-dialog"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
        >
          <div className="settings__section">
            <span className="settings__label">Appearance</span>
            <div className="seg-group" role="group" aria-label="Day or night">
              {MODES.map((mode, index) => (
                <button
                  key={mode.value}
                  ref={index === 0 ? firstControlRef : undefined}
                  type="button"
                  className={themeMode === mode.value ? 'is-active' : ''}
                  aria-pressed={themeMode === mode.value}
                  onClick={() => onThemeModeChange(mode.value)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings__section">
            <span className="settings__label">Palette</span>
            <div className="seg-group" role="group" aria-label="Color palette">
              {PALETTES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={palette === item.value ? 'is-active' : ''}
                  aria-pressed={palette === item.value}
                  onClick={() => onPaletteChange(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings__section">
            <span className="settings__label">Text &amp; icon size</span>
            <div className="stepper">
              <button
                type="button"
                aria-label="Decrease size"
                disabled={textScale <= TEXT_SCALE_MIN}
                onClick={() => onTextScaleChange(Math.round((textScale - TEXT_SCALE_STEP) * 100) / 100)}
              >
                –
              </button>
              <span className="stepper__value">{Math.round(textScale * 100)}%</span>
              <button
                type="button"
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
              onChange={(event) => onShowStarsChange(event.target.checked)}
            />
            Show star ratings
          </label>
        </div>
      )}
    </div>
  );
}
