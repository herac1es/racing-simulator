const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { compile } = require('../tools/build.cjs');
const { loadRpm } = require('../tools/rpm.cjs');
const { runtime } = require('./helpers.cjs');
const theme = require('../src/themes/conspit-signature.json');
const profile = compile(theme);
const make = (props) => runtime(profile.EmbeddedJavascript, props);
const black = '#FF000000', green = '#FF00FF00', red = '#FFFF0000';
const diagnostic = (r) => r.call('amazingRpmDiagnostics()');
const frame = (r) => r.call('amazingRpmFrame()');
function windowProps(prefix, first, last, blink) {
  return { [prefix + 'FirstRPM']: first, [prefix + 'LastRPM']: last, [prefix + 'BlinkRPM']: blink };
}
const live = 'GameRawData.Telemetry.PlayerCarSL';
const session = 'GameRawData.SessionData.DriverInfo.DriverCarSL';

test('exact car identification separates the Porsche R from both Cups and legacy GT3 R', () => {
  for (const [id, expected] of [['porsche992rgt3', 'porsche-911-gt3-r-992'], ['bmwm4gt3', 'bmw-m4-gt3-evo'],
    ['porsche992cup', null], ['porsche9922cup', null], ['porsche911rgt3', null], ['bmwm4evogt4', null], ['unknown', null]]) {
    const r = make({ CarId: id, CarModel: 'Porsche 911 GT3 R (992)' });
    assert.equal(diagnostic(r).matchedCar, expected, id);
  }
  assert.equal(diagnostic(make({ CarId: null, CarModel: 'Porsche 911 GT3 R (992)' })).matchedCar, 'porsche-911-gt3-r-992');
  assert.equal(diagnostic(make({ CarId: null, CarModel: 'Porsche 911 GT3' })).matchedCar, null);
  assert.equal(diagnostic(make({ 'DataCorePlugin.CarId': 'bmwm4gt3', CarId: 'porsche992rgt3' })).matchedCar, 'bmw-m4-gt3-evo');
});

test('Porsche uses gear-specific absolute thresholds and outside-in 16-to-12 mapping', () => {
  const r = make({ CarId: 'porsche992rgt3', Gear: '1', Rpms: 1763, MaxRpm: 7000,
    ...windowProps(live, 6000, 6500, 6800) });
  assert.deepEqual(frame(r), Array(12).fill(black));
  r.properties.Rpms = 1764;
  assert.deepEqual(frame(r), [green, ...Array(10).fill(black), green]);
  r.properties.Rpms = 4750;
  assert.deepEqual(frame(r), [green, green, '#FFFFFF00', ...Array(6).fill(black), '#FFFFFF00', green, green]);
  assert.deepEqual(diagnostic(r).thresholds, [1764, 2834, 4750, 6544, 7340, 8110, 8110, 7340, 6544, 4750, 2834, 1764]);
  r.properties.Gear = '2';
  assert.equal(diagnostic(r).thresholds[0], 4410);
  r.properties.Gear = '6';
  assert.equal(diagnostic(r).redline, 9200, 'must not clamp/rescale to MaxRpm or live windows');
  for (const [gear, key] of [[-1, 'R'], [0, 'N']]) {
    r.properties.Gear = gear;
    assert.equal(diagnostic(r).gear, key);
    assert.equal(diagnostic(r).thresholds[0], 7000);
  }
});

test('BMW restores Lovely per-gear stages in the documented provisional left-to-right layout', () => {
  const car = loadRpm().cars.find((entry) => entry.id === 'bmw-m4-gt3-evo');
  assert.deepEqual(car.mapping, [1, 12, 2, 11, 4, 9, 5, 8, 6, 6, 7, 7]);
  const colors = [...Array(4).fill(green), ...Array(4).fill('#FFFFFF00'), ...Array(4).fill(red)];
  const expected = {
    R: [5600, 5800, 6000, 6200, 6400, 6600], N: [5600, 5800, 6000, 6200, 6400, 6600],
    1: [4800, 5370, 5920, 6490, 7050, 7150], 2: [5400, 5850, 6250, 6650, 7050, 7150],
    3: [5520, 5840, 6160, 6480, 6800, 6900], 4: [5715, 5985, 6255, 6528, 6800, 6900],
    5: [5665, 5905, 6145, 6385, 6625, 6725], 6: [6000, 6250, 6500, 6750, 7000, 7250],
  };
  for (const [gear, row] of Object.entries(car.data.ledRpm[0])) {
    const r = make({ CarId: 'bmwm4gt3', Gear: gear });
    assert.deepEqual(diagnostic(r).colors, colors);
    assert.deepEqual([...new Set(diagnostic(r).thresholds)].sort((a, b) => a - b),
      [...new Set(row.slice(1).filter((rpm) => rpm > 0))].sort((a, b) => a - b));
    const stages = expected[gear].slice(0, 5);
    assert.equal(row[0], expected[gear][5]);
    assert.deepEqual([...new Set(diagnostic(r).thresholds)], stages, 'keep gear-specific community values, never the legacy manual single table');
    for (let stage = 0; stage < stages.length; stage++) {
      r.properties.Rpms = stages[stage] - 0.01;
      assert.equal(frame(r).filter((c) => c !== black).length, [0, 2, 4, 6, 8][stage]);
      r.properties.Rpms = stages[stage];
      const count = [2, 4, 6, 8, 12][stage];
      assert.deepEqual(frame(r), colors.map((c, i) => i < count ? c : black));
    }
    r.properties.Rpms = row[0] - 0.01;
    assert.deepEqual(frame(r), colors, gear + ': progressive colors remain visible before all-red');
    r.properties.Rpms = row[0];
    assert.deepEqual(frame(r), Array(12).fill(red));
    r.tick(251); assert.deepEqual(frame(r), Array(12).fill(red));
  }
});

