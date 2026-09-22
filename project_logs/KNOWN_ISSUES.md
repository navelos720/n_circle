# KNOWN_ISSUES.md — Recurring Problem / Solution Log

## Purpose
This file exists to stop the same technical mistake from being solved twice. When you hit an error, a blocked tool call, a rejected file write, a broken build step, or any other snag — search this file BEFORE trying multiple fixes by trial and error. If a past session already solved this exact (or a closely similar) problem, apply that fix directly instead of re-deriving it. If no match exists, solve the problem, then add an entry here before moving on, so the next session doesn't repeat the same trial-and-error cycle.

This file is a required stop, not an optional reference. See the checklist rule in `../SESSION_START.md` and the enforcement rule in `../CODING_RULES.md`.

## When To Search This File
Search it the moment any of the following happens:
- A file write, save, or create action fails or is rejected (syntax error, escaping error, encoding error, path error, tool-specific formatting error).
- A build, compile, or package step fails.
- A tool call errors out or returns something unexpected.
- An API/SDK call behaves differently than documented (e.g. a CEP or ExtendScript quirk).
- Any error message repeats something you suspect you (or a prior session) has seen before.

Search by keyword, error text fragment, file type, or tool name — not just by exact error string, since wording can vary slightly between occurrences of the same underlying problem.

## When To Add an Entry
Add an entry immediately after resolving:
- Any problem that took more than one attempt to fix.
- Any problem that isn't already covered by an existing entry (check first — do not create a near-duplicate entry; update the existing one instead if it's the same root cause with a minor variation).
- Any problem likely to recur in a future session (syntax quirks of a specific tool, a format a specific file type requires, an environment-specific gotcha).

Do NOT log: one-off typos with no reusable lesson, or problems already fully described by an existing entry (update the existing entry's "Occurrences" count instead — see template below).

## Entry Template
Copy this block for every new entry. Keep entries short and scannable — this file is read by an AI searching under time pressure, not a human reading for leisure.

```text
### [ISSUE-ID] Short, searchable title

- Tags: (comma-separated keywords for searching — tool name, file type, error type, e.g. "json, escaping, create_file, quotes")
- Symptom: exact or near-exact error message / observed behavior.
- Context: what task was being attempted when this occurred (e.g. "writing a .jsx file containing double-quoted strings via a heredoc").
- Root Cause: the actual underlying reason, once known (not just "it failed").
- Working Solution: the exact fix — concrete enough to apply directly without re-deriving it. Include a corrected code/command snippet if relevant.
- Failed Approaches (optional): approaches that were tried and did NOT work, so future sessions don't retry them.
- First Logged: [DATE]
- Occurrences: 1 (increment this number and add the new date in parentheses if the same issue is hit again instead of creating a duplicate entry)
```

## Numbering
Use sequential IDs: `ISSUE-001`, `ISSUE-002`, etc. Never reuse or renumber an ID, even if an entry becomes obsolete — mark it `[OBSOLETE]` in the title instead of deleting it, in case an old tool/environment combination recurs.

## Log Versioning Rule
Same as every other file in `project_logs/`: when this file exceeds 900 lines, freeze it and continue in `KNOWN_ISSUES_2.md`, always appending to the newest volume. Given how frequently this file may be written to, check its line count more often than other logs.

---

## Logged Issues

### [ISSUE-001] CSInterface ES Module import failure when loaded via classic script tag

- Tags: csinterface, es-module, cep, browser-test, import
- Symptom: `Uncaught SyntaxError: The requested module './lib/CSInterface.js' does not provide an export named 'CSInterface'` or `ReferenceError: CSInterface is not defined`.
- Context: Loading `CSInterface.js` in browser testing mode or CEP while ES modules (`actionExecutor.js`, etc.) attempt named imports.
- Root Cause: Adobe CEP ships `CSInterface.js` designed as a non-module classic script attaching `CSInterface` to the global `window` object. Attempting an ES6 named import (`import { CSInterface } from './lib/CSInterface.js'`) fails in modern browsers unless `CSInterface.js` contains export statements or consumer uses `window.CSInterface`.
- Working Solution: In `CSInterface.js`, support both classic global attachment (`window.CSInterface = CSInterface;`) and standalone browser mock fallback (`if (!window.__adobe_cep__) window.CSInterface = MockCSInterface;`). In ES module consumers like `actionExecutor.js`, access `CSInterface` via `window.CSInterface` helper function (`function getCSInterface() { return window.CSInterface ? new window.CSInterface() : null; }`) rather than an ES module import.
- Failed Approaches: Adding `export { CSInterface }` directly into `CSInterface.js` breaks when loaded via standard non-module `<script src="CSInterface.js">` in classic CEP runtime.
- First Logged: 2026-09-12
- Occurrences: 1

### [ISSUE-002] Overlay and Modal visibility overriding CSS flexbox display

- Tags: css, overlay, modal, hidden, flexbox, visibility
- Symptom: `.radial-overlay` or `.modal-overlay` remains visible or does not collapse when the `.hidden` class is added, or loses centering when `.hidden` is removed.
- Context: Toggling visibility of SVG radial overlay and settings modal dialogs using CSS class `.hidden`.
- Root Cause: If `.radial-overlay` has `display: flex;` defined in its base selector, a generic `.hidden { display: none; }` without `!important` or proper selector specificity can be overridden by more specific flex rules.
- Working Solution: Define `.hidden { display: none !important; }` in `styles.css` and ensure overlays toggle the `hidden` class via JavaScript (`classList.add('hidden')` / `classList.remove('hidden')`).
- Failed Approaches: Setting inline `style.display = 'none'` directly in JS breaks CSS separation and can conflict with CSS transitions.
- First Logged: 2026-09-12
- Occurrences: 1

### [ISSUE-003] DOM Element ID alignment between index.html and UI Components

- Tags: dom, queryselector, suitepanel, settingsmodal, html
- Symptom: `Cannot read properties of null (reading 'addEventListener')` or `Cannot read properties of null (reading 'innerHTML')` on page load.
- Context: Initializing `SuitePanel.js` and `SettingsModal.js` against `index.html`.
- Root Cause: Element IDs referenced in JavaScript component files differed slightly from IDs present in `index.html` (e.g. `library-content-view` vs `library-item-list`, `close-settings-modal-btn` vs `modal-close-btn`).
- Working Solution: Use consistent element IDs across `index.html` and JavaScript components, and add defensive null-checks before binding event listeners or mutating innerHTML in all component initialization methods.
- Failed Approaches: Relying on generic class selectors without element ID validation.
- First Logged: 2026-09-12
- Occurrences: 1
