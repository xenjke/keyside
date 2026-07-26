import type { ToolView } from '../lib/rank';
import { KeyCombo } from './KeyCombo';

interface Props {
  view: ToolView;
  limited: boolean;
  expanded: boolean;
  showStars: boolean;
  onToggleExpanded: () => void;
  onFavGroup: (gid: string) => void;
  onFavKey: (kid: string) => void;
}

export function ToolPanel({
  view,
  limited,
  expanded,
  showStars,
  onToggleExpanded,
  onFavGroup,
  onFavKey,
}: Props) {
  const { tool, groups } = view;
  const visibleKeys = groups.reduce((sum, group) => sum + group.keys.length, 0);
  const omittedKeys = view.totalKeys - visibleKeys;

  return (
    <section className="tool-panel">
      <div className={`tool-panel__head tool-panel__head--${tool.accent}`}>
        <span className="tool-panel__mark" />
        <h2>{tool.name}</h2>
        <span className="tool-panel__kicker">{tool.kicker}</span>
      </div>

      <div className="tool-panel__meta">
        <span className="tool-panel__source">{tool.sourceNote}</span>
        {limited && (
          <span className="tool-panel__coverage" aria-live="polite">
            <strong>{visibleKeys} of {view.totalKeys}</strong> bindings
            {omittedKeys > 0 && ` · ${omittedKeys} hidden from ${view.totalGroups} sections`}
            <button type="button" className="text-action" onClick={onToggleExpanded} aria-expanded={expanded}>
              {expanded ? 'Show essentials' : 'Show all'}
            </button>
          </span>
        )}
      </div>

      <div className={limited ? 'tool-panel__body tool-panel__body--stacked' : 'tool-panel__body tool-panel__body--columns'}>
        {groups.map((g) => (
          <div className="key-group" key={g.id}>
            <div className="key-group__head">
              <span className="key-group__name">{g.name}</span>
              <span className="key-group__rule" />
              {showStars && (
                <button
                  className="star-btn"
                  title="Star this section to rank it higher"
                  aria-label={`${g.fav ? 'Unstar' : 'Star'} ${g.name} section`}
                  aria-pressed={g.fav}
                  type="button"
                  onClick={() => onFavGroup(g.id)}
                >
                  <span aria-hidden="true">{g.fav ? '★' : '☆'}</span>
                </button>
              )}
            </div>

            {g.keys.map((k) => (
              <div className="key-row" key={k.id}>
                <span className="key-row__combo">
                  {limited && showStars && (
                    <button
                      className="star-btn star-btn--sm"
                      title="Star to rank higher"
                      aria-label={`${k.fav ? 'Unstar' : 'Star'} ${k.desc}`}
                      aria-pressed={k.fav}
                      type="button"
                      onClick={() => onFavKey(k.id)}
                    >
                      <span aria-hidden="true">{k.fav ? '★' : '☆'}</span>
                    </button>
                  )}
                  <KeyCombo value={k.keys} mono={k.mono} />
                </span>
                <span className="key-row__desc">{k.desc}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
