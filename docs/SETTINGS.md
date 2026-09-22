# SETTINGS.md — User Settings (Behavior, Not Wheel Contents)

## Boundary Rule
This file governs HOW the plugin behaves. It never governs WHAT appears on the wheel — that is exclusively `WHEEL_SETTINGS.md`'s job. If a proposed setting would let a user add/remove/reassign a wheel item, it belongs in the Wheel Editor, not here.

## Sections and Options
```text
SETTINGS
├── General
├── Wheel
│   ├── Activation Trigger: "Hotkey Only" or "Hotkey + Right-Click-Hold"
│   ├── Hold Delay: slider, 50ms–500ms, default 200ms
│   ├── Slot Behavior (replace-with-undo vs. confirm-before-replace — see WHEEL_SETTINGS.md section 4)
│   ├── Appearance (theme, UI scale, wedge colors within the palette set in UI_RULES.md)
│   ├── Animation (on/off, speed)
│   └── Layout / Profiles (switch active profile — see WHEEL_SETTINGS.md section 7)
├── AEP Files (root path configuration — see DATA_MODEL.md)
├── Company Library (link to Rebuild Library Index — see LIBRARY_INDEXING.md)
└── About
```

## Persistence
- Wheel-related behavior settings (activation trigger, hold delay, active profile) persist inside `wheel_config.json` (`SCHEMA.md`).
- Pure app preferences that aren't wheel-specific (theme, UI scale) persist in a separate small `settings.json` file in the plugin's local storage directory — do not conflate this with `wheel_config.json`'s schema.
