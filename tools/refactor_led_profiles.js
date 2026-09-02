const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const profilesDir = path.join(root, 'Conspit 300 GT Themes Pack V1.2', 'LEDs Profiles');

const m2Aliases = [
  'BMW M2 Racing (G87)',
  'BMW M2 Racing G87',
  'BMW M2 G87',
  'BMW M2 Racing',
];

const m2RpmProfile = {
  g: 'IRacing',
  m: m2Aliases,
  i: ['bmwm2g87'],
  c: [],
  seg: [
    [1, 6000, 'Green'],
    [1, 6150, 'Green'],
    [1, 6300, 'Yellow'],
    [1, 6450, 'Orange'],
    [2, 6600, 'Red'],
    [1, 6450, 'Orange'],
    [1, 6300, 'Yellow'],
    [1, 6150, 'Green'],
    [1, 6000, 'Green'],
  ],
  sp: 2,
  bd: 125,
  rl: 6600,
  fw: 10,
  fc: 'Red',
};

const m2RedlineProfile = {
  g: 'IRacing',
  rl: { ALL: 6600 },
  m: 'BMW M2 Racing (G87)',
  i: 'bmwm2g87',
};

function isM2(entry) {
  const ids = Array.isArray(entry && entry.i) ? entry.i : [entry && entry.i];
  const models = Array.isArray(entry && entry.m) ? entry.m : [entry && entry.m];
  return ids.some((value) => String(value || '').toLowerCase() === 'bmwm2g87') ||
    models.some((value) => String(value || '').toLowerCase().includes('m2 racing (g87)'));
}

function replaceJsonArray(js, declaration, replacement) {
  const escaped = declaration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const expression = new RegExp(`var ${escaped} = (\\[.*?\\]);\\s*\\r?\\n`, 's');
  const match = js.match(expression);
  if (!match) throw new Error(`Could not find ${declaration}`);
  const values = JSON.parse(match[1]);
  return {
    values,
    js: js.replace(expression, `${replacement}\n`),
  };
}

function appendLegacyM2Redline(js) {
  const startToken = 'const csp300_iRacingRedlines = [';
  const start = js.indexOf(startToken);
  if (start < 0) throw new Error('Could not find csp300_iRacingRedlines');
  const end = js.indexOf('\n];', start);
  if (end < 0) throw new Error('Could not find the end of csp300_iRacingRedlines');
  const body = js.slice(start, end);
  if (/bmwm2g87|BMW M2 Racing \(G87\)/i.test(body)) return js;
  const entry = ",\n\t{\tname: 'BMW M2 Racing (G87)', redline: {'ALL': 6600 } },";
  return js.slice(0, end) + entry + js.slice(end);
}

function refactorEmbeddedJavascript(js) {
  if (js.includes('var CP300_RPM_PROFILES =')) {
    const missingComma = " } } //redline = right side rpm leds\n\t{\tname: 'BMW M2 Racing (G87)'";
    const repairedComma = " } }, //redline = right side rpm leds\n\t{\tname: 'BMW M2 Racing (G87)'";
    return js.includes(missingComma) ? js.replace(missingComma, repairedComma) : js;
  }

  const v8Pattern = /var CP300V8_EXACT_RPM_PROFILES = (\[.*?\]);\s*\r?\n/s;
  const v22Pattern = /var CP300V22_RPM_PROFILES = (\[.*?\]);\s*\r?\n/s;
  const v8Match = js.match(v8Pattern);
  const v22Match = js.match(v22Pattern);
  if (!v8Match || !v22Match) throw new Error('Could not find both historical RPM profile arrays');

  const v8Profiles = JSON.parse(v8Match[1]);
  const v22Profiles = JSON.parse(v22Match[1]);
  if (JSON.stringify(v8Profiles) !== JSON.stringify(v22Profiles)) {
    throw new Error('Historical RPM profile arrays differ; refusing to merge them');
  }

  const rpmProfiles = v22Profiles.filter((entry) => !isM2(entry));
  rpmProfiles.push(m2RpmProfile);
  const rpmJson = JSON.stringify(rpmProfiles);
  const architectureNote = [
    '// Canonical static RPM profile database.',
    '// The .ledsprofile filename V1.2 is the published theme-pack version.',
    '// Historical V8/V22 identifiers below are compatibility aliases only;',
    '// runtime RPM authority is the final global c300v111 pipeline.',
    `var CP300_RPM_PROFILES = ${rpmJson};`,
    'var CP300V8_EXACT_RPM_PROFILES = CP300_RPM_PROFILES;',
  ].join('\n');

  js = js.replace(v8Pattern, `${architectureNote}\n`);
  js = js.replace(v22Pattern, 'var CP300V22_RPM_PROFILES = CP300_RPM_PROFILES;\n');

  const redlineResult = replaceJsonArray(
    js,
    'CP300V22_REDLINE_PROFILES',
    '__REDLINE_REPLACEMENT__',
  );
  const redlineProfiles = redlineResult.values.filter((entry) => !isM2(entry));
  redlineProfiles.push(m2RedlineProfile);
  js = redlineResult.js.replace(
    '__REDLINE_REPLACEMENT__',
    [
      `var CP300_REDLINE_PROFILES = ${JSON.stringify(redlineProfiles)};`,
      'var CP300V22_REDLINE_PROFILES = CP300_REDLINE_PROFILES;',
    ].join('\n'),
  );

  js = appendLegacyM2Redline(js);

  const localBlock = /\n*\/\/ BEGIN LOCAL CAR PROFILE: iRacing BMW M2 Racing \(G87\)[\s\S]*?\/\/ END LOCAL CAR PROFILE: iRacing BMW M2 Racing \(G87\)\s*/;
  if (!localBlock.test(js)) throw new Error('Could not find the local BMW M2 installer block');
  js = js.replace(localBlock, '\n');

  return js;
}

const files = fs.readdirSync(profilesDir)
  .filter((name) => name.endsWith('.ledsprofile'))
  .map((name) => path.join(profilesDir, name));

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const profile = JSON.parse(raw);
  profile.EmbeddedJavascript = refactorEmbeddedJavascript(profile.EmbeddedJavascript);
  fs.writeFileSync(file, `${JSON.stringify(profile, null, 2)}\n`, 'utf8');
  process.stdout.write(`refactored ${path.basename(file)}\n`);
}
