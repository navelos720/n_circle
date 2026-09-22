# MILESTONE 2 — Radial Wheel Prototype & Command Execution

## Objectives
- Implement the full radial interaction state machine (`../docs/WHEEL.md` section 7): `MOUSE_DOWN -> MOUSE_MOVE -> MOUSE_UP`.
- Implement the Execution Matrix (`../docs/WHEEL.md` section 8) for `ae_command` first, then `effect` and `menu_item`.
- Implement wheel-center Close/Back navigation.
- Implement folder-type parent items opening the outer ring.

## Deliverables
- A working end-to-end loop: open wheel -> select a configured action -> action executes in After Effects.
- Outer ring rendering and execution for at least one nested example (e.g. Effects -> Glow).
- The "no layer selected" error path wired for at least one effect-type action.

## Demo Checklist
See `../docs/TESTING.md` section 3.

## Success Criteria
The central `Configure -> Open wheel -> Choose item -> Execute` loop works for real AE commands, verified inside actual After Effects, not just visually in a browser preview.
