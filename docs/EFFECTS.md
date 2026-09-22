# EFFECTS.md — Effects Library Integration

## Category Grouping (Starting Point — Validate Against Actual Installed Effects)
```text
Blur & Sharpen
Color Correction
Distort
Generate
Keying
Matte
Noise & Grain
Perspective
Stylize
Time
Transition
Utility
```
The final category list must reflect effects actually available in the supported AE versions (`COMPATIBILITY.md`) — do not hardcode a category list that includes effects the target AE install doesn't have.

## Applying an Effect
- Apply to the currently selected layer(s): `selectedLayer.Effects.addProperty(slot.effectName)`.
- If no layer is selected, show the "select a layer" error state (`ERROR_HANDLING.md`) instead of attempting to apply.
- Document any effect with special application conditions (e.g. adjustment-layer-only, track-matte-dependent) directly in this file as they are discovered during implementation.

## Scope
V1 covers native AE effects only. Third-party-plugin-provided effects are out of scope unless a decision record in `project_logs/DECISIONS.md` explicitly adds support later.

## Search
Effects must be searchable by name and category from the Wheel Settings item browser (`WHEEL_SETTINGS.md`) and the Suite Panel (`UI_LAYOUT.md`).
