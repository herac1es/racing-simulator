# Racing simulator configurations

Personal SimHub profiles and related racing-simulator configuration.

## amazing-leds-300gt

[amazing-leds-300gt](amazing-leds-300gt/README.md) is the custom Conspit 300 GT
project for iRacing. It preserves the five existing themes' non-RPM effects and
adds a separate RPM framework for Porsche 911 GT3 R (992), BMW M4 GT3 EVO, and
generic cars, with editable sources and generated SimHub LED profiles. Car data
and derived profiles have separate licensing; see the project's README.

## Conspit 300 GT versioning

`Conspit 300 GT Themes Pack V1.2` and the `V1.2` profile filenames identify the
published theme-pack release. Names such as `cp300v8`, `cp300v22`, and
`c300v111` inside Embedded JavaScript are historical compatibility namespaces,
not separate installed profile versions.

The original theme pack's RPM architecture uses:

- `CP300_RPM_PROFILES` as the single canonical car RPM-style database;
- `CP300_REDLINE_PROFILES` as the canonical static redline fallback database;
- the final `c300v111` pipeline for live RPM-window and redline calculation;
- legacy versioned identifiers only as aliases or helpers required by existing
  SimHub formulas.

BMW M2 Racing (G87) is a normal entry in both canonical static databases. It
does not install a separate per-frame runtime algorithm.
