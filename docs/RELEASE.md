# RELEASE.md — Packaging, Distribution, Versioning, Rollback

## Packaging Technology
Given the CEP decision in `TOOLS.md`, the practical, currently-supported packaging path is:

- **Target format**: package the plugin as a CEP extension, distributed as a `.zxp` file.
- **Installer**: use a drag-and-drop `.zxp` installer tool (a widely-used community "ZXP/UXP Installer" application is one real option for this exact scenario), OR an internal equivalent install script that copies the extension into the correct CEP extensions directory.
- **Why not a bare `.exe`/Electron installer**: unnecessary bundled-runtime weight, triggers antivirus/SmartScreen friction, and After Effects already hosts CEP panels natively — no separate runtime is needed.
- **Why not UXP packaging today**: no shipped After Effects panel support for UXP as of the last verification in `TOOLS.md`. If that changes, revisit this section together with `TOOLS.md` and record the change in `project_logs/DECISIONS.md`.

## Distribution Package Contents
- The compiled CEP extension folder: `CSXS/manifest.xml`, `index.html`, `/src`, `/assets` (see `FOLDER_STRUCTURE.md`).
- An install script (`Install_Plugin.bat` or `.ps1`, Windows-default per `COMPATIBILITY.md`) that:
  1. Copies the extension into the correct CEP extensions directory.
  2. Optionally seeds `/AETemplates/` and `library.json` into the shared company path (`FOLDER_STRUCTURE.md` section 3).
  3. Displays a short "Installation complete — please restart After Effects" message.
- An uninstall script (`Uninstall_Plugin.bat`) that removes the installed extension files without touching user `wheel_configs/*.json` files unless explicitly instructed otherwise.

## AI Coder Requirements for the Extension
- Give the extension a real, unique CEP extension ID and a version number in `manifest.xml`.
- Resolve all file paths dynamically at runtime — never hardcode a developer's local path.

## Build Pipelines (Three Distinct Pipelines — Do Not Conflate Them)
```text
Development:    Source -> Dev build -> Local AE test (CEP debug/unsigned-load mode, fast iteration)
Milestone Demo: Milestone implementation -> Demo package -> Human test system (see BUILD_AND_TEST.md)
Final Release:  Release build -> Installable package (.zxp + installer script) -> Company computers
```
A final release build must never depend on the developer's local source directory being present.

## Release Folder Structure
```text
releases/
├── milestone-01/ { build/, TEST_NOTES.md, CHANGE_NOTES.md }
├── milestone-02/  ...  milestone-05/
└── final/
    ├── Company-AE-Suite-1.0.0/
    ├── RELEASE_NOTES.md
    ├── INSTALLATION.md
    └── CHECKSUMS.txt
```

## Versioning
`MAJOR.MINOR.PATCH` (e.g. `1.0.0`). Milestone builds use a suffix (e.g. `0.1.0-m01`).

## Rollback
Retain at least one previous stable internal release at all times, so the company can revert if a new release causes critical issues.

## Pre-Release Requirement
At least one clean-machine install test (a machine that has never had the plugin installed) must pass before a final internal release ships — see `TESTING.md` section 6 for the exact checklist.

## Internal Distribution
Company shared drive, internal file server, physical/local transfer, or an approved internal deployment system. No public download service and no cloud account requirement of any kind.
