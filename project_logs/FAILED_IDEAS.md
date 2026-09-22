# FAILED_IDEAS.md — Rejected Approaches (Do Not Re-Attempt Without a New Decision Record)

Log versioning rule: freeze and roll to `FAILED_IDEAS_2.md` past 900 lines.

---

1. **Runtime AI/OCR features.** Evaluated and rejected — the product is strictly offline and rule-based; no runtime AI/ML/OCR of any kind.
2. **Telemetry / opt-in analytics.** Rejected — this is an in-house tool; no usage data leaves the local machine.
3. **OS-level keystroke simulation for executing AE shortcuts.** Rejected — platform scripting restrictions and reliability concerns make `app.executeCommand()` the only viable execution path. See `DECISIONS.md` ADR-001.
4. **Interactive onboarding tour / guided first-run walkthrough.** Rejected — the UI should be intuitive enough on its own; internal users are trained via documentation, not in-app tours.
5. **Cloud sync for wheel configurations.** Rejected — 100% local JSON + local file system reliance. See `DECISIONS.md` ADR-002.
6. **Building the panel/overlay on Adobe UXP.** Rejected for now — Adobe has not shipped UXP panel support for After Effects as of the last verification. See `DECISIONS.md` ADR-004. Revisit only if this platform fact changes, and only via a new decision record.
