# UI_LAYOUT.md — Exact Interface Structure

## 1. Dockable Suite Panel
- **Header**: debounced search bar, category dropdown, view toggle (Grid/List), settings gear icon.
- **Main Content**: responsive grid of preset/command cards.
  - Card anatomy: thumbnail (16:9 where applicable), bold title, tag pills, a primary action button ("Inject" for `aep_template` items, "Open" for `aep_file` items, "Add to Wheel" for other item types), a favorite-toggle star.
  - Hover state: slight scale-up; play a short preview video if available, or show a tooltip.
- **Footer**: status bar (e.g. "Library Loaded: 142 Templates"), "Rebuild Library Index" button.

## 2. Radial Overlay Menu
- **Canvas**: transparent, circular DOM/Canvas element rendered over the active AE composition window, always-on-top while active.
- **Center Hub**: shows the currently hovered item's icon/label, or a "release to execute" cue; flashes success/error feedback per `UI_RULES.md`.
- **Inner Ring**: minimum 7, default 8 equal wedges (45 degrees each at the 8-slot default).
- **Outer Ring**: appears only when hovering a `folder`-type wedge for more than 150ms; fans out radially from that wedge's direction.
- **Visual Feedback**: smooth CSS transitions only (`transform: scale`, `opacity`) — no abrupt pop-in/pop-out.

## 3. Settings Modal
- **Tab 1 — Library**: current root path (editable), "Rebuild Library Index" button.
- **Tab 2 — Wheel Layout**: two-panel layout. Left: live visual wheel preview (reflects current slot count). Right: available-item library, tabbed by Shortcuts / Menu Items / Effects / AEP Files, with drag-and-drop or click-to-assign onto the preview.
- **Tab 3 — Appearance**: theme toggle, UI scale (100% / 125% / 150%), radial activation hold-delay slider (50ms to 500ms).

## 4. Layout-Level Rules
- Every screen listed above must degrade gracefully to an explicit empty state (e.g. "No templates found — click Rebuild Library Index" rather than a blank grid) and an explicit error state (per `ERROR_HANDLING.md`) — do not leave any screen without both states designed and implemented.
- Dialogs (confirmation on slot replace, file picker for AEP add, etc.) follow the same dark, restrained visual language as the rest of the panel — see `UI_RULES.md`.
