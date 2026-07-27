import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function loadClean(page: Page, viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function enableAllTools(page: Page) {
  for (const name of ['Ghostty', 'Git', 'Herdr']) {
    await page.getByRole('button', { name: new RegExp(`^${name} \\d+$`) }).click();
  }
}

test('default reference loads without browser errors or overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await loadClean(page);
  await expect(page.getByRole('heading', { name: 'Neovim' })).toBeVisible();
  await expect(page.locator('.key-row')).toHaveCount(61);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('compact mode states its coverage and can expand one tool', async ({ page }) => {
  await loadClean(page);
  await enableAllTools(page);

  const neovim = page.locator('.tool-panel').filter({ has: page.getByRole('heading', { name: 'Neovim' }) });
  await expect(neovim.locator('.tool-panel__coverage')).toContainText('10 of 61');
  await expect(neovim.locator('.tool-panel__coverage')).toContainText('51 hidden from 8 sections');
  await neovim.getByRole('button', { name: 'Show all' }).click();
  await expect(neovim.locator('.key-row')).toHaveCount(61);
  await expect(neovim.locator('.tool-panel__coverage')).toContainText('61 of 61');
  await neovim.getByRole('button', { name: 'Show essentials' }).click();
  await expect(neovim.locator('.key-row')).toHaveCount(10);
});

for (const width of [320, 360, 390]) {
  test(`settings remain in bounds and actionable at ${width}px`, async ({ page }) => {
    await loadClean(page, { width, height: 844 });
    await enableAllTools(page);
    await page.getByRole('button', { name: 'Settings' }).click();

    const dialog = page.getByRole('dialog', { name: 'Settings' });
    const bounds = await dialog.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);

    for (const control of await dialog.locator('button:not(:disabled), input:not(:disabled)').all()) {
      await expect(control).toBeInViewport();
    }
    await dialog.getByRole('button', { name: 'Night' }).click();
    await dialog.getByRole('button', { name: 'Catppuccin' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'night');
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'catppuccin');
  });
}

test('settings manage focus, Escape, and persisted choices', async ({ page }) => {
  await loadClean(page);
  const trigger = page.getByRole('button', { name: 'Settings' });
  await trigger.click();
  await expect(page.getByRole('button', { name: 'Day' })).toBeFocused();
  await page.getByRole('button', { name: 'Night' }).click();
  await page.getByRole('button', { name: 'GitHub' }).click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'night');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'github');
});

test('star controls have touch-friendly boxes and change ranking', async ({ page }) => {
  await loadClean(page);
  await page.getByRole('button', { name: /^Ghostty \d+$/ }).click();
  const neovim = page.locator('.tool-panel').filter({ has: page.getByRole('heading', { name: 'Neovim' }) });
  const star = neovim.getByRole('button', { name: 'Star Center current line' });
  const bounds = await star.boundingBox();
  expect(bounds!.width).toBeGreaterThanOrEqual(36);
  expect(bounds!.height).toBeGreaterThanOrEqual(36);
  await star.click();
  await expect(neovim.locator('.key-group').first().locator('.key-row').first()).toContainText('Center current line');
});

test('three-tool desktop layout keeps every shortcut entry on one line', async ({ page }) => {
  await loadClean(page, { width: 1280, height: 900 });
  await page.getByRole('button', { name: /^Ghostty \d+$/ }).click();
  await page.getByRole('button', { name: /^Git \d+$/ }).click();
  const rowMeasurements = await page.locator('.key-row').evaluateAll((rows) => rows.map((row) => {
    const combo = row.querySelector('.key-row__combo')!.getBoundingClientRect();
    const description = row.querySelector('.key-row__desc')!.getBoundingClientRect();
    return {
      gridColumns: getComputedStyle(row).gridTemplateColumns,
      topDifference: Math.abs(combo.top - description.top),
    };
  }));
  expect(rowMeasurements.length).toBeGreaterThan(0);
  expect(rowMeasurements.every(({ gridColumns, topDifference }) => gridColumns.split(' ').length >= 2 && topDifference <= 12)).toBe(true);
});

test('shortcut descriptions share a column on mobile as well as desktop', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844, compact: false },
    { width: 390, height: 844, compact: true },
    { width: 1280, height: 900, compact: false },
  ]) {
    await loadClean(page, viewport);
    if (viewport.compact) {
      await page.getByRole('button', { name: /^Ghostty \d+$/ }).click();
      await page.getByRole('button', { name: /^Git \d+$/ }).click();
    }

    const groupMeasurements = await page.locator('.key-group').evaluateAll((groups) => groups.map((group) => {
      const rows = [...group.querySelectorAll('.key-row')];
      const measurements = rows.map((row) => {
        const combo = row.querySelector('.key-row__combo')!.getBoundingClientRect();
        const description = row.querySelector('.key-row__desc')!.getBoundingClientRect();
        return {
          gridColumns: getComputedStyle(row).gridTemplateColumns,
          descriptionLeft: description.left,
          topDifference: Math.abs(combo.top - description.top),
        };
      });
      return {
        measurements,
        descriptionStarts: measurements.map(({ descriptionLeft }) => descriptionLeft),
      };
    }));
    expect(groupMeasurements.length).toBeGreaterThan(0);
    for (const { measurements, descriptionStarts } of groupMeasurements) {
      expect(measurements.length).toBeGreaterThan(0);
      expect(measurements.every(({ gridColumns, topDifference }) => gridColumns.split(' ').length >= 2 && topDifference <= 12)).toBe(true);
      if (descriptionStarts.length > 1) {
        expect(Math.max(...descriptionStarts) - Math.min(...descriptionStarts)).toBeLessThanOrEqual(0.5);
      }
    }
  }
});

test('responsive layouts and maximum text scale keep content within the viewport', async ({ page }) => {
  for (const width of [320, 390, 768, 820, 1024]) {
    await loadClean(page, { width, height: 900 });
    if (width === 320) {
      await page.getByRole('button', { name: 'Settings' }).click();
      for (let step = 0; step < 10; step += 1) {
        await page.getByRole('button', { name: 'Increase size' }).click();
      }
      await page.keyboard.press('Escape');
      await expect(page.locator('.stepper__value')).toHaveCount(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const panelBounds = await page.locator('.tool-panel').evaluateAll((panels) =>
      panels.map((panel) => {
        const bounds = panel.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right };
      }),
    );
    for (const bounds of panelBounds) {
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(width);
    }
  }
});

test('default page and settings have no automatically detectable accessibility violations', async ({ page }) => {
  await loadClean(page);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Settings' }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
