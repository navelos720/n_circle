# TODO.md — Prioritized Work Queue

Log versioning rule: freeze and roll to `TODO_2.md` past 900 lines.

## COMPLETED (Milestone 1)
- [x] Generate the CEP extension folder structure and `CSXS/manifest.xml` with correct permissions (`../FOLDER_STRUCTURE.md`).
- [x] Create TypeScript interfaces for `library.json` and `wheel_config.json` (`../docs/SCHEMA.md`).
- [x] Build the Radial Overlay engine and wedge-angle calculations (`../docs/WHEEL.md`).
- [x] Build the Suite Panel UI (search, category tabs, settings modal) (`../docs/UI_LAYOUT.md`).
- [x] Implement the `app.executeCommand` wrapper with try/catch and selection-context checks (`../docs/SHORTCUTS.md`).
- [x] Build the dev-time library-indexing script (`../docs/LIBRARY_INDEXING.md`).
- [x] Create Windows automated install/uninstall scripts.

## COMPLETED (Milestone 2)
- [x] Implement full radial interaction state machine (`MOUSE_DOWN` -> `MOUSE_MOVE` -> `MOUSE_UP` and click fallback).
- [x] Implement Execution Matrix for `ae_command`, `effect`, `menu_item`, `aep_file`, and `folder` with try/catch error handling.
- [x] Wire "no layer selected" context verification and error toast for effect execution.
- [x] Implement Center Hub state transitions (`CLOSE` at root, `BACK` in submenu) and BACK navigation.
- [x] Implement outer ring submenu fan-out on hovering/selecting `folder`-type slots.
- [x] Align DOM element IDs and resolve bootstrap script loading quirks across CEP and browser preview.
- [x] Run comprehensive automated verification in browser test harness and log results in `TEST_NOTES.md`.

## HIGH (Milestone 3 — Wheel Editor & Profile Management)
- [ ] Implement drag-and-drop / interactive slot assignment in the Wheel Settings Editor (`../docs/WHEEL_SETTINGS.md`).
- [ ] Implement custom profile management (create, rename, duplicate, delete profile) and instant wheel hot-reload.
- [ ] Implement AEP file reference picker and missing-file recovery UI (`../docs/AEP_FILES.md`).
- [ ] Ensure `wheel_config.json` persistence across AE sessions.

## MEDIUM (Milestone 4 — Full Integration & Library Indexing)
- [ ] Expand the effect match name registry with deep Adobe effect namespaces (`../docs/EFFECTS.md`).
- [ ] Add preset chain macro execution (applying multiple effects/shortcuts in one slot).
- [ ] Implement runtime "Rebuild Library Index" scanning configured root folders.

## DEFERRED
- [ ] AEP Template Injection (`../docs/AEP_INJECTION.md`) — pending resolution of OQ-11.

## Next Action / Resume Point
1. Receive and address human tester feedback from Milestone 2 testing in After Effects.
2. Once feedback is addressed, proceed with Milestone 3 per `../milestones/MILESTONE_3.md`:
   - Interactive Wheel Settings Editor (drag/drop slot assignment, profile management).
   - AEP file reference picker and missing-file recovery UI.
