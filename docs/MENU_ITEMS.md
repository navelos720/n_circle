# MENU_ITEMS.md — After Effects Menu Bar Commands

## Purpose
Expose AE commands reachable through the top menu bar that may not have a convenient keyboard shortcut, so they can be assigned to wheel slots as `type: "menu_item"`.

## Conceptual Top-Level Structure
```text
File
Edit
Composition
Layer
Effect
Animation
View
Window
Help
```

## Implementation Rules
- Menu items frequently map to the same underlying Command IDs used in `SHORTCUTS.md` — check for overlap before creating a duplicate registry entry; reuse the existing `ae_command` entry where possible instead of adding a redundant `menu_item` entry for the same action.
- Every menu item added to the registry must be validated against the actual supported AE version range in `COMPATIBILITY.md` — do not assume a menu command exists in every version.
- Execution follows the same try/catch + toast-on-failure discipline as `SHORTCUTS.md`.
- Version differences (a command present in one AE version but not another) must be recorded in `COMPATIBILITY.md`.