test('BMW diagnostics disclose community provenance and reject the obsolete single-table baseline', () => {
  const r = make({ CarId: 'bmwm4gt3', Gear: '3', Rpms: 4800 });
  assert.deepEqual(frame(r), Array(12).fill(black));
  r.properties.Rpms = 5520;
  assert.deepEqual(frame(r), [green, green, ...Array(10).fill(black)]);
  r.properties.Rpms = 6900;
  const expected = Array(12).fill(red);
  assert.deepEqual(frame(r), expected);
  r.tick(251); assert.deepEqual(frame(r), expected);
  assert.equal(diagnostic(r).calibrationStatus, 'community-timing-left-to-right-evo-unverified');
  assert.equal(diagnostic(r).sourceKind, 'lovely-car-data');
  assert.equal(diagnostic(r).revision, '7cd16dd51d403f9f688e3e02f064e690e6b1a22c');
  assert.match(diagnostic(r).notes, /not a measured EVO/);
});

test('every retained per-car LED changes exactly at its own threshold in all configured gears', () => {
  for (const car of loadRpm().cars) {
    const raw = car.data;
    const r = make({ CarId: car.carIds[0] });
    for (const [gear, row] of Object.entries(raw.ledRpm[0])) {
      r.properties.Gear = gear;
      for (let i = 0; i < 12; i++) {
        const source = car.mapping[i], threshold = row[source];
        if (threshold === 0) continue;
        r.properties.Rpms = threshold - 0.01;
        assert.equal(frame(r)[i], black, `${car.id}/${gear}/${i} before threshold`);
        r.properties.Rpms = threshold;
        assert.equal(frame(r)[i], raw.ledColor[source], `${car.id}/${gear}/${i} at threshold`);
      }
    }
  }
});

test('flashing starts on, uses the configured phase interval, and resets after gear/car/RPM changes', () => {
  const r = make({ CarId: 'porsche992rgt3', Gear: '1', Rpms: 9000 });
  const blue = Array(12).fill('#FF6495ED');
  assert.deepEqual(frame(r), blue);
  r.tick(249); assert.deepEqual(frame(r), blue);
  r.tick(1); assert.deepEqual(frame(r), Array(12).fill(black));
  diagnostic(r); assert.deepEqual(frame(r), Array(12).fill(black), 'diagnostics cannot change flash state');
  r.properties.Gear = '2'; assert.deepEqual(frame(r), blue);
  r.tick(250); assert.deepEqual(frame(r), Array(12).fill(black));
  r.properties.Rpms = 7000; frame(r);
  r.properties.Rpms = 9000; assert.deepEqual(frame(r), blue);
  r.properties.CarId = 'bmwm4gt3'; frame(r);
  r.properties.CarId = 'porsche992rgt3'; assert.deepEqual(frame(r), blue);
});

test('generic LEDs use coherent live anchors per frame, then session data, then a marked estimate', () => {
  const r = make({ ...windowProps(live, 5000, 6100, 6400), ...windowProps(session, 7000, 8100, 8500), Rpms: 5000 });
  assert.equal(diagnostic(r).source, 'live-telemetry');
  assert.deepEqual(frame(r), [green, ...Array(11).fill(black)]);
  assert.deepEqual(diagnostic(r).thresholds, Array.from({ length: 12 }, (_, i) => 5000 + i * 100));
  Object.assign(r.properties, windowProps(live, 6000, 7100, 7400));
  assert.deepEqual(frame(r), Array(12).fill(black), 'window must update immediately');
  r.properties[live + 'FirstRPM'] = null;
  assert.equal(diagnostic(r).source, 'session-data');
  assert.equal(diagnostic(r).thresholds[0], 7000, 'do not mix live LastRPM with session FirstRPM');
  r.properties[session + 'FirstRPM'] = '';
  r.properties.MaxRpm = 8000;
  assert.equal(diagnostic(r).source, 'simhub-estimate:MaxRpm');
  assert.equal(diagnostic(r).thresholds[0], 6400);
  assert.equal(diagnostic(r).redline, null, 'engine maximum does not invent a blinking threshold');
  r.properties.MaxRpm = 0;
  assert.equal(diagnostic(r).source, 'unavailable');
  assert.deepEqual(frame(r), Array(12).fill(black));
});

