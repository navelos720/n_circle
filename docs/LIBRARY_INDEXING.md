# LIBRARY_INDEXING.md — Dev-Time Asset Indexing

## Core Rule
The plugin does NOT scan the file system at runtime — this would violate the performance goals in `BUILD_AND_TEST.md`. Instead, a separate dev-time script builds `library.json`, which the runtime plugin then reads.

## Indexing Script Logic (Node.js or Python — Dev-Only, Never Shipped)
1. Read the configured `rootPath`.
2. Recursively scan for `.aep` files (and any other company asset types added later).
3. For each file found: use ExtendScript to briefly open it in the background and extract the main composition name and placeholder layer name(s), OR read a companion metadata `.json` file if the template's author provided one. Generate a thumbnail image.
4. Compile the results into the `library.json` schema defined in `SCHEMA.md`.
5. Write `library.json` to `rootPath`.

## Runtime "Rebuild Index" Button
The Suite Panel / Settings UI includes a "Rebuild Library Index" button (see `UI_LAYOUT.md`). Clicking it triggers the indexing script described above (as a background/dev-tool process invocation, not a from-scratch runtime file-system crawl written into the panel's own JS), then refreshes the panel's displayed library without requiring an After Effects restart.

## Constraints
- This script must never be bundled into the shipped runtime plugin as a startup task.
- It must not block wheel activation while running — it runs on-demand, triggered explicitly by the Rebuild Index button.
- Categorization performed here (e.g. Company / YouTube / Personal, or per-project categories) feeds directly into `AEP_FILES.md` section 6's grouping.
