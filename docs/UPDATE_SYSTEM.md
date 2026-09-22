# UPDATE_SYSTEM.md — Versioning, Migration, Rollback

## Update Model
```text
New Company Version -> Internal deployment -> Existing user configuration preserved where compatible
```
User wheel configurations (`wheel_config.json`) must not be casually lost during an application update.

## Migration
- If a schema change is made to `wheel_config.json` or `library.json` (`SCHEMA.md`), write a migration step that upgrades existing files in place on first load after update, rather than discarding them.
- Migration logic must be tested against a real pre-update config file before the release ships — see `TESTING.md`.
- If a config file cannot be migrated safely, fall back to the corruption-handling rule in `DATA_MODEL.md` (default config), and inform the user rather than failing silently.

## Rollback
Retain at least one previous stable internal release so the company can revert if a new release causes critical problems (see `RELEASE.md` section on the release folder structure). The exact rollback mechanism depends on the packaging technology selected in `RELEASE.md`.

## Versioning
`MAJOR.MINOR.PATCH` (e.g. `1.0.0`). Milestone builds may use a suffix (e.g. `0.1.0-m01`). See `RELEASE.md` for the authoritative versioning rule.
