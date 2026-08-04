# Racing simulator configurations

Personal SimHub profiles and related racing-simulator configuration.

## Conspit 300 GT versioning

`Conspit 300 GT Themes Pack V1.2` and the `V1.2` profile filenames identify the
published theme-pack release. Names such as `cp300v8`, `cp300v22`, and
`c300v111` inside Embedded JavaScript are historical compatibility namespaces,
not separate installed profile versions.

The active RPM architecture uses:

- `CP300_RPM_PROFILES` as the single canonical car RPM-style database;
- `CP300_REDLINE_PROFILES` as the canonical static redline fallback database;
- the final `c300v111` pipeline for live RPM-window and redline calculation;
- legacy versioned identifiers only as aliases or helpers required by existing
  SimHub formulas.

BMW M2 Racing (G87) is a normal entry in both canonical static databases. It
does not install a separate per-frame runtime algorithm.
