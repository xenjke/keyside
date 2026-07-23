import type { ToolDef } from '../types';

interface Props {
  tools: ToolDef[];
  enabled: string[];
  onToggle: (id: string) => void;
}

export function ToolTabs({ tools, enabled, onToggle }: Props) {
  return (
    <nav className="tool-tabs">
      {tools.map((t) => {
        const on = enabled.includes(t.id);
        const count = t.groups.reduce((a, g) => a + g.keys.length, 0);
        return (
          <button
            key={t.id}
            className={`tool-tab tool-tab--${t.accent} ${on ? 'is-on' : ''}`}
            onClick={() => onToggle(t.id)}
            aria-pressed={on}
          >
            <span className="tool-tab__dot" />
            <span>{t.name}</span>
            <span className="tool-tab__count">{count}</span>
          </button>
        );
      })}
    </nav>
  );
}
