# TESTING.md — Test Checklists Per Milestone & Final QA

## 1. Development Testing (Ongoing, Every Milestone)
Load the plugin in After Effects using CEP's debug/unpackaged mode. This allows hot-reload and console debugging without a full package rebuild each time.

## 2. Milestone 1 Demo Checklist (Foundation)
- [ ] Extension loads in After Effects via the CEP debug tooling without manifest errors.
- [ ] Dockable Suite Panel renders with mock data.
- [ ] Radial overlay spawns at cursor coordinates on hotkey press (static wheel, no execution wired yet).
- [ ] Mouse movement correctly calculates and highlights the active wedge (visual feedback only).
- [ ] No console errors in the CEP debug tooling.

## 3. Milestone 2 Demo Checklist (Execution & Command Wiring)
- [ ] Clicking/releasing on an `ae_command` slot (e.g. Easy Ease) successfully executes the command on selected keyframes.
- [ ] Selecting a `folder`-type slot opens the outer ring reliably.
- [ ] Attempting to apply an `effect` with no layer selected shows the defined toast (`ERROR_HANDLING.md`), not a crash.
- [ ] Nested wheel navigation (enter submenu -> back -> close) works reliably.

## 4. Milestone 3 Demo Checklist (Wheel Editor & AEP Basics)
- [ ] A non-developer user can configure their own wheel without editing project files.
- [ ] Changing a slot in the Wheel Settings "Wheel Layout" tab saves to `wheel_config.json` and instantly updates the radial menu.
- [ ] Adding an AEP file reference works, including the missing-file recovery UI (`AEP_FILES.md` section 4).
- [ ] Configuration persists correctly after closing and reopening After Effects.

## 5. Milestone 4 Demo Checklist (Full Integration & Company Library)
- [ ] Core wheel items (shortcuts, menu items, effects) execute real AE operations reliably across every supported AE version listed in `COMPATIBILITY.md`.
- [ ] "Rebuild Library Index" successfully scans the configured root folder and updates the Suite Panel grid without restarting After Effects.
- [ ] Every error state defined in `ERROR_HANDLING.md` triggers correctly and never crashes the plugin.
- [ ] (Only if `AEP_INJECTION.md` is in scope) Template injection: silent import, correct target-comp location, placeholder swap, source cleanup — tested against at least one complex nested pre-composition, not only flat single-comp templates.

## 6. Milestone 5 — Final QA Checklist (Pre-Release)
Run on a clean test machine/VM that has After Effects installed but has NEVER had this plugin installed before.
- [ ] Installation script runs successfully without requiring administrator privileges (if installing to a per-user location) or correctly requests them (if installing to a shared/Program Files location).
- [ ] Plugin appears correctly in After Effects' extension/panel list.
- [ ] All features from Milestones 1–4 work identically to the development environment.
- [ ] Plugin functions 100% offline — disconnect the network entirely and verify template/AEP behavior and settings save/load still work.
- [ ] `wheel_config.json` persists correctly after closing and reopening After Effects.
- [ ] Uninstall script cleanly removes the plugin without deleting user `wheel_configs/*.json` files unless the user explicitly opted into a full wipe (`INSTALLATION.md`).

## Recording Results
Log every completed checklist (pass/fail per item) under the corresponding `releases/milestone-0N/TEST_NOTES.md` file, and record any newly discovered issue in `project_logs/REVIEW_QUEUE.md`.
