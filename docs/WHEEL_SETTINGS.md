# WHEEL_SETTINGS.md — Wheel Editor Specification

## 1. Purpose
A visual wheel editor, not a plain settings form. It is the only place where wheel contents are configured — the wheel itself (`WHEEL.md`) never lets a user add/remove items directly. This editor is allowed to be more feature-dense than the wheel (per `AGENTS.md`'s simplicity rule, which applies to the wheel, not to this editor).

## 2. Required Capabilities
- View and search all available items (pulled from `COMMAND_REGISTRY.md`).
- Drag an item onto an inner slot, an outer slot, or an appropriate submenu location.
- Remove, replace, and reorder items.
- Create and edit parent/submenu (`folder`) relationships.
- Add/manage AEP file references (`AEP_FILES.md`).
- Rename display labels where permitted.
- Configure per-item appearance (icon) where permitted.
- Save and reset the current configuration.

## 3. Recommended Layout
```text
+------------------------------------------------------+
| WHEEL SETTINGS                                    X   |
+------------------------------------------------------+
| Search items...                                       |
+------------------------+-------------------------------+
| AVAILABLE ITEMS        | WHEEL EDITOR                  |
| SHORTCUTS               |        [ ITEM ]              |
|  Undo / Redo / ...      |  [ITEM]           [ITEM]      |
| MENU ITEMS               |                               |
|  New Null / ...          | [ITEM]      *      [ITEM]     |
| EFFECTS                   |                               |
|  Glow / Blur / ...        |  [ITEM]           [ITEM]      |
| AEP FILES                  |        [ ITEM ]              |
|  Project A.aep / ...        |                               |
+------------------------+-------------------------------+
|                     [SAVE] [RESET]                     |
+------------------------------------------------------+
```
Build to this structure; exact pixel/visual polish is governed by `UI_LAYOUT.md`.

## 4. Drag-and-Drop Flow
```text
Select item -> Drag -> Drop onto wheel slot -> Slot becomes configured
```
- Dropping onto an occupied slot: implement direct replacement with an undo/recovery affordance (this is the recommended default, prioritizing fast configuration). If this proves problematic in testing, an explicit-confirmation-before-replace mode is the fallback — record whichever is finalized in `project_logs/DECISIONS.md`.
- Removal must be at least as easy as assignment: select slot -> "Remove Item," and/or drag off the wheel to delete.

## 5. Submenu Editing
Selecting a `folder` slot in the editor opens a mini radial editor scoped to that folder's `children` array, using the same drag/remove/reorder rules as the root editor, plus a clear "back to root wheel editor" affordance.

## 6. Slot Rules (Enforce in Code)
- Never allow saving a configuration with fewer than 7 inner slots defined (empty slots are fine — the rule is about slot *count*, not fill rate).
- Empty slots must have zero destructive behavior if engaged.
- The user never manually sets an angle — position is derived purely from slot order (`WHEEL.md` section 2).

## 7. Wheel Profiles (Multiple Layouts)
Support named, swappable full wheel configurations (e.g. "Default," "Animation," "Compositing," "Editing," "Personal") — this maps directly to the `profiles` array already defined in `wheel_config.json` (`SCHEMA.md`). Whether this ships in V1 or a later milestone is an open decision (OQ-5, `project_logs/REVIEW_QUEUE.md`) — the data model already supports it either way, so do not block schema design on this decision.

## 8. Search
Global item search across: display names, categories, tags, AEP file names, and user-defined labels. Search belongs to this editor and the Suite Panel (`UI_LAYOUT.md`) — the radial wheel itself must never become a search interface.
