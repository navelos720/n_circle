# ERROR_HANDLING.md — User-Facing Failure Behavior

## Core Rule
Every failure path resolves to a toast notification or an inline recovery UI — never a crash, never a silent no-op, never a raw technical/stack-trace message shown to the artist.

## Defined Error States (Implement Exactly These Messages/Actions)

| Situation | Message | Actions |
|---|---|---|
| Missing AEP file | "The selected AEP file could not be found." | `[LOCATE FILE]` `[REMOVE]` |
| Invalid AEP reference | "This AEP reference is invalid." | `[EDIT]` `[REMOVE]` |
| Unsupported action for AE version | "This action is not available in the current After Effects version." | (dismiss) |
| No layer selected, action requires one | "Select a layer to use this action." | (dismiss) |
| Effect cannot apply in current context | "This effect cannot be applied in the current context." | (dismiss) |
| `app.executeCommand()` throws | "Action failed." (non-blocking toast) | (dismiss) |
| AEP injection: no active comp | toast identifying the missing active composition | (dismiss) |
| AEP injection: target comp not found in template | toast identifying the broken template | (dismiss) |

## Implementation Rules
- All AE scripting calls (command execution, effect application, AEP import/injection) are wrapped in try/catch at the point of the call, not several layers up — catch as close to the failing operation as possible so the toast can be specific.
- Route every caught error through a single shared toast/notification component (see `ARCHITECTURE.md` section 5) — do not implement ad-hoc error UI per component.
- Never let a caught error leave the plugin or After Effects in an inconsistent state (e.g. a half-completed AEP injection) — see `AEP_INJECTION.md`'s failure-handling rules for that specific case.