test('missing gears fall back to generic without reusing another gear; forced generic works', () => {
  const r = make({ CarId: 'porsche992rgt3', ...windowProps(live, 5000, 6100, 6400) });
  for (const gear of [null, '', 'invalid', '7']) {
    r.properties.Gear = gear;
    assert.equal(diagnostic(r).source, 'live-telemetry');
  }
  r.properties.Gear = '1';
  assert.equal(diagnostic(r).source, 'car-data');
  r.call("AMAZING_RPM.mode = 'generic'");
  assert.equal(diagnostic(r).source, 'live-telemetry');
});

test('invalid RPM never lights the strip; invalid raw anchors and blink values are not coerced to valid data', () => {
  const r = make({ CarId: 'porsche992rgt3', Rpms: 9000 });
  for (const bad of [null, undefined, '', ' ', false, true, NaN, Infinity, -1, 'oops']) {
    r.properties.Rpms = bad;
    assert.deepEqual(frame(r), Array(12).fill(black));
  }
  const g = make({ ...windowProps(live, 5000, 6100, 0), Rpms: 9000 });
  assert.equal(diagnostic(g).redline, null);
  assert.deepEqual(frame(g), loadRpm().generic.colors);
  for (const bad of [true, '', -1, 6200, Infinity, 'oops']) {
    g.properties[live + 'FirstRPM'] = bad;
    assert.equal(diagnostic(g).source, 'unavailable');
  }
});

test('RPM yields to desktop, other games, non-RPM modes, pit, pause, garage and engine-off states', () => {
  const scenarios = [
    { 'DataCorePlugin.GameRunning': false }, { 'DataCorePlugin.CurrentGame': 'LMU' },
    { EngineIgnitionOn: false }, { EngineStarted: false }, { PitLimiterOn: true }, { IsInPitLane: true },
    { 'GameRawData.Telemetry.IsOnTrack': false }, { GamePaused: true },
    { Spectating: true, 'ConspitLEDs.SpectateShowTelemetry': 0 },
    ...[3, 4, 5].map((mode) => ({ 'ConspitLEDs.TelemetryFunction': mode })),
  ];
  for (const props of scenarios) {
    const r = make({ CarId: 'porsche992rgt3', Rpms: 9000, ...props });
    assert.deepEqual(frame(r), Array(12).fill(null), JSON.stringify(props));
  }
  const r = make({ CarId: 'porsche992rgt3', Rpms: 9000 });
  r.call("AMAZING_RPM.mode = 'off'");
  assert.deepEqual(frame(r), Array(12).fill(null));
  for (const mode of [null, 1, 2]) assert.notDeepEqual(frame(make({ CarId: 'porsche992rgt3', Rpms: 9000, 'ConspitLEDs.TelemetryFunction': mode })), Array(12).fill(null));
});

test('top-level RPM stays between idle and alerts with unchanged inherited containers and native gates', () => {
  for (const file of fs.readdirSync(require('node:path').resolve(__dirname, '../src/themes'))) {
  const theme = require('../src/themes/' + file);
  const profile = compile(theme);
  const original = JSON.parse(fs.readFileSync(require.resolve('../src/profile.json')));
  for (const override of theme.layoutOverrides) {
    let parent = original;
    for (const key of override.path.slice(0, -1)) parent = parent[key];
    parent[override.path.at(-1)] = override.value;
  }
  const [idle, rpm, alerts, unsupported] = profile.LedContainers;
  assert.equal(rpm.Description, 'amazing-leds-300gt - iRacing RPM');
  assert.equal(rpm.ContainerType, 'Groups.CustomConditionalGroup');
  assert.equal(rpm.TriggerFormula.Expression, 'return amazingGameAllowed() && amazingRpmActive();');
  assert.equal(unsupported.ContentFormula.Expression, 'return amazingUnsupportedGame();');
  for (const wrapper of [idle, alerts]) assert.equal(wrapper.TriggerFormula.Expression, 'return amazingGameAllowed();');
  const reconstructed = [
    { ...idle.LedContainers[0], LedContainers: [
      ...idle.LedContainers[0].LedContainers, ...alerts.LedContainers[0].LedContainers,
    ] }, ...alerts.LedContainers.slice(1),
  ];
  assert.deepEqual(reconstructed, original.LedContainers, theme.slug);
  // Native wrapper settings (including brightness formula) must be identical.
  let rpmGate = rpm.LedContainers[0];
  let originalGate = original.LedContainers[0].LedContainers[1];
  for (let depth = 0; depth < 3; depth++) {
    const settings = ({ Description, LedContainers, ...rest }) => rest;
    assert.deepEqual(settings(rpmGate), settings(originalGate));
    rpmGate = rpmGate.LedContainers[0];
    originalGate = originalGate.LedContainers[0];
  }
  assert.equal(rpmGate.Description, 'RPM background - keep black');
  assert.equal(rpmGate.LedCount, 12);
  }
});
