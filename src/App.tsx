import { useMemo, useState, type CSSProperties } from 'react';
import { TOOLS } from './data/hotkeys';
import { useHotkeysState } from './hooks/useHotkeysState';
import { useTheme } from './hooks/useTheme';
import { buildToolView, budgetFor } from './lib/rank';
import { ToolTabs } from './components/ToolTabs';
import { ToolPanel } from './components/ToolPanel';
import { SettingsPanel } from './components/SettingsPanel';

// Set at build time — e.g. `VITE_IS_DEMO=true VITE_REPO_URL=... npm run build`
// — nothing about the deploy target is hardcoded or inferred here.
const IS_DEMO = import.meta.env.VITE_IS_DEMO === 'true';
const REPO_URL = import.meta.env.VITE_REPO_URL as string | undefined;

export function App() {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(() => new Set());
  const {
    state,
    toggleTool,
    toggleFavGroup,
    toggleFavKey,
    setShowStars,
    setThemeMode,
    setPalette,
    setTextScale,
  } = useHotkeysState();
  useTheme(state.themeMode, state.palette);

  const activeTools = useMemo(
    () => TOOLS.filter((t) => state.enabled.includes(t.id)),
    [state.enabled],
  );
  const n = activeTools.length;
  const limited = n >= 2;
  const budget = budgetFor(n);

  const views = useMemo(
    () => activeTools.map((t) => buildToolView(
      t,
      state.favGroups,
      state.favKeys,
      limited && !expandedTools.has(t.id),
      budget,
    )),
    [activeTools, state.favGroups, state.favKeys, limited, budget, expandedTools],
  );

  function toggleExpanded(toolId: string) {
    setExpandedTools((current) => {
      const next = new Set(current);
      if (next.has(toolId)) next.delete(toolId);
      else next.add(toolId);
      return next;
    });
  }

  return (
    <div className="app" style={{ '--user-scale': state.textScale } as CSSProperties}>
      {IS_DEMO && (
        <div className="demo-banner">
          Demo of {REPO_URL ? <a href={REPO_URL}>Keyside</a> : 'Keyside'} — this reflects one person's own
          setup, not a shared config. Fork it and run <code>npm install &amp;&amp; npm run dev</code> locally
          to make your own.
        </div>
      )}
      <header className="app-header">
        <h1 className="app-title">Keyside</h1>
        <div className="app-header__row">
          <ToolTabs tools={TOOLS} enabled={state.enabled} onToggle={toggleTool} />
          <SettingsPanel
            themeMode={state.themeMode}
            palette={state.palette}
            showStars={state.showStars}
            textScale={state.textScale}
            onThemeModeChange={setThemeMode}
            onPaletteChange={setPalette}
            onShowStarsChange={setShowStars}
            onTextScaleChange={setTextScale}
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
              expanded={expandedTools.has(view.tool.id)}
              showStars={state.showStars}
              onToggleExpanded={() => toggleExpanded(view.tool.id)}
              onFavGroup={toggleFavGroup}
              onFavKey={toggleFavKey}
            />
          ))
        )}
      </main>
    </div>
  );
}
