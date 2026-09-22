# SHORTCUTS.md — After Effects Shortcut/Command Actions

## Execution Rule
All shortcut-type wheel items execute via `app.executeCommand(commandId)`. Never simulate OS-level keystrokes (see `project_logs/DECISIONS.md` ADR-001). Every call is wrapped in try/catch; on failure, show a toast ("Action failed") — never let it crash the plugin or After Effects.

## Selection-Context Checks
For any command requiring an active selection (e.g. "Split Layer," "Pre-compose"), check `app.project.activeItem.selectedLayers.length > 0` before calling `app.executeCommand()`. If the check fails, show the "no layer selected" error state (`ERROR_HANDLING.md`) instead of attempting execution.

## Starter Command ID Dictionary (Prototyping Only — Must Be Version-Validated Before Shipping)
Command IDs have shifted across After Effects versions historically. Treat the table below as a starting point for prototyping, not a final, guaranteed-stable list. Before Milestone 4 (`milestones/MILESTONE_4.md`), validate every ID actually used against each AE version listed in `COMPATIBILITY.md`, using either direct in-app testing or a maintained community Command ID reference/dataset.

| Category | Command | Example ID |
|---|---|---|
| Layer Creation | New Null | 2797 |
| Layer Creation | New Solid | 2796 |
| Layer Creation | New Adjustment Layer | 2798 |
| Layer Creation | New Shape Layer | 3736 |
| Layer Creation | New Text | 2562 |
| Layer Creation | New Camera | 2563 |
| Layer Manipulation | Pre-compose | 2073 |
| Layer Manipulation | Split Layer | 2150 |
| Layer Manipulation | Duplicate | 2080 |
| Layer Manipulation | Enable Time Remapping | 2153 |
| Layer Manipulation | Freeze Frame | 2397 |
| Transform & Anchor | Center Anchor Point in Layer | 2357 |
| Transform & Anchor | Center Anchor Point in Comp | 2358 |
| Transform & Anchor | Fit to Comp | 2157 |
| Transform & Anchor | Fit to Comp Width | 2155 |
| Transform & Anchor | Flip Horizontal | 2158 |
| Keyframes | Easy Ease | 1056 |
| Keyframes | Easy Ease In | 1057 |
| Keyframes | Easy Ease Out | 1058 |
| Keyframes | Toggle Hold Keyframe | 4176 |
| Project | New Composition | 2003 |
| Project | Import File | 2139 |
| Project | Save Project | 12 |
| Project | Increment and Save | 13 |

## Rules
- Never invent a command that After Effects does not actually expose — verify before adding to the registry.
- The full, authoritative command list is determined during implementation and lives in the Command Registry (`COMMAND_REGISTRY.md`); this file documents the mechanism and a starter set, not the final list.
- If a command's ID differs between supported AE versions, record the mapping per-version in `COMPATIBILITY.md`, and have the plugin select the correct ID at runtime based on detected AE version.
