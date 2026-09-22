# SCHEMA.md — Concrete JSON Data Contracts

These are the two runtime data files described in `DATA_MODEL.md`. Generate matching TypeScript (or equivalent strongly-typed) interfaces for both before writing code that reads or writes them (`CODING_RULES.md`).

## 1. `library.json` — Company/User Asset Index

```json
{
  "libraryVersion": "1.0",
  "rootPath": "C:/ProgramData/YourCompany/AETemplates/",
  "categories": [
    {
      "id": "lower_thirds",
      "name": "Lower Thirds",
      "templates": [
        {
          "id": "lt_001",
          "name": "Corporate Clean",
          "thumbnail": "thumbnails/lt_001.jpg",
          "aepFilePath": "lower_thirds/corporate_clean.aep",
          "targetCompName": "Main_Render_Comp",
          "placeholderLayerName": "LOGO_PLACEHOLDER",
          "tags": ["clean", "corporate"]
        }
      ]
    }
  ]
}
```

Notes:
- `targetCompName` and `placeholderLayerName` are only required if `AEP_INJECTION.md` is in scope. For a simple `AEP_FILES.md`-only entry, the minimum required fields are `id`, `name`, `aepFilePath`, and a category grouping — omit the injection-specific fields entirely rather than leaving them null, unless the injection feature is confirmed.
- `rootPath` here mirrors the app-level `rootPath` setting described in `DATA_MODEL.md` — do not treat this as a second, independent source of truth for the root path; keep them in sync.

## 2. `wheel_config.json` — User Wheel/Profile Configuration

```json
{
  "activeProfile": "Default",
  "profiles": [
    {
      "name": "Default",
      "slots": [
        {
          "position": 0,
          "type": "ae_command",
          "commandId": 1056,
          "label": "Easy Ease",
          "icon": "easy_ease"
        },
        {
          "position": 1,
          "type": "folder",
          "label": "Company Templates",
          "icon": "folder",
          "children": [
            {
              "position": 0,
              "type": "aep_template",
              "templateId": "lt_001",
              "label": "Corp Lower Third",
              "icon": "template"
            }
          ]
        }
      ]
    }
  ]
}
```

Notes:
- `position` runs 0 through (slot-count − 1), starting at the top (12 o'clock) and moving clockwise — see `WHEEL.md` section 2.
- `type` must be one of: `ae_command`, `menu_item`, `effect`, `aep_file`, `aep_template`, `folder` — these exactly match `WHEEL.md`'s execution matrix and `COMMAND_REGISTRY.md`'s categories. Do not introduce a new `type` value without a matching decision record.
- `folder`-type slots carry a `children` array using the same slot shape recursively (with its own `position` values scoped to that submenu).
- `profiles` is an array to directly support `WHEEL_SETTINGS.md` section 7's multi-profile feature, whether or not it ships in V1 — always write the schema as an array, even if only one profile exists initially.

## 3. Minimal AEP Reference Shape (Used by `AEP_FILES.md` When Injection Is Not in Scope)
```text
AEP Item
├── id
├── displayName
├── path
├── category
└── optional metadata
```
This is a subset of the `library.json` template entry shape above — use the same `id`/`name`/`aepFilePath`/category fields rather than inventing a parallel structure.
