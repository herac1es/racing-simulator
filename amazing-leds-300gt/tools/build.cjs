const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const { loadRpm } = require('./rpm.cjs');
const { rpmUi } = require('./rpm-ui.cjs');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const jsFormula = (expression) => ({ JSExt: 4, Interpreter: 1, Expression: expression });
// Stable UUID v5 per theme and editor generation. Keep old imported profiles
// distinct so users can retain their existing UI edits when importing this one.
function rpmUiProfileId(namespace) {
  const bytes = createHash('sha1').update(Buffer.from(namespace.replaceAll('-', ''), 'hex'))
    .update('rpm-ui-v2').digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
const allowedGroup = (Description, LedContainers) => ({
  ContainerType: 'Groups.CustomConditionalGroup', Description,
  TriggerFormula: jsFormula('return amazingGameAllowed();'), LedContainers,
});

function compile(theme) {
  const profile = JSON.parse(read('src/profile.json'));
  for (const override of theme.layoutOverrides) {
    let parent = profile;
    for (const key of override.path.slice(0, -1)) {
      if (!Object.hasOwn(parent, key)) throw new Error(`Invalid theme path: ${override.path.join('/')}`);
      parent = parent[key];
    }
    parent[override.path.at(-1)] = override.value;
  }
  profile.Name = `amazing-leds-300gt - ${theme.name} - iRacing - RPM UI v2`;
  profile.Description = 'RPM UI v2: expand the top-level iRacing RPM group, then Live session > Spectating > Brightness > car > gear to edit native RPM segments and redline animations.';
  profile.ProfileId = rpmUiProfileId(theme.profileId);
  const rpm = loadRpm();
  const lovely = rpm.cars.find((car) => car.source.kind === 'lovely-car-data');
  const notice = 'RPM data: Lovely Car Data by Lovely Sim Racing, ATSR and Gomez Sim Industries; CC-BY-NC-SA-4.0; https://github.com/Lovely-Sim-Racing/lovely-car-data; https://creativecommons.org/licenses/by-nc-sa/4.0/. Adaptations: 300 GT lamp mapping. Revision: ' + (lovely ? lovely.source.revision : 'not embedded') +
    '. BMW uses Lovely per-gear timing reordered left-to-right with the last two activation lamps duplicated; current EVO layout and timing unverified. The pre-EVO 2024 iRacing manual table is not active.';
  profile.EmbeddedJavascript = 'var AMAZING_THEME = ' + JSON.stringify({ runtime: theme.runtime }) + ';\n\n' +
    '// ' + notice + '\nvar AMAZING_RPM = ' + JSON.stringify(rpm) + ';\n\n' +
    read('src/runtime/inherited.js') + '\n' + read('src/runtime/entrypoints.js') + '\n' + read('src/runtime/rpm.js');
  new vm.Script(profile.EmbeddedJavascript, { filename: theme.slug + '.js' });
  // Separate idle and alert layers so RPM is visible at the editor root while
  // retaining the exact original ordering: idle < RPM < alerts/startup.
  // Clone all native live/spectating/brightness wrappers without changing their
  // settings or formulas; theme path overrides must have been applied first.
  const [top, ...wheel] = profile.LedContainers;
  const [idle, live] = top.LedContainers;
  const telemetry = live?.LedContainers?.[0];
  const brightness = telemetry?.LedContainers?.[0];
  if (top.ContainerType !== 'Base.Group' || top.LedContainers.length !== 2 ||
      live.ContainerType !== 'Groups.GameRunningGroup' || live.LedContainers.length !== 1 ||
      telemetry.ContainerType !== 'Groups.CustomConditionalGroup' || telemetry.LedContainers.length !== 1 ||
      brightness.ContainerType !== 'Groups.BrightnessFormulaGroup' ||
      brightness.LedContainers.map((child) => child.Description).join('|') !== 'Ignition On|Engine Start') {
    throw new Error('Unexpected top LED layout; review RPM editor split before building');
  }
  const ui = rpmUi(rpm);
  ui.TriggerFormula = jsFormula('return amazingGameAllowed() && amazingRpmActive();');
  ui.LedContainers = [{ ...structuredClone(top), Description: 'Live session', LedContainers: [
    { ...structuredClone(live), Description: 'Live session - expand for RPM', LedContainers: [
      { ...structuredClone(telemetry), Description: 'Spectating - retain original condition', LedContainers: [
        { ...structuredClone(brightness), Description: 'Brightness - expand for car and gear', LedContainers: ui.LedContainers },
      ] },
    ] },
  ] }];
  // The source top group currently has no settings beyond its description.
  // Retain it only if future layouts add settings such as a position offset.
  if (Object.keys(top).every((key) => ['ContainerType', 'Description', 'LedContainers'].includes(key))) {
    ui.LedContainers = ui.LedContainers[0].LedContainers;
  }
  profile.LedContainers = [
    allowedGroup('amazing-leds-300gt - Idle and base lighting', [{ ...top, LedContainers: [idle] }]),
    ui,
    allowedGroup('amazing-leds-300gt - Alerts, startup and wheel lighting', [{ ...top, LedContainers: [live] }, ...wheel]),
    {
      ContainerType: 'ScriptedContent',
      Description: 'amazing-leds-300gt - Clear unsupported games',
      LedCount: 56,
      ContentFormula: jsFormula('return amazingUnsupportedGame();'),
    },
  ];
  return profile;
}
function build() {
  const dir = path.join(root, 'profiles');
  fs.mkdirSync(dir, { recursive: true });
  for (const file of fs.readdirSync(path.join(root, 'src/themes')).filter((f) => f.endsWith('.json')).sort()) {
    const theme = JSON.parse(read('src/themes/' + file));
    const profile = compile(theme);
    const name = `amazing-leds-300gt-${theme.slug}.ledsprofile`;
    fs.writeFileSync(path.join(dir, name), JSON.stringify(profile, null, 2) + '\n');
    console.log(name);
  }
}
if (require.main === module) build();
module.exports = { compile, build };
