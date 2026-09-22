# SESSION_START.md — Mandatory Startup Checklist

Execute these steps, in order, at the start of every AI coding session on this project.

1. Read `AGENTS.md` — master contract.
2. Read `PROJECT_MEMORY.md` — permanent rules and philosophy.
3. Read `project_logs/CURRENT_STATE.md` — exact progress snapshot.
4. Read `project_logs/TODO.md` — identify the immediate next action.
5. Read `project_logs/HANDOFF.md` — context from the previous session.
6. Read `project_logs/DECISIONS.md` — confirm no binding architectural rule will be violated by today's task.
7. Skim `project_logs/KNOWN_ISSUES.md`'s titles/tags once, so you have a rough sense of what's already been solved (you will also search it on demand per step 13 below, the moment something actually breaks).
8. Read the current milestone file in `milestones/` (check `CURRENT_STATE.md` for which one is active).
9. Read the feature spec(s) relevant to today's task (e.g. `docs/WHEEL.md`, `docs/AEP_FILES.md`).
10. If the task touches data structures, also read `docs/DATA_MODEL.md` and `docs/SCHEMA.md`.
11. Determine the specific task to accomplish this session.
12. Cross-check the task against `project_logs/DECISIONS.md` and `project_logs/FAILED_IDEAS.md` — do not re-attempt a rejected product/feature approach without a new decision record.
13. Execute the task, following `CODING_RULES.md`. **The moment any tool call, file write, build step, or command fails: STOP and search `project_logs/KNOWN_ISSUES.md` by keyword/error-text BEFORE trying a second approach.** If a matching entry exists, apply its documented solution directly. If none exists, resolve the problem however necessary, then add a new entry to `KNOWN_ISSUES.md` before continuing (see that file's template) — do not defer this to end-of-session, since a crash or context loss mid-session would lose the lesson.
14. On completion, update:
    - `project_logs/CURRENT_STATE.md` (new progress snapshot)
    - `project_logs/CHANGELOG.md` (append the change with a version tag)
    - `project_logs/TODO.md` (mark task complete, set new "Next action")
    - `project_logs/HANDOFF.md` (summarize what was done and where to resume)
    - `project_logs/HUMAN_AI_LOG.md` (only if a significant human decision was made this session)
    - `project_logs/DECISIONS.md` (only if an architectural decision was made or changed)
    - `project_logs/KNOWN_ISSUES.md` (only if step 13 wasn't already updated live — verify it was)

If any file in this checklist does not yet exist, create it using the templates embedded in this documentation set before proceeding.
