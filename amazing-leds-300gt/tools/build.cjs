const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { loadRpm } = require('./rpm.cjs');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const jsFormula = (expression) => ({ JSExt: 4, Interpreter: 1, Expression: expression });

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
  profile.Name = `amazing-leds-300gt - ${theme.name} - iRacing`;
  profile.ProfileId = theme.profileId;
  const rpm = loadRpm();
  const notice = 'RPM data: Lovely Car Data by Lovely Sim Racing, ATSR and Gomez Sim Industries; CC-BY-NC-SA-4.0; https://github.com/Lovely-Sim-Racing/lovely-car-data; https://creativecommons.org/licenses/by-nc-sa/4.0/. Adaptations: 300 GT lamp mapping. Revision: ' + rpm.cars[0].source.revision;
  profile.EmbeddedJavascript = 'var AMAZING_THEME = ' + JSON.stringify({ runtime: theme.runtime }) + ';\n\n' +
    '// ' + notice + '\nvar AMAZING_RPM = ' + JSON.stringify(rpm) + ';\n\n' +
    read('src/runtime/inherited.js') + '\n' + read('src/runtime/entrypoints.js') + '\n' + read('src/runtime/rpm.js');
  new vm.Script(profile.EmbeddedJavascript, { filename: theme.slug + '.js' });
  // Insert after theme path overrides, below non-RPM alerts and Engine Start,
  // inside the existing live/spectating/brightness gates. Never touch LED 13+.
  let inserted = 0;
  function insertRpm(node) {
    if (node.Description === 'Device specific brightness and NightMode' &&
        node.LedContainers?.some((child) => child.Description === 'Ignition On')) {
      node.LedContainers.unshift({
        ContainerType: 'ScriptedContent', Description: 'amazing-leds-300gt - iRacing RPM',
        LedCount: 12, ContentFormula: jsFormula('return amazingRpmFrame();'),
      });
      inserted++;
    } else for (const child of node.LedContainers || []) insertRpm(child);
  }
  insertRpm(profile.LedContainers[0]);
  if (inserted !== 1) throw new Error('Expected exactly one top RPM insertion point');
  profile.LedContainers = [
    {
      ContainerType: 'Groups.CustomConditionalGroup',
      Description: 'amazing-leds-300gt - iRacing and desktop lighting',
      TriggerFormula: jsFormula('return amazingGameAllowed();'),
      LedContainers: profile.LedContainers,
    },
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
