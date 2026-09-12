const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { compile } = require('../tools/build.cjs');
const { parse, walk } = require('../tools/javascript.cjs');
const root = path.resolve(__dirname, '..');
const themes = fs.readdirSync(path.join(root, 'src/themes')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(root, 'src/themes', f))));
const upstream = path.resolve(root, '../Conspit 300 GT Themes Pack V1.2/LEDs Profiles');
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'src/upstream.json')));

const { runtime } = require('./helpers.cjs');

function allFormulas(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  for (const [key, item] of Object.entries(value)) {
    if (key.endsWith('Formula') && item?.Interpreter === 1) found.push(item);
    else if (item && typeof item === 'object') allFormulas(item, found);
  }
  return found;
}

test('five distinct importable iRacing profiles with valid formulas and one new RPM layer', () => {
  assert.equal(themes.length, 5);
  const ids = new Set();
  for (const theme of themes) {
    const profile = compile(theme);
    assert.equal(profile.GameCode, 'IRacing');
    assert.equal(profile.TestLedsGameData.GameName, 'IRacing');
    assert.ok(!ids.has(profile.ProfileId)); ids.add(profile.ProfileId);
    for (const formula of allFormulas(profile)) new vm.Script('(function(){\n' + (formula.PreExpression || '') + '\n' + (formula.Expression || '') + '\n})');
    assert.doesNotMatch(profile.EmbeddedJavascript, /CP300_RPM_PROFILES|CP300_REDLINE_PROFILES|function c300v111Window/);
    assert.doesNotMatch(JSON.stringify(profile.LedContainers), /Rpms Function|RPM Synchronisation/i);
    assert.equal(allFormulas(profile).filter((f) => f.Expression === 'return amazingRpmFrame();').length, 1);
    assert.equal(fs.readFileSync(path.join(root, 'profiles', `amazing-leds-300gt-${theme.slug}.ledsprofile`), 'utf8'), JSON.stringify(profile, null, 2) + '\n');
    const r = runtime(profile.EmbeddedJavascript);
    for (const formula of allFormulas(profile)) {
      r.call('(function(){\n' + (formula.PreExpression || '') + '\n' + (formula.Expression || '') + '\n})()');
    }
  }
});

test('only iRacing and the empty desktop are allowed; unsupported games clear all 56 LEDs', () => {
  const r = runtime(compile(themes[0]).EmbeddedJavascript);
  assert.equal(r.call('amazingGameAllowed()'), true);
  for (const name of ['AssettoCorsaCompetizione', 'LMU', 'Automobilista2', 'F12025']) {
    r.properties['DataCorePlugin.CurrentGame'] = name;
    assert.equal(r.call('amazingGameAllowed()'), false);
    assert.deepEqual(r.call('amazingUnsupportedGame()'), Array(56).fill('#FF000000'));
  }
  r.properties['DataCorePlugin.CurrentGame'] = '';
  r.properties.GameName = '';
  assert.equal(r.call('amazingGameAllowed()'), false, 'unknown running game must not render');
  r.properties.GameRunning = r.properties['DataCorePlugin.GameRunning'] = false;
  assert.equal(r.call('amazingGameAllowed()'), true);
});

test('RPM sweep and redline flags cannot change the inherited non-RPM lights', () => {
  for (const theme of themes) {
    const source = compile(theme).EmbeddedJavascript;
    const render = (rpm) => {
      const r = runtime(source, { Rpms: rpm, RPMPercent: rpm / 100, RPMRedlineReached: true, MaxRpm: 6600 });
      r.call('cp300v1WheelOverlay(); cp300v3TopOverlay(); c300v110inputs()');
      r.tick(5000);
      return [r.call('cp300v1WheelOverlay()'), r.call('cp300v3TopOverlay()'), r.call('c300v110inputs()')];
    };
    const baseline = render(3000);
    for (const rpm of [6000, 6600, 7500, 10000, 15000]) assert.deepEqual(render(rpm), baseline, `${theme.slug}: ${rpm} RPM`);
  }
});

test('non-RPM wheel, pit, flags, spotter and input animations match the existing themes', () => {
  const scenarios = [
    ['driving', {}],
    ['yellow', { YellowFlag: true }],
    ['blue', { BlueFlag: true }],
    ['pit limiter', { PitLimiterOn: true, IsInPitLane: true, SpeedKmh: 55 }],
    ['left spotter', { SpotterCarLeft: true }],
    ['both spotters', { SpotterCarLeft: true, SpotterCarRight: true }],
    ['ABS', { ABSActive: true, ABSLevel: 5, CarClass: 'GT3', CarModel: 'BMW M4 GT3', CarId: 'bmwm4gt3' }],
    ['TC', { TCActive: true, TCLevel: 4 }],
    ['brake', { Brake: 70, 'GameRawData.Telemetry.BrakeRaw': 0.7 }],
    ['ignition off', { Rpms: 0, SpeedKmh: 0, EngineStarted: false, EngineIgnitionOn: false }],
    ['ignition on', { Rpms: 0, SpeedKmh: 0, EngineStarted: false, EngineIgnitionOn: true }],
    ['desktop', { Rpms: 0, SpeedKmh: 0, EngineStarted: false, EngineIgnitionOn: false, GameRunning: false, 'DataCorePlugin.GameRunning': false }],
  ];
  const functions = ['cp300v1WheelOverlay()', 'c300v110inputs()'];
  for (const theme of themes) {
    const oldFile = provenance.files.find((f) => f.theme === theme.slug).file;
    const oldSource = JSON.parse(fs.readFileSync(path.join(upstream, oldFile))).EmbeddedJavascript;
    for (const [name, props] of scenarios) {
      const old = runtime(oldSource, props), migrated = runtime(compile(theme).EmbeddedJavascript, props);
      for (let frame = 0; frame < 4; frame++) {
        for (const fn of functions) assert.deepEqual(migrated.call(fn), old.call(fn), `${theme.slug}/${name}/${fn}/frame ${frame}`);
        old.tick(250); migrated.tick(250);
      }
      for (const id of [0, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19]) {
        old.buttons.add(id); migrated.buttons.add(id);
        for (const ms of [0, 120, 500]) {
          old.tick(ms); migrated.tick(ms);
          assert.deepEqual(migrated.call('c300v110inputs()'), old.call('c300v110inputs()'), `${theme.slug}/${name}/input ${id}`);
        }
        old.buttons.delete(id); migrated.buttons.delete(id);
      }
    }
  }
});

test('raw property references are specialized to iRacing rather than other games', () => {
  const runtimeSource = fs.readFileSync(path.join(root, 'src/runtime/inherited.js'), 'utf8');
  const forbidden = /(?:^|\.)GameRawData\.(?:Graphics\.|Physics\.|physicsGuessing\.|PlayerNativeTelemetry\.|CurrentPlayerTelemetry\.|PacketSessionData\.|Scoring\.|mHighestFlagColour)/;
  for (const source of [runtimeSource, ...allFormulas(compile(themes[0])).flatMap((f) => [f.Expression || '', f.PreExpression || ''])]) {
    walk(parse(source), (node) => { if (node.type === 'Literal' && typeof node.value === 'string') assert.doesNotMatch(node.value, forbidden); });
  }
});
