# CHANGELOG.md — Version History

Log versioning rule: freeze and roll to `CHANGELOG_2.md` past 900 lines.

## v0.1.0 — [DATE: fill in at project start]
- Initial documentation set created: `AGENTS.md`, `SESSION_START.md`, `PROJECT_MEMORY.md`, `TOOLS.md`, `CODING_RULES.md`, `FOLDER_STRUCTURE.md`, full `docs/` set, all 5 `milestones/` files, and this `project_logs/` set.
- Technology decision recorded: target CEP + ExtendScript, not UXP (see `DECISIONS.md` ADR-004).
- Slot count decision recorded: standardized 8-slot default wheel (see `DECISIONS.md` ADR-003).
- No code written yet — documentation phase only.

## v0.1.1 — [DATE: fill in when applied]
- Added `project_logs/KNOWN_ISSUES.md`: a searchable log of recurring technical problems (tool/file/build/environment errors) and their working solutions, to prevent repeated trial-and-error across sessions.
- Updated `SESSION_START.md` (added steps 7 and 13), `AGENTS.md`, `CODING_RULES.md` (added rules 13–14), and `PROJECT_MEMORY.md` (added section 5a) to require checking `KNOWN_ISSUES.md` before retrying a failed tool/file/build operation, and to require logging new fixes immediately after solving them.
- Updated `FOLDER_STRUCTURE.md` to list the new file under `project_logs/`.

## v1.0.0-m1 — 2026-09-12
- Created `sprint/` workspace housing the After Effects Radial Suite extension.
- Built Adobe CEP extension package: `manifest.xml`, `index.html`, `styles.css`, `CSInterface.js`.
- Implemented ExtendScript bridge (`hostScript.jsx`) with try/catch wrapping around `app.executeCommand()`, selection checks, and `applyEffect()`.
- Implemented Fitts's law Radial Overlay wedge calculations (`radialMath.js`, `RadialOverlay.js`) with 8 standard slots and outer submenu ring for folder items.
- Built Suite Panel browser with real-time fuzzy search, category tabs (Shortcuts, Menu Items, Effects, AEPs), and active profile selection.
- Created Wheel Settings editor for customizing slot actions and setting root path.
- Created Node.js dev-time AEP library indexer (`sprint/tools/library-indexer/index.js`).
- Created Windows 1-click batch installers (`sprint/Install_Plugin.bat`, `sprint/Uninstall_Plugin.bat`).
- Packaged Milestone 1 release artifact into `sprint/releases/milestone-01/`.

## v1.0.0-m2 — 2026-09-20
- Fixed JavaScript runtime exceptions and CSInterface loading across CEP and standalone browser environments.
- Aligned UI component DOM selectors across `index.html`, `SuitePanel.js`, and `SettingsModal.js`.
- Implemented full radial interaction state machine (`MOUSE_DOWN` -> `MOUSE_MOVE` -> `MOUSE_UP` / click mode).
- Implemented outer ring submenu fan-out on hovering/selecting `folder`-type slots (8 nested effect wedges).
- Implemented Center Hub state machine: `CLOSE` at root, `BACK` in submenus, with BACK navigation collapsing submenus.
- Implemented and verified full Execution Matrix for `ae_command`, `effect`, `menu_item`, `aep_file`, and `folder` with non-blocking toast notifications.
- Implemented layer selection validation for effect execution ("Select a layer to use this action." toast).
- Verified Suite Panel search (42+ library items) and category filtering.
- Added recurring technical issue entries to `project_logs/KNOWN_ISSUES.md` (ISSUE-001, ISSUE-002, ISSUE-003).
- Created comprehensive tester and installation tutorial guide (`TESTER_GUIDE.md`).
- Packaged Milestone 2 release artifact into `sprint/releases/milestone-02/` with complete `TEST_NOTES.md` and `TESTER_GUIDE.md`.
