import type { ToolView } from '../lib/rank';
import { KeyCombo } from './KeyCombo';

interface Props {
  view: ToolView;
  limited: boolean;
  showStars: boolean;
  onFavGroup: (gid: string) => void;
  onFavKey: (kid: string) => void;
}

export function ToolPanel({ view, limited, showStars, onFavGroup, onFavKey }: Props) {
  const { tool, groups } = view;

  return (
    <section className="tool-panel">
      <div className={`tool-panel__head tool-panel__head--${tool.accent}`}>
        <span className="tool-panel__mark" />
        <h2>{tool.name}</h2>
        <span className="tool-panel__kicker">{tool.kicker}</span>
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
                  onClick={() => onFavGroup(g.id)}
                >
                  {g.fav ? '★' : '☆'}
                </button>
              )}
            </div>

            {g.keys.map((k) => (
              <div className="key-row" key={k.id}>
                <span className="key-row__combo">
                  {limited && showStars && (
                    <button className="star-btn star-btn--sm" title="Star to rank higher" onClick={() => onFavKey(k.id)}>
                      {k.fav ? '★' : '☆'}
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
