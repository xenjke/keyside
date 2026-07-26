import { expect, test } from '@playwright/test';
import { TOOLS } from '../src/data/hotkeys';

const EXPECTED_COUNTS: Record<string, number> = {
  nvim: 61,
  ghostty: 20,
  git: 27,
  herdr: 28,
};

test('hotkey dictionary has valid, unique identifiers and complete entries', () => {
  const toolIds = new Set<string>();
  const generatedGroupIds = new Set<string>();
  const generatedKeyIds = new Set<string>();

  for (const tool of TOOLS) {
    expect(tool.id.trim()).not.toBe('');
    expect(tool.name.trim()).not.toBe('');
    expect(tool.kicker.trim()).not.toBe('');
    expect(tool.sourceNote.trim()).not.toBe('');
    expect(toolIds.has(tool.id), `duplicate tool id: ${tool.id}`).toBe(false);
    toolIds.add(tool.id);

    const entrySignatures = new Set<string>();
    let keyCount = 0;
    tool.groups.forEach((group, groupIndex) => {
      const groupId = `${tool.id}|${groupIndex}`;
      expect(generatedGroupIds.has(groupId), `duplicate generated group id: ${groupId}`).toBe(false);
      generatedGroupIds.add(groupId);
      expect(group.name.trim()).not.toBe('');
      expect(group.keys.length).toBeGreaterThan(0);

      group.keys.forEach((entry, keyIndex) => {
        const keyId = `${groupId}|${keyIndex}`;
        expect(generatedKeyIds.has(keyId), `duplicate generated key id: ${keyId}`).toBe(false);
        generatedKeyIds.add(keyId);

        const parts = Array.isArray(entry.keys) ? entry.keys : [entry.keys];
        expect(parts.length).toBeGreaterThan(0);
        for (const part of parts) expect(part.trim()).not.toBe('');
        expect(entry.desc.trim()).not.toBe('');

        const signature = `${parts.join(' -> ')}|${entry.desc}`;
        expect(entrySignatures.has(signature), `duplicate binding in ${tool.name}: ${signature}`).toBe(false);
        entrySignatures.add(signature);
        keyCount += 1;
      });
    });

    expect(keyCount, `${tool.name} binding count changed; review the expected count intentionally`).toBe(
      EXPECTED_COUNTS[tool.id],
    );
  }

  expect(Array.from(toolIds).sort()).toEqual(Object.keys(EXPECTED_COUNTS).sort());
});
