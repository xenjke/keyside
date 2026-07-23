import type { KeyCombo as KeyComboValue } from '../types';

interface Props {
  value: KeyComboValue;
  mono?: boolean;
}

export function KeyCombo({ value, mono }: Props) {
  const caps = Array.isArray(value) ? value : [value];
  return (
    <span className="key-combo">
      {caps.map((cap, i) => (
        <span key={i}>
          {i > 0 && <span className="key-combo__sep">›</span>}
          <span className={mono ? 'key-cap key-cap--mono' : 'key-cap'}>{cap}</span>
        </span>
      ))}
    </span>
  );
}
