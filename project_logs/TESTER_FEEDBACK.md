# TESTER_FEEDBACK.md — User Testing Feedback Log

Log versioning rule: freeze and roll to `TESTER_FEEDBACK_2.md` past 900 lines.

---

## Feedback Round 1 — 2026-09-24 (Post-Milestone 2)

**Testing Period**: After Milestone 2 completion
**Testers**: Internal company users
**Build Tested**: `sprint/releases/milestone-02/`

---

## CRITICAL ISSUE - PARTIALLY RESOLVED

### Issue #1: Buttons Not Executing Actions in After Effects
**Status**: 🟡 PARTIALLY FIXED - Bridge now loads, but some commands don't work  
**Priority**: MEDIUM - Some functionality working, some not  

**Progress Summary**:
- ✅ **FIXED**: ExtendScript bridge now loads successfully (auto-detects and loads `hostScript.jsx` if missing)
- ✅ **WORKING**: Some tools execute correctly (e.g., "New Shape Layer", "New Camera")
- ⚠️ **ISSUE REMAINS**: Other commands show "Executed" toast notification but don't actually work in AE

**What IS working now**:
- Panel loads and displays correctly
- UI is responsive (buttons hover, click events register)
- Library items display in the Suite Panel
- ExtendScript bridge connects automatically (toast: "Bridge ready - all systems operational")
- Some commands execute successfully:
  - New Shape Layer
  - New Camera
  - (Other working commands to be identified during testing)

**What is NOT working**:
- Some commands show success toast ("Executed: [command name]") but no action happens in After Effects
- Examples of non-working commands: (to be documented)
- Unclear which commands work vs don't work - needs systematic testing

**Root Cause Hypothesis**:
- Bridge connection is now working (confirmed by successful commands)
- Issue likely with specific command IDs or context requirements
- Possible causes:
  1. Incorrect `commandId` mapping for some shortcuts
  2. Commands requiring specific AE context (comp selected, layer selected, etc.) but context check not failing
  3. Some commands may need different execution method (not `app.executeCommand`)

**Next Steps** (DEFERRED until after Milestone 3):
1. Systematically test all library items and document which work vs don't work
2. Compare working vs non-working command patterns
3. Verify command IDs against Adobe's official command ID list
4. Check if non-working commands have specific context requirements
5. Add better error reporting from ExtendScript side to identify why commands fail silently
6. Document findings and implement fixes

**Files Modified**:
- `sprint/ae-radial-plugin/src/main.js` — Added `checkExtendScriptBridge()` with auto-load functionality
- `sprint/ae-radial-plugin/src/utils/actionExecutor.js` — Added debug logging

---

## UI REFINEMENT FEEDBACK (Milestone 3 Testing)

### Issue: Wheel Editor UI Needs Polish
**Status**: 🟡 DOCUMENTED - Will be addressed after core functionality  
**Priority**: MEDIUM - Affects usability but not core functionality  
**Feedback**: "The UI needs to be refined with proper icons and words"

**What needs improvement**:
- Icons: Currently using text labels only; need proper visual icons for each item type
- Labels: Some labels could be clearer or more descriptive
- Visual design: Wheel slots need better visual styling and feedback
- Empty states: Empty slots need clearer visual indicators
- Instructions: Hover tips and help text could be more helpful

**Recommended approach** (to be implemented later):
1. Add icon support to library items (icon field in schema)
2. Implement icon rendering in wheel slots
3. Improve empty slot visual states
4. Add better tooltips and help text
5. Consider color-coding by item type

**Next Steps**: Document in TODO.md for post-Milestone 4 implementation

---

## FEATURE SUGGESTIONS (FOR LATER - NOT CURRENT PRIORITY)

### Suggestion #2: Standalone Wheel Activation
**Status**: 📋 LOGGED FOR FUTURE CONSIDERATION  
**Tester Quote**: "I want for the radial wheel to activate outside of the 'company radial suite' plugin. It should also be a standalone extension because I plan to set my own keyboard shortcut"

**Understanding**: User wants to trigger the radial wheel via a custom AE keyboard shortcut, even when the panel is not visible/docked.

**Notes**:
- This is NOT the same as Issue #1 (button connection problem)
- This is a NEW feature request, not a bug
- Requires architecture research (CEP panels can't natively register global AE shortcuts)
- Defer until after Issue #1 is fixed and Milestone 3 is complete

---

### Suggestion #3: Wheel Settings Editor
**Status**: ✅ ALREADY PLANNED IN MILESTONE 3  
**Tester Quote**: "Radial settings option where people can edit what appears on the wheel"

**Understanding**: User wants UI to customize which commands/effects appear on the radial wheel.

**Notes**:
- This is ALREADY fully specified in `milestones/MILESTONE_3.md` and `docs/WHEEL_SETTINGS.md`
- Will include drag-and-drop slot assignment, profile management, and configuration persistence
- NO additional work needed for specifications
- Implement after Issue #1 is fixed

---

## CURRENT PRIORITY

**ONLY ONE THING TO FIX RIGHT NOW**: Issue #1 (buttons not executing AE actions)

Once that works, proceed to Milestone 3 implementation.

---

## Change Log
- **2026-09-24**: Created file with clarified tester feedback (1 critical bug, 2 feature suggestions)
