# TESTER_FEEDBACK.md — User Testing Feedback Log

Log versioning rule: freeze and roll to `TESTER_FEEDBACK_2.md` past 900 lines.

---

## Feedback Round 1 — 2026-09-24 (Post-Milestone 2)

**Testing Period**: After Milestone 2 completion
**Testers**: Internal company users
**Build Tested**: `sprint/releases/milestone-02/`

---

## CRITICAL ISSUE TO FIX

### Issue #1: Buttons Not Executing Actions in After Effects
**Status**: 🔴 OPEN - NEEDS INVESTIGATION  
**Priority**: CRITICAL - BLOCKS ALL FUNCTIONALITY  
**Tester Report**: "The buttons are not functioning in after effects. (they are not connected)"

**What IS working**:
- Panel loads and displays correctly
- UI is responsive (buttons hover, click events register)
- Library items display in the Suite Panel
- Radial wheel overlay can be summoned

**What is NOT working**:
- Clicking any button/card in the panel does NOT execute actions in After Effects
- No layers created, no effects applied, no shortcuts executed
- Actions appear to do nothing when clicked

**User's Understanding**: "I'm guessing the functions have not been connected yet"

**Next Steps for AI**:
1. Investigate the connection between panel UI buttons and ExtendScript bridge
2. Check if `hostScript.jsx` is properly loaded and accessible
3. Verify `actionExecutor.js` → `CSInterface.evalScript()` → `hostScript.jsx` flow
4. Add debug logging to identify where the connection breaks
5. Test with simple ExtendScript eval to isolate the issue
6. Document findings and implement fix

**DO NOT**:
- Do not break the existing UI functionality (panel must still load and display items)
- Do not remove any existing features to fix this
- Do not make changes that aren't directly related to fixing button execution

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
