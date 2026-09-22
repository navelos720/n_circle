# REVIEW_QUEUE.md — Items Requiring Human Decision or Verification

Goal: this file should be empty before final release. Log versioning rule: freeze and roll to `REVIEW_QUEUE_2.md` past 900 lines (unlikely, but follow the rule consistently).

---

## Open Questions Requiring a Human Decision

- **OQ-1 — Root slot maximum.** Minimum 7 confirmed; default standardized at 8 (`DECISIONS.md` ADR-003). Practical maximum above 8 is still undecided.
- **OQ-2 — Outer ring slot maximum.** Target range 7–12 recommended; needs a final usability decision.
- **OQ-5 — Multiple wheel profiles in V1 or a later milestone?** The data model already supports it either way (`../docs/SCHEMA.md`); this only affects scheduling, not schema.
- **OQ-6 — Custom icons: built-in set only, user-uploaded, or company-provided custom set?**
- **OQ-7 — Should users be able to create entirely custom categories/submenus, or only reorganize existing ones?**
- **OQ-8 — Should any wheel items be "company-locked" (protected from user removal)?**
- **OQ-9 — AEP file organization: user-created categories vs. fixed folder-based collections?**
- **OQ-10 — Should wheel-configuration export/import (to a local file) ship in V1?** Recommended yes, not yet a binding decision.
- **OQ-11 — AEP Injection scope.** Does the product need the full template-injection workflow in `../docs/AEP_INJECTION.md`, or is the simpler "open as project" behavior in `../docs/AEP_FILES.md` sufficient for V1? This materially changes Milestone 4's scope. **Blocking — needs a decision before Milestone 4 begins.**
- **OQ-12 — OS scope confirmation.** Windows-only is assumed as the default (`../docs/COMPATIBILITY.md`). Confirm whether any target machines run macOS, since this affects the scripting bridge and installer scripts (`../docs/RELEASE.md`). **Blocking — needs confirmation before Milestone 1's installer work begins.**
- **OQ-13 — CEP vs. UXP re-check.** The CEP recommendation in `../docs/TOOLS.md` is correct as of when it was written but is a fast-changing platform fact. Re-verify against current Adobe documentation before implementation begins, especially if time has passed since this documentation set was produced.

## Items Requiring Technical Verification (Not a Human Product Decision, but Must Be Checked)
- [ ] Verify every `app.executeCommand` ID used in `../docs/SHORTCUTS.md` against the actual supported AE version range — the shipped table is a prototyping starting point only.
- [ ] Confirm the CEP-vs-UXP platform status is still accurate (duplicates OQ-13 — remove this line once OQ-13 is resolved and verified).
- [ ] Test AEP silent import and placeholder-swap logic (if OQ-11 resolves in favor of building it) against complex nested pre-compositions, not just flat single-comp templates.
- [ ] Verify file system read/write permissions for the panel extension on the actual target Windows deployment path (e.g. `C:/ProgramData/...`).
