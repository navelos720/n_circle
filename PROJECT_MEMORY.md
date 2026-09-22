# PROJECT_MEMORY.md — Permanent Project Rules

## 1. Identity
An ultra-fast, offline, in-house productivity accelerator for After Effects, centered on a nested radial (pie) menu.

## 2. Philosophy
Speed and reliability over flashy features. Fitts's Law governs radial menu design: wedges must be large enough that clicking anywhere within the angular wedge registers — never require pixel-precise aim at a tiny icon.

## 3. Offline-First
No network calls anywhere in the runtime plugin. All assets, configs, and templates live on the local file system, resolved from a configurable `rootPath` (see `docs/DATA_MODEL.md`).

## 4. Panel-Based UI
The dockable Suite Panel and the radial overlay are both standard web-technology UI (HTML/CSS/JS) hosted inside Adobe's CEP (Common Extensibility Platform) panel runtime — see `TOOLS.md` for the full technology decision and why UXP was not chosen.

## 5. Log Versioning Rule
Files in `project_logs/` are never truncated. When a log file exceeds 900 lines, create a new numbered volume (e.g. `CURRENT_STATE.md` → `CURRENT_STATE_2.md`), freeze the old file, and always append to the newest volume going forward. This applies to every file in `project_logs/`, including `KNOWN_ISSUES.md`.

## 5a. Known-Issues Discipline
`project_logs/KNOWN_ISSUES.md` is a searchable log of technical problems (tool/file/build/environment errors) and their working solutions — distinct from `FAILED_IDEAS.md`, which is about rejected product/feature approaches, not tooling errors. Every session must search it the instant something breaks, before trying alternative fixes, and must add an entry the instant something is solved for the first time. This rule exists specifically to stop the same syntax/tooling mistake from being re-solved by trial and error in every new session. See `KNOWN_ISSUES.md` and `CODING_RULES.md` rules 13–14 for the exact mechanics.

## 6. Quality Standards
- Every `app.executeCommand()` call MUST be wrapped in try/catch.
- No hardcoded absolute paths anywhere in source; use relative paths resolved from `rootPath`.
- UI must support dark mode natively (After Effects' own UI is dark).
- TypeScript (or equivalent strong typing) interfaces must exist for every JSON schema in `docs/SCHEMA.md` before code that consumes them is written.

## 7. Completion Definition
A feature is complete only when it: works fully offline; handles edge cases (no layer selected, missing file, corrupted config); updates local JSON state without corrupting it; and has been verified inside a real After Effects install, not just visually in a browser/dev tool.

## 8. Core Non-Negotiables (also stated in AGENTS.md — repeated here because they must never be relaxed by a future session)
- Radial wheel is the primary interface; minimum 7 slots, standardized default 8.
- Outer ring exists purely for submenu/child navigation — it does not appear at wheel root.
- Wheel Settings controls 100% of wheel contents; nothing is hardcoded into the wheel itself.
- `.aep` files are first-class wheel items (see `docs/AEP_FILES.md`).
- No cloud, no AI, no telemetry, no OS-level keystroke simulation.
