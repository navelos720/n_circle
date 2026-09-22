# COMMAND_REGISTRY.md — Action Registry

## Purpose
Maintains the canonical list of everything that can be assigned to a wheel slot, and feeds the "available items" browser in `WHEEL_SETTINGS.md`.

## Categories
```text
SHORTCUT   (type: "ae_command")
MENU_ITEM  (type: "menu_item")
EFFECT     (type: "effect")
AEP        (type: "aep_file" or "aep_template")
SUBMENU    (type: "folder")
```
These `type` strings are the exact values used in `wheel_config.json` — see `SCHEMA.md`.

## Requirements
- The registry must prevent duplicate or invalid item definitions from being assignable (e.g. two different commands sharing one `id`).
- The registry is read by `WHEEL_SETTINGS.md`'s available-item browser and by the Action Executor (`ARCHITECTURE.md`) to resolve a slot's `type` + reference into an executable action.
- New item types (beyond the 5 categories above) must be added here first, with a corresponding entry in `DECISIONS.md`, before being used anywhere else in the codebase.

## Effect Registry Notes
Effects must be represented as selectable commands, accounting for:
- Effects available in the currently detected AE version.
- Effects only available under certain conditions (e.g. adjustment-layer-only effects).
- Third-party-plugin-provided effects — out of scope for V1; do not build support for this unless a decision record explicitly adds it.
V1 scope is native AE effects only, validated against the supported version range in `COMPATIBILITY.md`.
