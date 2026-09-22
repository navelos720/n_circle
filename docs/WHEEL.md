# WHEEL.md — Radial Wheel Behavior Specification

## 1. Slot Count (Decided)
- Minimum: 7 inner slots (hard floor — never build a wheel layout below this).
- Standardized default: 8 inner slots, evenly dividing the circle into 45-degree wedges.
- Practical maximum above 8: undecided — see `project_logs/REVIEW_QUEUE.md` OQ-1. Do not hardcode a maximum without a decision record.

## 2. Slot Position Convention
`position` values run 0 through (slot-count - 1), starting at the top of the circle (12 o'clock) and proceeding clockwise. This matches the `position` field in `wheel_config.json` (`SCHEMA.md`).

```text
                         [ 0 ]

                 [ 7 ]         [ 1 ]


              [ 6 ]     *     [ 2 ]


                 [ 5 ]         [ 3 ]

                         [ 4 ]
```

## 3. Inner Ring
The inner ring is the default set of slots visible when the wheel opens. Each slot holds exactly one of: `ae_command`, `effect`, `menu_item`, `aep_file`, `aep_template`, or `folder`. Nothing appears on a slot unless the user (or the company default configuration) explicitly assigned it — never auto-populate slots.

## 4. Outer Ring (Submenus)
The outer ring only renders after a `folder`-type inner slot is engaged. It holds that folder's `children` array (see `SCHEMA.md`). It must not be visible at wheel root.

```text
ROOT WHEEL
    -> hover/select a folder-type slot
    -> after hoverTime > 150ms, outer ring fans out from that slot's direction
    -> user drags into an outer wedge without releasing the mouse
    -> release executes the child action
```

## 5. Parent Items (`type: "folder"`)
- Do nothing on release themselves; they exist only to expose the outer ring.
- Must be visually distinguished from direct-action items (see `UI_RULES.md` for the exact visual treatment) — e.g. a small chevron/arrow icon overlay. Keep this indicator subtle.

## 6. Center Area
Reserved exclusively for navigation, never a normal slot:
- At wheel root: `CLOSE`.
- Inside a submenu: `BACK`.
- The center hub also displays: the currently hovered slot's icon/name, and a brief success (green flash/checkmark) or error (red flash) indicator after execution — exact colors in `UI_RULES.md`.

## 7. Interaction Model (Default — Implement, Then Validate With a Real Prototype Before Treating As Final)

### Summon
- Configurable global hotkey (e.g. `Alt+Space`), and/or right-click-and-hold with a configurable delay (default 200ms). Both should be toggleable in `SETTINGS.md`.
- The default trigger must not collide with common built-in AE shortcuts.

### Gesture ("drag without releasing")
1. `MOUSE_DOWN` (or hotkey press): spawn the wheel centered on the cursor position.
2. `MOUSE_MOVE`: compute the active wedge via `Math.atan2(dy, dx)` relative to wheel center; visually highlight that wedge.
3. If the active wedge's `type` is `"folder"` and hover time exceeds 150ms, render the outer ring, fanned out from that wedge's angular direction.
4. User continues dragging (without releasing the mouse button) into a wedge of the outer ring.
5. `MOUSE_UP`: execute the currently highlighted slot's action per the Execution Matrix below (inner or outer ring, whichever is active); destroy the overlay immediately after.
6. Also implement a plain click-based fallback: click to open, click a wedge to select/enter, click again to confirm/execute. This should be selectable in `SETTINGS.md` as an alternative interaction mode.

## 8. Execution Matrix

| slot.type | Behavior |
|---|---|
| `ae_command` | `try { app.executeCommand(slot.commandId); } catch (e) { showToast("Action failed"); }` |
| `effect` | If a layer is selected: `selectedLayer.Effects.addProperty(slot.effectName)`. Else: `showToast("Select a layer to use this action.")` |
| `menu_item` | Route through the mapped AE command per `MENU_ITEMS.md`; same try/catch discipline as `ae_command`. |
| `aep_file` | Open the referenced `.aep` as a project — see `AEP_FILES.md`. |
| `aep_template` | Trigger the AEP Injection workflow — see `AEP_INJECTION.md`. Only implement if this feature is in scope (check `project_logs/DECISIONS.md` for OQ-11's resolution). |
| `folder` | No action on release. Exists only to expose the outer ring (see section 4/5 above). |

## 9. Slot Distribution & Nesting Rules
- The wheel must auto-distribute slots evenly regardless of count (7, 8, 9, 10+ slots all distribute evenly) — never require the user to manually set angles.
- Outer-ring slot count follows the same even-distribution rule; target roughly 7-12 per ring pending usability testing (OQ-2).
- Keep nesting shallow by design: `Root -> Category -> Action`, or for AEP organization, `Root -> AEP Files -> Category -> AEP`. The engine may technically support deeper nesting, but do not surface UI encouraging deeper paths without an explicit decision.
