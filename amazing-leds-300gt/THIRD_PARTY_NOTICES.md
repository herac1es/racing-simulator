# Third-party notices

## Lovely Car Data

The two JSON files under `vendor/lovely-car-data/` are unmodified snapshots of
[Lovely Car Data](https://github.com/Lovely-Sim-Racing/lovely-car-data), a joint
project by Lovely Sim Racing, ATSR and Gomez Sim Industries.
The upstream notice attributes copyright © 2025 to Lovely Sim Racing.

Revision: `7cd16dd51d403f9f688e3e02f064e690e6b1a22c`.
Exact upstream paths, download URLs and SHA-256 hashes are recorded in
[upstream.json](vendor/lovely-car-data/upstream.json).
The original [README](vendor/lovely-car-data/README.upstream.md) preserves the
format description and licensing notice.

License: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/).
A local copy of the [license text](vendor/lovely-car-data/LICENSE.txt) is included,
retrieved from the SPDX license-list-data project's `CC-BY-NC-SA-4.0` text.

Adaptations in this project: the Porsche 16-lamp layout is reduced to a selected
12-lamp layout. BMW's ten nontransparent source lamps are reordered by activation
to a provisional left-to-right layout, then its final two lamps are each
duplicated to fill 12 LEDs. The renderer packs both per-gear source tables into
SimHub profiles. The original Lovely source
thresholds and colors are unchanged. These data adaptations and the generated
profiles containing them are provided under CC BY-NC-SA 4.0. When sharing them,
retain the attribution, identify changes, and follow the noncommercial and
share-alike terms. Each generated profile embeds attribution, source links,
the revision and the license URL.

The existing repository content and original renderer/build code retain the
repository's [MIT license](../LICENSE); that license does not replace the
license of the imported car data. This project is not endorsed by the data
contributors or iRacing.

## iRacing vehicle manuals

An inactive historical reference transcribes the named colors and RPM table from page 8 of
the [BMW M4 GT3 Manual V3](https://s100.iracing.com/wp-content/uploads/2024/07/BMW-M4-GT3-Manual_V3.pdf).
The July 2024 manual predates EVO. Its single table was rejected as the active
EVO baseline after user feedback and is not embedded as the BMW runtime table.
Exact RGB and redline flashing frequency are not specified by that source.
The [Porsche 992 GT3 R Manual V2](https://s100.iracing.com/wp-content/uploads/2024/09/Porsche-911-GT3-R-992_V2.pdf),
page 11, is used to verify its outside-in direction and blue flashing shift cue.
The manuals and their images remain iRacing's content and are not redistributed
or relicensed by this project. See [evidence and limitations](docs/iracing-rpm-evidence.md).
Generated profiles include Lovely BMW and Porsche data and retain the
existing CC BY-NC-SA 4.0 attribution and distribution notice.
