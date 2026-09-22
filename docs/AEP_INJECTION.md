# AEP_INJECTION.md — Template Injection Workflow (Optional / Deferred Feature)

## Status
This is a separate, larger feature than the simple "open project" behavior in `AEP_FILES.md`. Do not build this unless `project_logs/DECISIONS.md` explicitly confirms it is in scope (see open question OQ-11 in `project_logs/REVIEW_QUEUE.md`). If not confirmed, skip this file entirely for V1 and rely on `AEP_FILES.md` only.

## Trigger
`type: "aep_template"` wheel items, and the equivalent action in the Suite Panel (an "Inject" button on a template card, see `UI_LAYOUT.md`).

## Required Sequence
1. **Identify Target**: read `library.json` using `slot.templateId` to get `aepFilePath`, `targetCompName`, `placeholderLayerName` (schema in `SCHEMA.md`).
2. **Resolve Path**: combine the configured `rootPath` with `aepFilePath` to get an absolute path — never hardcode this path.
3. **Silent Import**: import the `.aep` into `app.project` without opening a separate AE window.
4. **Locate Composition**: find the CompItem among the imported items whose name matches `targetCompName`.
5. **Inject at Playhead**: create a new layer from that CompItem inside `app.project.activeItem`, positioned at `app.project.activeItem.time`.
6. **Placeholder Auto-Mapping**: if a layer was selected in After Effects *before* the action was triggered, AND the injected comp contains a layer named `placeholderLayerName` (e.g. `__PLACEHOLDER__`), replace that placeholder layer's source with the user's pre-selected layer.
7. **Cleanup**: move all imported-but-now-unused source items into a dedicated "Template Sources" folder in the Project panel, to keep the user's workspace clean.

## Failure Handling
- No active composition open when injection is triggered: show a toast, do not attempt injection.
- Target composition not found inside the imported `.aep`: show a toast identifying the broken template, do not partially inject.
- Any exception during import/injection: catch it, show a toast, leave the user's project in its pre-injection state as much as possible (avoid partial imports where feasible).

## Testing Requirement
Before this feature can be marked complete, it must be tested against complex nested pre-compositions, not just flat single-comp templates — record this explicitly in `TESTING.md`'s checklist for whichever milestone implements this feature.
