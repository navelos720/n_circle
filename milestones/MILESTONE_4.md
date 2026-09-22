# MILESTONE 4 — Full After Effects Integration & Company Library

## Objectives
- Complete shortcuts/menu-items/effects coverage per the validated Command ID list (`../docs/SHORTCUTS.md`) — validate every ID against the actual supported AE version range before relying on it.
- Build the dev-time library indexing script and the runtime "Rebuild Library Index" button (`../docs/LIBRARY_INDEXING.md`).
- Implement every error state defined in `../docs/ERROR_HANDLING.md`.
- Complete version-compatibility validation and record findings in `../docs/COMPATIBILITY.md`.
- **Only if confirmed in scope** (check `../project_logs/DECISIONS.md` for the resolution of open question OQ-11): implement AEP Template Injection per `../docs/AEP_INJECTION.md`.

## Deliverables
- Reliable execution of the full command/menu/effect registry across all supported AE versions.
- Working "Rebuild Library Index" flow with no After Effects restart required.
- All documented error states verified to trigger correctly without crashing the plugin.
- (Conditional) working AEP injection tested against at least one complex nested pre-composition.

## Demo Checklist
See `../docs/TESTING.md` section 5.

## Success Criteria
Every documented feature is verified inside real After Effects across the full supported version range, not just visually verified in isolation.
