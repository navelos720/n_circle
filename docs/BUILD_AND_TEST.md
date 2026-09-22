# BUILD_AND_TEST.md — Development, Testing, and Milestone Lifecycle

## Core Loop (Mandatory for Every Milestone)
```text
IMPLEMENT -> DEVELOPMENT BUILD -> AUTOMATED TESTS -> AFTER EFFECTS MANUAL TEST
   -> MILESTONE DEMO BUILD -> HUMAN TEST -> PASS -> MILESTONE COMPLETE
                                          -> FAIL -> FIX -> REBUILD -> RETEST
```
Every milestone MUST end with a usable demo build the human project owner can load/install and actually test. A milestone without a testable demo is not complete, regardless of how much code was written.

## Development Build
Used continuously during active work. Load the extension in After Effects using CEP's debug/unpackaged loading mode for hot-reload and console debugging without a full package build each iteration. Development builds do not need to be polished, but must be reproducible and sufficient to verify the specific feature under work.

## Milestone Demo Build
At the end of every milestone (`milestones/MILESTONE_N.md`), produce a separate demo package under `releases/milestone-0N/`, containing: the build itself, a version/build identifier, demo notes, the milestone's test checklist (from `TESTING.md`), known issues, and the required AE version/environment to run it.

## Human Testing
The human project owner must be able to test every milestone without reading source code, using the checklist provided in `TESTING.md` for that milestone. See that file for the actual checklist content per milestone.

## Milestone Acceptance
A milestone is complete only when ALL of the following are true:
1. Required objectives (per `milestones/MILESTONE_N.md`) are implemented.
2. A usable demo build exists.
3. Automated/developer tests pass.
4. The human test checklist (`TESTING.md`) has been completed.
5. Known critical defects are resolved, or explicitly accepted by the project owner as non-blocking.
6. Documentation is updated to reflect what was actually built.
7. `project_logs/CURRENT_STATE.md`, `TODO.md`, `CHANGELOG.md`, and relevant `HANDOFF.md`/`DECISIONS.md` entries are updated.

A milestone may be marked "conditionally complete" only with explicit project-owner acceptance of remaining non-critical issues, recorded in `REVIEW_QUEUE.md`.

## Failed Demo
```text
DEMO -> FAILED TEST -> Record issue in REVIEW_QUEUE.md -> Fix -> Rebuild -> Repeat test
```
Never mark a milestone complete simply because the original implementation was finished — it must pass its human test.

## Product Success Criteria (V1)
An internal AE artist must be able to:
1. Open the wheel almost instantly.
2. See their configured 7–8+ primary actions.
3. Navigate into a submenu when needed.
4. Reach additional outer-ring items without cluttering the root wheel.
5. Execute native AE actions.
6. Apply effects.
7. Access menu commands.
8. Open configured AEP files.
9. Configure all of the above without editing code.
10. Return to the same configuration in a future After Effects session.
11. Recover from a missing AEP reference.
12. Understand errors without developer assistance.

## Primary User Workflows (Reference for Test Design)
```text
Direct action:   Activate wheel -> select inner item -> action executes
Grouped action:  Activate wheel -> select Effects (folder) -> outer ring appears -> select Glow -> Glow applied
AEP open:        Activate wheel -> AEP Files -> Company/Category -> Project -> AEP opens
Configuration:   Open Wheel Settings -> search/select item -> drag onto slot -> configure parent/children as needed -> Save -> return to After Effects
```
