/** One key combo, e.g. "⌘T" or a chorded sequence like ["⌃B", "c"]. */
export type KeyCombo = string | string[];

export interface HotkeyEntry {
  keys: KeyCombo;
  desc: string;
  /** Render the combo in a monospace font (for shell commands rather than key caps). */
  mono?: boolean;
}

export interface HotkeyGroup {
  name: string;
  keys: HotkeyEntry[];
}

export interface ToolDef {
  id: string;
  name: string;
  /** Short label under the tool name, e.g. "default keymap". */
  kicker: string;
  /** Which accent color this tool's key caps use. */
  accent: 'cyan' | 'magenta';
  groups: HotkeyGroup[];
}

/** 'system' follows the OS light/dark preference. */
export type ThemeMode = 'day' | 'night' | 'system';
export type Palette = 'default' | 'catppuccin' | 'github';

export interface PersistedState {
  enabled: string[];
  favGroups: Record<string, true>;
  favKeys: Record<string, true>;
  showStars: boolean;
  themeMode: ThemeMode;
  palette: Palette;
}
