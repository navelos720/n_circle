# AEP_FILES.md — Simple AEP File Management (V1 Baseline)

This file covers the "open a `.aep` project" behavior only. For the separate, optional "inject a template into the current comp" behavior, see `AEP_INJECTION.md` — do not merge these two features' code paths; they are scoped independently and one may ship without the other.

## 1. Add AEP
User selects "+ ADD AEP FILE," picks a `.aep` file via a file picker. Store a reference (id, display name, path, category) — never duplicate the file itself. Reference model:
```text
AEP Item
├── id
├── displayName
├── path
├── category
└── optional metadata
```
Full JSON shape: see `SCHEMA.md`.

## 2. Display Name
Show a readable name by default (e.g. "Cinematic Intro.aep"). Support an optional custom display label (e.g. "Cinematic Intro") that overrides the filename in the UI without renaming the underlying file.

## 3. Execution (`type: "aep_file"`)
On release from the wheel or a click in the Suite Panel: open the referenced `.aep` file as a project in After Effects. This is a straightforward "open project" action, not an import/injection — see `AEP_INJECTION.md` if the richer behavior is needed instead.

## 4. Missing AEP Handling
If a referenced file no longer exists at its stored path, show:
```text
Cinematic Intro
File not found.
[LOCATE FILE]  [REMOVE]
```
Never fail silently. `[LOCATE FILE]` opens a file picker to re-link the reference to a new path; `[REMOVE]` deletes the reference from the library.

## 5. Invalid Reference
If a reference is malformed (fails schema validation): show `"This AEP reference is invalid." [EDIT] [REMOVE]`.

## 6. Categorization
AEP references are grouped by category (e.g. Company / YouTube / Personal — see `EFFECTS.md`-style grouping pattern). Whether categories are user-created or fixed folders/collections is an open decision — see `project_logs/REVIEW_QUEUE.md` OQ-9.

## 7. Dependency Warning (Optional, Not V1)
If the system can reliably detect a missing dependency (e.g. a linked footage file inside the `.aep`), it may warn before opening. This is optional and must not be built at the expense of V1 scope.
