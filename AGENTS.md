# AGENTS.md — Master Contract

## Project Purpose
Build an in-house, offline, After Effects panel plugin ("Company After Effects Radial Suite") whose primary interface is a nested radial (pie) menu for rapid command execution, plus a dockable Suite Panel for browsing/searching a library of shortcuts, menu commands, effects, and `.aep` files. A Wheel Settings editor lets each user configure what appears on their wheel.

## What This Project IS
- An internal, single-company production tool.
- Offline-first: no network calls at runtime.
- Built around 4 wheel item sources: AE Shortcuts, Menu Bar Items, Effects, `.aep` Files.
- Distributed internally (shared drive / internal deployment), not published publicly.

## What This Project Is NOT
- Not a commercial/SaaS/subscription product.
- Not a marketplace or cloud asset platform.
- Not an AI assistant; no runtime AI, ML, or OCR.
- Not telemetry-enabled; no analytics leave the machine.
- Does not simulate OS-level keystrokes — see `SHORTCUTS.md` / ADR-001 in `DECISIONS.md`.
- Does not include an interactive onboarding tour (rejected, see `FAILED_IDEAS.md`).
- Not confirmed cross-platform — treat as Windows-only until `COMPATIBILITY.md` says otherwise (open question OQ-12 in `DECISIONS.md`/`REVIEW_QUEUE.md`).

## AI Coder Responsibilities
- Read `SESSION_START.md` at the start of every session, in the order it specifies.
- Generate panel UI (HTML/CSS/JS), the ExtendScript scripting bridge, and JSON data structures per `SCHEMA.md`.
- Follow the 900-line versioning rule for all files in `project_logs/` (see `PROJECT_MEMORY.md`).
- Never invent a requirement that isn't in a static spec file — if something is undefined, add it to `REVIEW_QUEUE.md` and propose an option, but do not silently decide and move on.
- Never contradict an accepted entry in `DECISIONS.md` without a new decision record superseding it.
- **The moment a tool call, file write, build step, or command fails, search `project_logs/KNOWN_ISSUES.md` before attempting a second fix.** This is not optional troubleshooting etiquette — it is how the project avoids paying the same trial-and-error cost every session. If the fix isn't already logged, log it immediately after solving the problem, using that file's template. See `CODING_RULES.md` for the exact enforcement rule.

## Source of Truth Hierarchy (highest to lowest authority)
1. Explicit instructions from the human project owner, given directly in a session.
2. These static specification files (this file and everything they reference).
3. `project_logs/DECISIONS.md` (binding once accepted).
4. Already-implemented, human-accepted behavior in the codebase.
5. External research/documentation (e.g., Adobe's current SDK docs) — always re-verify platform-specific facts before relying on them, since they can go stale (see `TOOLS.md`).
6. Your own suggestions as the AI coder — proposals only, never authoritative until the human accepts them.

## Data Ownership
`library.json` and `wheel_config.json` (see `SCHEMA.md`) are the absolute source of truth for the runtime plugin's templates/commands and user wheel state, respectively. No database. No cloud.

## Non-Negotiable Product Rules
- Root wheel: minimum 7 slots, standardized default 8 slots (`WHEEL.md`).
- AE actions execute via `app.executeCommand()` / ExtendScript only — never simulated keystrokes.
- Every `app.executeCommand()` call (and every AE scripting call generally) is wrapped in try/catch; failures produce a non-blocking toast, never a crash (`ERROR_HANDLING.md`).
- No hardcoded absolute paths in source code — resolve everything from a configurable `rootPath` (`DATA_MODEL.md`).
- Company default wheel configuration must never be silently overwritten by normal user customization (`INSTALLATION.md`).

## Documentation Read Order
See `SESSION_START.md`.

## Simplicity Rule
The radial wheel itself must stay minimal even as the underlying library grows — see `UI_RULES.md`. The Wheel Settings editor and Suite Panel are allowed to be more feature-dense.

## No-Code-During-Spec-Sessions Rule
If a session's task is to refine specification/architecture rather than implement, do not write production code. Update the relevant static spec file(s) and record the change in `CHANGELOG.md`.

## Success Criteria
See `docs/BUILD_AND_TEST.md` §"Product Success Criteria" and each milestone's success criteria in `milestones/`.

## Log Versioning Rule
See `PROJECT_MEMORY.md` §5.
