# INSTALLATION.md — Installation, Initial Setup, Company Defaults

## Installation Flow
```text
Installer / deployment -> Plugin installed -> Company defaults loaded
    -> User configuration initialized -> After Effects
```
Must not require the end user to manually copy files into multiple AE directories — a single install script handles placement (see `RELEASE.md` for the packaging mechanism).

## Company Default Configuration
Ship a company default wheel configuration as `default_config.json` (referenced from `DATA_MODEL.md`'s fallback rule). Example starting content:
```text
COMPANY DEFAULT
Undo, Redo, Pre-compose, New Null, Adjustment Layer, Glow, AEP Files
```

## Company Default vs. Personal Wheel
The plugin must distinguish "Company Default" from "My Wheel" (the user's personalized profile):
- On first install, the user's active profile is a copy of the company default.
- Normal user customization (via `WHEEL_SETTINGS.md`) must never silently overwrite the stored company default — a user can always reset back to it (see "Reset to Company Default" below).
- The company default also serves as the corruption-fallback described in `DATA_MODEL.md`.

## Reset to Company Default
Provide a clear action (in `SETTINGS.md`'s Wheel section) to reset the active profile back to the company default, while optionally preserving other, unrelated personal settings.

## Uninstall
The uninstall path must cleanly remove the plugin's installed files (see `RELEASE.md` for the uninstall script) without silently deleting user-created `wheel_configs/*.json` files unless the user explicitly opts into a full data wipe.

## Upgrade Behavior
See `UPDATE_SYSTEM.md` — installation and upgrade must not be conflated; an upgrade must preserve existing user configuration wherever the schema version allows it.
