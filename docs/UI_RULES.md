# UI_RULES.md — Visual & Interaction Design Principles

## Overall
Modern, professional, clean, fast, dark-interface-friendly (matches After Effects' own dark UI), visually restrained, easy to scan, designed for long production sessions — not a flashy consumer app.

## Radial Wheel
- Keep labels short; use clear icons where they add value over text.
- Clearly distinguish parent (`folder`) slots from direct-action slots using a subtle, consistent visual cue (small chevron/arrow overlay is the recommended default — keep it unobtrusive).
- Highlight the current hover/selection state clearly and immediately (no perceptible lag).
- Use smooth CSS transitions (`transform: scale`, `opacity`) for ring expansion — avoid jarring pops or abrupt appearance/disappearance.
- The wheel renders as a transparent overlay over the AE composition window — ensure sufficient contrast against arbitrary underlying footage.
- **Fitts's Law**: wedges must be large; a click/release anywhere within the wedge's angular range must register, never requiring precise aim at a small icon.

## Color Conventions (Starting Point — Refine During Visual Design, Keep Consistent Once Set)
- Highlighted/active wedge: a subtle brand accent color at roughly 30% opacity (e.g. `#3B82F6`).
- Success feedback: a brief green flash or checkmark in the center hub on successful execution.
- Error feedback: a brief red flash in the center hub on failure (e.g. no layer selected for an effect).
- Never rely on color alone to convey state — pair every color cue with an icon, label, or shape change for accessibility.

## Suite Panel
- Header: debounced search input, category dropdown, grid/list view toggle, settings gear icon.
- Content: responsive grid of item/template cards. Card anatomy: thumbnail (16:9 where applicable), bold title, tag pills (e.g. "2.5s", "4K"), a primary action button ("Inject" or "Open," per the item's type), a favorite toggle.
- Hover state: slight scale-up; show a short preview or tooltip.
- Footer: status bar (e.g. "Library Loaded: 142 Templates"), "Rebuild Library Index" button (`LIBRARY_INDEXING.md`).

## Settings Boundary (Enforce This Distinction in the UI, Not Just in Docs)
- **Wheel Settings/Editor** (`WHEEL_SETTINGS.md`): controls WHAT appears on the wheel.
- **Settings** (`SETTINGS.md`): controls HOW the wheel behaves (activation trigger, hold delay, appearance, theme). Never let a "Settings" screen also expose raw wheel-item assignment — route that to the Wheel Editor instead.

## Accessibility
Readable labels, sufficient text/background contrast, large radial targets (see Fitts's Law note above), a clearly distinct hover state and a clearly distinct selected state, keyboard accessibility throughout the Settings UI, and never rely on color alone to convey state (repeated here deliberately — this is a hard requirement, not a suggestion).
