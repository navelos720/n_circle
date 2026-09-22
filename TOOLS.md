# TOOLS.md — Approved Technology Stack

## Platform Decision (Read This Before Choosing Any Framework)
Target **Adobe CEP (Common Extensibility Platform) + ExtendScript**, NOT UXP, for the panel and scripting runtime.

Rationale: Adobe has not shipped UXP panel/plugin support for After Effects (only Premiere Pro has a standard UXP release as of the last verification; a few other Adobe apps expose UXP for scripting only). AE panel plugins currently load through CEP, using ExtendScript (`.jsx`) for AE DOM/command access via `CSInterface.evalScript()`. Adobe has stated CEP will be retired "eventually" but has given no timeline.

**This is a time-sensitive platform fact, not a permanent architectural law.** Before starting implementation, re-check current Adobe developer documentation to confirm CEP is still the correct target and UXP panel support still hasn't shipped for AE. If UXP panel support for AE has since shipped, raise this in `project_logs/REVIEW_QUEUE.md` before proceeding, and update this file + `docs/ARCHITECTURE.md` + `RELEASE.md` accordingly via a new entry in `project_logs/DECISIONS.md`.

## Runtime Technologies (Shipped With the Plugin)
- **Framework**: Adobe CEP (HTML/CSS/JS panel), packaged with `CSXS/manifest.xml`.
- **UI**: HTML5, CSS3, and Vanilla JS or a bundled lightweight framework (React is acceptable if bundled for CEP's Chromium host — do not assume any UXP-only or Node-only runtime API is available inside the panel).
- **Styling**: any CSS approach that compiles to static CSS (e.g. Tailwind precompiled to static output).
- **State management**: a small in-panel store (e.g. a Zustand-equivalent, or plain module-level state) is sufficient — do not add a heavy state library.
- **Scripting bridge**: `CSInterface.evalScript()` from the panel into ExtendScript `.jsx` files for all After Effects DOM access and `app.executeCommand()` calls.

## Development-Only Technologies (Never Shipped in the Runtime Plugin)
- Node.js — for building/bundling the CEP panel.
- Python or Node.js — for the dev-time library-indexing script described in `docs/LIBRARY_INDEXING.md`.

## Excluded / Forbidden Technologies
- No OS-level keystroke simulators (e.g. robotjs-style libraries). Use `app.executeCommand()` / ExtendScript exclusively — see `project_logs/DECISIONS.md` ADR-001.
- No cloud APIs, remote databases, or telemetry/analytics SDKs of any kind.
- No runtime AI, ML, or OCR libraries.
- Do not permanently commit the packaging format (see `RELEASE.md`) until the CEP integration has been prototyped end-to-end and validated inside real After Effects.

## Command Execution Rule
All AE command execution goes through `app.executeCommand(commandId)`, wrapped in try/catch, per `docs/SHORTCUTS.md` and `docs/ERROR_HANDLING.md`. Do not build any code path that simulates keyboard input at the OS level.
