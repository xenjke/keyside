import { useMemo } from 'react';
import { TOOLS } from './data/hotkeys';
import { useHotkeysState } from './hooks/useHotkeysState';
import { useTheme } from './hooks/useTheme';
import { buildToolView, budgetFor } from './lib/rank';
import { ToolTabs } from './components/ToolTabs';
import { ToolPanel } from './components/ToolPanel';
import { SettingsPanel } from './components/SettingsPanel';

export function App() {
  const { state, toggleTool, toggleFavGroup, toggleFavKey, setShowStars, setThemeMode, setPalette } =
    useHotkeysState();
  useTheme(state.themeMode, state.palette);

  const activeTools = useMemo(
    () => TOOLS.filter((t) => state.enabled.includes(t.id)),
    [state.enabled],
  );
  const n = activeTools.length;
  const limited = n >= 2;
  const budget = budgetFor(n);

  const views = useMemo(
    () => activeTools.map((t) => buildToolView(t, state.favGroups, state.favKeys, limited, budget)),
    [activeTools, state.favGroups, state.favKeys, limited, budget],
  );

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">Hotkeys</span>
        <div className="app-header__row">
          <ToolTabs tools={TOOLS} enabled={state.enabled} onToggle={toggleTool} />
          <SettingsPanel
            themeMode={state.themeMode}
            palette={state.palette}
            showStars={state.showStars}
            onThemeModeChange={setThemeMode}
            onPaletteChange={setPalette}
            onShowStarsChange={setShowStars}
          />
        </div>
      </header>

      <main className="app-main">
        {n === 0 ? (
          <div className="empty-state">
            <span className="empty-state__title">No tools enabled</span>
            <span className="empty-state__hint">
              Pick a tool above. One tool shows the full reference — two or more show ranked essentials.
            </span>
          </div>
        ) : (
          views.map((view) => (
            <ToolPanel
              key={view.tool.id}
              view={view}
              limited={limited}
              showStars={state.showStars}
              onFavGroup={toggleFavGroup}
              onFavKey={toggleFavKey}
            />
          ))
        )}
      </main>
    </div>
  );
}
