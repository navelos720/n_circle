# COMPATIBILITY.md — Supported After Effects Versions & OS Scope

## Status
The exact supported AE version range and OS scope must be finalized and recorded here before implementation locks its architecture. Do not assume every AE version or every OS behaves identically.

## OS Scope (Default Assumption — Confirm Before Building)
Treat this project as **Windows-only** by default (see `project_logs/REVIEW_QUEUE.md` OQ-12 — this is an assumption inherited from prior project context, not yet confirmed by the human project owner). If macOS support is later confirmed as required, this file, `RELEASE.md`'s installer scripts, and `FOLDER_STRUCTURE.md`'s runtime data paths must all be updated together.

## What Must Be Documented Per Supported AE Version
- Menu command availability (`MENU_ITEMS.md`).
- Effects availability (`EFFECTS.md`).
- `.aep` opening/import behavior (`AEP_FILES.md`, `AEP_INJECTION.md`).
- CEP panel API availability (`TOOLS.md`).
- Keyboard shortcut / Command ID differences (`SHORTCUTS.md`).
- Any UI integration quirks discovered during testing.

## Recording Format
When a feature behaves differently between two supported versions, add an entry here in the form:
```text
Feature: <name>
AE Version A: <behavior>
AE Version B: <behavior>
Resolution: <how the plugin handles the difference>
```
