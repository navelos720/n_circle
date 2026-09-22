# DECISIONS.md — Architectural Decision Records

Log versioning rule: freeze and roll to `DECISIONS_2.md` past 900 lines. Every entry is binding once marked "Accepted," and must not be silently contradicted by future work — superseding a decision requires a new, explicitly linked entry.

---

## ADR-001 — Use Command IDs, Not Keystroke Simulation
- **Context**: Users trigger After Effects shortcuts/commands from the radial wheel.
- **Decision**: Execute all such actions via `app.executeCommand(commandId)` exclusively.
- **Reason**: Platform scripting restrictions make global OS-level keystroke injection unreliable and, in a CEP-based extension, effectively unavailable. Command IDs, wrapped in try/catch, are the only reliable execution path.
- **Alternatives Considered**: OS-level keystroke simulation libraries — rejected (see `FAILED_IDEAS.md`).
- **Status**: Accepted.

## ADR-002 — Local JSON as the Sole Persistence Layer
- **Context**: Need durable storage for the template/asset library and user wheel configuration.
- **Decision**: Use `library.json` and `wheel_config.json` exclusively. No SQLite, no external database, no cloud storage.
- **Reason**: Guarantees full offline capability, fast load times, and easy manual inspection/recovery if something goes wrong.
- **Alternatives Considered**: SQLite — rejected as unnecessary overhead for this data volume; cloud sync — rejected, out of scope (see `PROJECT_MEMORY.md`).
- **Status**: Accepted.

## ADR-003 — 8-Slot Standardized Radial Menu
- **Context**: Choosing the root wheel's slot count.
- **Decision**: Standardize on 8 slots (45-degree wedges) as the default, with 7 as the hard architectural floor.
- **Reason**: An even division maximizes each wedge's angular size (Fitts's Law) and simplifies directional muscle memory versus an odd slot count.
- **Alternatives Considered**: Variable/unlimited slot count with no standard default — rejected as it complicates the default UX; a strict minimum-7-only rule with no standard — rejected as too vague for initial implementation.
- **Status**: Accepted.

## ADR-004 — Target CEP + ExtendScript, Not UXP, for the Panel Runtime
- **Context**: Choosing the plugin's runtime platform/framework.
- **Decision**: Build the panel and radial overlay on Adobe CEP (HTML/CSS/JS) with an ExtendScript (`.jsx`) bridge via `CSInterface.evalScript()`, packaged as a `.zxp`.
- **Reason**: As of the last verification (see `TOOLS.md`), Adobe has not shipped UXP panel/plugin support for After Effects — only Premiere Pro has full UXP panel support, with a few other apps exposing UXP for scripting only. CEP is the only currently-shipping panel technology for AE plugins.
- **Alternatives Considered**: Building directly on UXP panel APIs — rejected because they do not yet exist for After Effects; a standalone Electron/`.exe` application — rejected as unnecessary given native CEP panel hosting.
- **Status**: Accepted, provisional. Re-verify against current Adobe documentation before implementation if significant time has passed since this record was written — see open question OQ-13 in `REVIEW_QUEUE.md`. Adobe has stated CEP will eventually be retired, with no announced date as of this writing.
