# Third-party sources

This is a personal, non-official adaptation of CONSPIT's 300GT V1.6 Individual
(ungrouped) profile and resources from Daniel Newman Racing SimHub Plugin 7.0.3.
DNR and CONSPIT retain rights to their original code, data and profiles.
No redistribution license for those materials was recorded in the source task;
this integration does not relicense them under the repository MIT license or
the separate amazing-leds-300gt project's Lovely CC BY-NC-SA license.

Sources:

- [Daniel Newman Racing](https://www.danielnewmanracing.com/): resources extracted
  in the source task from the officially downloaded, signature-verified 7.0.3
  installer. Only the LED engine, C# redline reference and width-12 car trees
  needed to reproduce and compare this configuration are included.
- CONSPIT V1.6 profile supplied by the user as a download from the CONSPIT
  website; original SHA-256 is recorded in `src/provenance.json`.
- `rpm-template.json`: template retained from the source task; its precise
  upstream download URL was not recorded in this integration. It is not
  described as a newly authored or independently licensed template.

Adaptations: embedded helper functions, renamed helper calls, removal of plugin
property dependencies, native car-tree routing, F1 SC/DRS fallbacks and F12026
listing. Repository integration changes paths and stabilizes RPM-only IDs;
it does not recalibrate the imported car data. The full-wheel layout retains
the original button/knob/pit/flag priorities. See `docs/changes.json`.

`src/provenance.json` records imported file hashes and original artifact hashes.
Installers, plugin binaries, unrelated decompiled code and account/download
credentials are not part of this project.
