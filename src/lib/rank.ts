import type { HotkeyEntry, ToolDef } from '../types';

export interface RankedKey extends HotkeyEntry {
  id: string;
  fav: boolean;
}

export interface RankedGroup {
  id: string;
  name: string;
  fav: boolean;
  keys: RankedKey[];
}

export interface ToolView {
  tool: ToolDef;
  groups: RankedGroup[];
}

/** How many keys to show per tool once two or more tools are on screen at once. */
export function budgetFor(activeCount: number): number {
  if (activeCount <= 1) return Infinity;
  if (activeCount === 2) return 18;
  if (activeCount === 3) return 13;
  return 10;
}

/**
 * Ranks a tool's groups/keys (favorites first, then original order), and —
 * when `limited` — trims to `budget` keys total, favorites surviving first.
 */
export function buildToolView(
  tool: ToolDef,
  favGroups: Record<string, true>,
  favKeys: Record<string, true>,
  limited: boolean,
  budget: number,
): ToolView {
  let groups: RankedGroup[] = tool.groups.map((g, gi) => {
    const gid = `${tool.id}|${gi}`;
    const keys: RankedKey[] = g.keys.map((k, ki) => {
      const kid = `${tool.id}|${gi}|${ki}`;
      return { ...k, id: kid, fav: !!favKeys[kid] };
    });
    keys.sort((a, b) => Number(b.fav) - Number(a.fav));
    return { id: gid, name: g.name, fav: !!favGroups[gid], keys };
  });

  groups.sort((a, b) => Number(b.fav) - Number(a.fav));

  if (limited) {
    let left = budget;
    const out: RankedGroup[] = [];
    for (const g of groups) {
      if (left <= 0) break;
      const take = g.keys.slice(0, Math.min(g.keys.length, left));
      if (take.length) {
        out.push({ ...g, keys: take });
        left -= take.length;
      }
    }
    groups = out;
  }

  return { tool, groups };
}
