# CODING_RULES.md — Implementation Standards

1. **Single-responsibility**: functions and components do one thing well (e.g. `calculateWedgeAngle()`, `executeAepInjection()`, `resolveRootPath()`).
2. **Functional UI only**: use functional components (or clean vanilla-JS modules). No class-based legacy patterns.
3. **Strong typing**: if using TypeScript, type every interface defined in `docs/SCHEMA.md`. No `any`-style escape hatches.
4. **No hardcoded paths**: always resolve file paths dynamically from the configurable `rootPath` setting (`docs/DATA_MODEL.md`). Never embed a company-specific absolute path (e.g. a literal `C:/ProgramData/...` string) directly in application logic — it belongs in configuration.
5. **Graceful degradation**: wrap every `app.executeCommand()` (and any other AE scripting call that can fail) in try/catch. On failure, show a non-blocking toast per `docs/ERROR_HANDLING.md`. Never let a failed command crash the panel or After Effects.
6. **Documentation-first for data changes**: if a task requires changing a data structure, update `docs/SCHEMA.md` (and `docs/DATA_MODEL.md` if the philosophy changes) BEFORE writing the code that consumes the new shape.
7. **Separate concerns**: UI rendering code must not directly contain command-execution logic; route all execution through the Action Executor described in `docs/ARCHITECTURE.md`.
8. **Validate persisted configuration on load**: never trust `wheel_config.json` blindly. If it is missing or fails validation, fall back to `default_config.json` per `docs/DATA_MODEL.md`, and do not crash.
9. **Avoid blocking the AE UI thread**: library loading, indexing, and any I/O must not block wheel activation (`docs/LIBRARY_INDEXING.md`).
10. **Document unusual integration behavior**: if an AE version behaves unexpectedly for a given command/effect, record it in `docs/COMPATIBILITY.md`, not just in code comments.
11. **Add tests for command mappings**: every entry used from the Command ID table in `docs/SHORTCUTS.md` needs at least one test verifying it executes without throwing on the target AE version(s).
12. **No unnecessary dependencies**: do not add a library or service unless it solves an actual, current requirement from a static spec file.
13. **Check `project_logs/KNOWN_ISSUES.md` before trial-and-error.** The instant any tool call, file write, build/package step, or command fails, search that file by keyword/error-text before attempting alternative fixes. This applies to every kind of failure, not just code — file-writing syntax errors, escaping/quoting issues, manifest/build errors, CEP or ExtendScript quirks, etc.
14. **Log new failures immediately after solving them.** If the problem you just fixed took more than one attempt and isn't already covered by an existing `KNOWN_ISSUES.md` entry, add a new entry there before moving to the next task — using the exact template in that file (Tags, Symptom, Context, Root Cause, Working Solution, Failed Approaches). Do this at the moment of resolution, not at end-of-session, so the lesson isn't lost if the session ends unexpectedly. If the same issue recurs, increment that entry's "Occurrences" count instead of creating a duplicate.
