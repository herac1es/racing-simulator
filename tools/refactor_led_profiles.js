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

function addTwoStageIRacingShiftCue(js) {
  if (js.includes('function c300v111BlinkActive()')) return js;

  const replacements = [
    [
      "var C300V111 = globalThis.C300V111 || {\n    signature:'',\n    redlineWas:false,\n    redlineAt:0\n};",
      "var C300V111 = globalThis.C300V111 || {\n    signature:'',\n    redlineWas:false,\n    redlineAt:0,\n    blinkWas:false,\n    blinkAt:0\n};",
    ],
    [
      '    var start=0,end=0,redline=0;',
      '    var start=0,end=0,shiftPoint=0,redline=0;',
    ],
    [
      [
        "        // Blink is the true flash point. Shift RPM is never allowed to override",
        "        // a valid last-light, blink or hard-limit value.",
        "        redline=ir.blink || ir.max || ir.last || ir.shift || exactRed;",
        "        start=ir.first;",
      ].join('\n'),
      [
        "        // Shift RPM starts the solid full-bar cue. Blink RPM starts the",
        "        // high-frequency pulse; max RPM is only a blink-stage fallback.",
        "        shiftPoint=ir.shift || ir.last || ir.blink || exactRed || ir.max;",
        "        redline=ir.blink || ir.max || ir.last || ir.shift || exactRed;",
        "        start=ir.first;",
      ].join('\n'),
    ],
    [
      "    if (!(redline>2500&&redline<25000)) redline=exactRed>0?exactRed:9000;\n    if (!(end>1000&&end<=redline*1.03)) end=redline*0.992;",
      [
        "    if (!(redline>2500&&redline<25000)) redline=exactRed>0?exactRed:9000;",
        "    if (game!=='IRacing') shiftPoint=redline;",
        "    if (!(shiftPoint>start&&shiftPoint<25000)) shiftPoint=redline;",
        "    if (redline<shiftPoint) redline=shiftPoint;",
        "    if (!(end>1000&&end<=redline*1.03)) end=redline*0.992;",
      ].join('\n'),
    ],
    [
      '    return {game:game,start:start,end:end,redline:redline,scores:scores,thresholds:thresholds};',
      '    return {game:game,start:start,end:end,shift:shiftPoint,blink:redline,redline:redline,scores:scores,thresholds:thresholds};',
    ],
  ];

  for (const [before, after] of replacements) {
    if (!js.includes(before)) throw new Error(`Could not apply two-stage shift cue near: ${before.slice(0, 80)}`);
    js = js.replace(before, after);
  }

  const oldAuthority = [
    'function c300v111RedlineRpm() {',
    '    return c300v111Window(c300v111ExactProfile(),12).redline;',
    '}',
    'function c300v111RedlineActive() {',
    "    try { if (typeof cp300v290CanShowLiveRedline==='function'&&!cp300v290CanShowLiveRedline()) return false; } catch(e0){}",
    "    var rpm=Number(c300v111Prop('Rpms',0))||0;",
    '    var limit=c300v111RedlineRpm();',
    '    var active=rpm>0&&limit>0&&rpm>=limit;',
    '    if (!active && !(limit>0)) {',
    "        var raw=c300v111Prop('RPMRedlineReached',false);",
    "        active=raw===true||raw===1||String(raw).toLowerCase()==='true';",
    '    }',
    '    if (active) {',
    '        if (!C300V111.redlineWas) C300V111.redlineAt=Date.now();',
    '        C300V111.redlineWas=true;',
    '    } else {',
    '        C300V111.redlineWas=false;',
    '        C300V111.redlineAt=0;',
    '    }',
    '    try {',
    "        if (typeof CP300V22_STATE==='object') {",
    '            CP300V22_STATE.redlineWas=active;',
    '            CP300V22_STATE.redlineAt=active?C300V111.redlineAt:0;',
    '        }',
    '    } catch(e1){}',
    '    return active;',
    '}',
  ].join('\n');

  const newAuthority = [
    'function c300v111ShiftRpm() {',
    '    return c300v111Window(c300v111ExactProfile(),12).shift;',
    '}',
    'function c300v111BlinkRpm() {',
    '    return c300v111Window(c300v111ExactProfile(),12).blink;',
    '}',
    '// Compatibility name: the visible redline layer now begins at ShiftRPM.',
    'function c300v111RedlineRpm() {',
    '    return c300v111ShiftRpm();',
    '}',
    'function c300v111BlinkActive() {',
    "    var rpm=Number(c300v111Prop('Rpms',0))||0;",
    '    var limit=c300v111BlinkRpm();',
    '    var active=rpm>0&&limit>0&&rpm>=limit;',
    '    if (active) {',
    '        if (!C300V111.blinkWas) C300V111.blinkAt=Date.now();',
    '        C300V111.blinkWas=true;',
    '    } else {',
    '        C300V111.blinkWas=false;',
    '        C300V111.blinkAt=0;',
    '    }',
    '    return active;',
    '}',
    'function c300v111ShiftCuePulse() {',
    '    if (!c300v111BlinkActive()) return true;',
    '    var elapsed=Math.max(0,Date.now()-Number(C300V111.blinkAt||Date.now()));',
    '    return (Math.floor(elapsed/42)%2)===0;',
    '}',
    'function c300v111RedlineActive() {',
    "    try { if (typeof cp300v290CanShowLiveRedline==='function'&&!cp300v290CanShowLiveRedline()) return false; } catch(e0){}",
    "    var rpm=Number(c300v111Prop('Rpms',0))||0;",
    '    var limit=c300v111ShiftRpm();',
    '    var active=rpm>0&&limit>0&&rpm>=limit;',
    '    if (!active && !(limit>0)) {',
    "        var raw=c300v111Prop('RPMRedlineReached',false);",
    "        active=raw===true||raw===1||String(raw).toLowerCase()==='true';",
    '    }',
    '    if (active) {',
    '        if (!C300V111.redlineWas) C300V111.redlineAt=Date.now();',
    '        C300V111.redlineWas=true;',
    '    } else {',
    '        C300V111.redlineWas=false;',
    '        C300V111.redlineAt=0;',
    '        C300V111.blinkWas=false;',
    '        C300V111.blinkAt=0;',
    '    }',
    '    try {',
    "        if (typeof CP300V22_STATE==='object') {",
    '            CP300V22_STATE.redlineWas=active;',
    '            CP300V22_STATE.redlineAt=active?C300V111.redlineAt:0;',
    '        }',
    '    } catch(e1){}',
    '    return active;',
    '}',
  ].join('\n');

  if (!js.includes(oldAuthority)) throw new Error('Could not find final V1.11 redline authority');
  js = js.replace(oldAuthority, newAuthority);

  const oldBindings = [
    'cp300v22RedlineRpm=function(){return c300v111RedlineRpm();};',
    'cp300v22StartRpm=function(){return c300v111Window(c300v111ExactProfile(),12).start;};',
    'cp300v22RedlineActive=function(){return c300v111RedlineActive();};',
    'cp300v290RedlineRpm=function(){return c300v111RedlineRpm();};',
    'cp300v290RedlineActive=function(){return c300v111RedlineActive();};',
  ].join('\n');
  const newBindings = [
    'cp300v22RedlineRpm=function(){return c300v111RedlineRpm();};',
    'cp300v22StartRpm=function(){return c300v111Window(c300v111ExactProfile(),12).start;};',
    'cp300v22RedlineActive=function(){return c300v111RedlineActive();};',
    'cp300v290RedlineRpm=function(){return c300v111RedlineRpm();};',
    'cp300v290RedlineActive=function(){return c300v111RedlineActive();};',
    'cp300v290RedlinePulse=function(){return c300v111ShiftCuePulse();};',
  ].join('\n');
  if (!js.includes(oldBindings)) throw new Error('Could not find final V1.11 bindings');
  return js.replace(oldBindings, newBindings);
}

function refactorEmbeddedJavascript(js) {
  if (js.includes('var CP300_RPM_PROFILES =')) {
    const missingComma = " } } //redline = right side rpm leds\n\t{\tname: 'BMW M2 Racing (G87)'";
    const repairedComma = " } }, //redline = right side rpm leds\n\t{\tname: 'BMW M2 Racing (G87)'";
    if (js.includes(missingComma)) js = js.replace(missingComma, repairedComma);
    return addTwoStageIRacingShiftCue(js);
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

  return addTwoStageIRacingShiftCue(js);
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
