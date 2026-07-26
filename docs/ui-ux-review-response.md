# UI/UX review implementation response

This records how the recommendations in `keyside-ui-ux-review.md` were handled.

## P0 — mobile settings bounds

Implemented. At phone widths the settings dialog is now a viewport-fixed, safe-area-aware bottom sheet with a bounded height and scrolling. Desktop keeps the anchored popover. Playwright checks the dialog and each control at 320, 360, and 390 px after all four tools are enabled.

## P1 — discoverable compact coverage

Implemented. Every panel in multi-tool mode reports `visible of total`, the hidden binding count, and the total section count. “Show all” expands an individual tool without changing the other panels; “Show essentials” restores its ranked compact view. The full one-tool reference remains unchanged.

A separate search/filter was not added: the recommended per-tool expansion path solves the hidden-content issue without introducing another interaction model. Search can remain a future enhancement if the dictionary becomes substantially larger.

## P1 — touch-sized star controls

Implemented. Star buttons use stable 36 px boxes and 44 px boxes on coarse-pointer devices, with inner glyphs, accessible pressed state/labels, hover feedback, and a shared visible focus ring. The browser suite checks target dimensions and verifies that starring changes ranking.

## P1 — automated UI safety net

Implemented with Playwright and axe-core. The production-preview suite covers:

- default load, row count, console/page errors, and horizontal bounds;
- tool toggling, compact counts, expansion, and collapse;
- settings bounds and actionability at 320/360/390 px;
- settings focus entry, Escape dismissal, focus return, theme/palette changes, and persistence;
- star target size and ranking;
- responsive horizontal bounds at 320/390/768/820/1024 px and maximum in-app text scale;
- dictionary validation and expected counts;
- automated accessibility scans of the reference and open settings dialog.

The GitHub Pages workflow installs Chromium and runs the suite after the production build, before deployment.

## P2 — settings semantics and focus

Implemented. Settings has `aria-modal`, trigger/dialog association, grouped toggle-button semantics (`role="group"` plus `aria-pressed`), initial focus, contained Tab navigation, Escape handling, focus restoration, semantic button types, and visible focus rings. Muted text and selected settings colors were also adjusted until the axe scan passed WCAG AA contrast checks.

## P2 — dense mobile scanning and line breaks

Addressed within the existing product model. The grid now permits tracks narrower than 320 px, avoiding horizontal clipping at a 320 px viewport. Responsive tests exercise 320 px at the product’s maximum 150% text/icon scale. Key caps intentionally remain internally unbroken because splitting a shortcut would make it ambiguous, matching the review’s caution. Per-tool “Show all” provides direct access to omitted content; a search UI was deferred as noted above.

The review suggested testing 200% text size, but the product’s explicit control range is 75–150%; 150% is therefore the applicable in-app boundary. Browser zoom remains supported by normal browser scaling and does not change the stored product preference.

## P2 — key data maintenance and provenance

Implemented. Each tool now displays a source/version/configuration caveat. A data test checks unique tool and generated group/key IDs, non-empty tool/group/key fields, non-empty combo parts, duplicate binding signatures, and intentionally reviewed expected counts for all four tools.

## Verification

At implementation time:

- `npm run lint` passed.
- `npm run build` passed.
- `npm test` passed all 10 tests in Chromium.

`npm audit` still reports two development-tool findings inherited through Vite 5 (one moderate and one high); npm only offers a semver-major Vite 8 upgrade. These findings concern development-server tooling, not the static production output, and that unrelated framework migration was left out of scope.
