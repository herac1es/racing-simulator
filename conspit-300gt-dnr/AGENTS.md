# DNR-based CONSPIT 300GT integration

- For requests to fetch newer DNR data, extract resources, or update this configuration, first read `docs/update-workflow.md`. Prepare candidates with `tools/inspect-update.cjs`; record the update using `docs/update-record-template.md`. Verify the current official release each time; 7.0.3 is a pinned baseline, not a perpetual claim of latest.

- This directory contains the independent all-game configuration from task `01a0962d-08a7-7390-af58-e108062985c5`. It is separate from `amazing-leds-300gt`, whose default scope remains iRacing only.
- Preserve imported DNR 7.0.3 data and CONSPIT V1.6 source snapshots under `vendor/`; hashes are verified before builds. Apply future adaptations in build/runtime source, documenting changes and regenerating profiles.
- The initial integration preserves the other task's complete behavior, including BMW's symmetric width-12 layout with gaps. This is a reference configuration, not a statement that it matches current iRacing. Do not silently transfer either project's BMW layout to the other.
- Keep full-wheel and RPM-only outputs distinctly named and documented. Stable imported ProfileIds preserve continuity with the other task.
- Keep all builds relative to this directory, with no dependency on Downloads, another Codex workspace, or an installed DNR plugin. Optional native validation accepts a SimHub install directory and runs in an isolated process.
- Run `npm run check` after changes. Native parsing and synthetic checks do not establish hardware/game synchronization.
- Preserve DNR/CONSPIT attribution; repository MIT and Lovely CC BY-NC-SA do not grant a license to these snapshots. Do not include unrelated DLLs, installers, account information, signed download links, or full decompilation archives.
- Do not merge or publish without a user request.
