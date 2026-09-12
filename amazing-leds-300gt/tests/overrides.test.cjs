const test = require('node:test');
const assert = require('node:assert/strict');
const { loadRpm } = require('../tools/rpm.cjs');
const { compile } = require('../tools/build.cjs');
const { runtime } = require('./helpers.cjs');
const theme = require('../src/themes/conspit-signature.json');
const black = '#FF000000';

// Synthetic calibration values for tests only; not claims about in-game RPM.
function fixture(id = 'bmw-m4-gt3-evo') {
  return { cars: { [id]: {
    calibrationStatus: 'test-only', notes: 'Synthetic boundaries, not measured data',
    gears: { '3': {
      thresholds: [5000, 5200, 0, 5400, 5600, 5800, 5800, 5600, 5400, 0, 5200, 5000],
      colors: Array(12).fill('#FF00FF00'),
      redline: 6000,
    } },
  } } };
}
function make(overrides, properties) {
  const r = runtime(compile(theme).EmbeddedJavascript, properties);
  r.call('AMAZING_RPM = ' + JSON.stringify(loadRpm(overrides)));
  return r;
}

test('BMW override uses physical lamps, retains gaps, and only replaces the configured gear', () => {
  const r = make(fixture(), { CarId: 'bmwm4gt3', Gear: '3', Rpms: 4999 });
  const frame = () => r.call('amazingRpmFrame()');
  assert.deepEqual(frame(), Array(12).fill(black));
  r.properties.Rpms = 5000;
  assert.deepEqual(frame(), ['#FF00FF00', ...Array(10).fill(black), '#FF00FF00']);
  r.properties.Rpms = 6000;
  const red = Array(12).fill('#FFFF0000'); red[2] = red[9] = black;
  assert.deepEqual(frame(), red);
  r.tick(500); assert.deepEqual(frame(), red);
  const info = r.call('amazingRpmDiagnostics()');
  assert.equal(info.source, 'car-override');
  assert.equal(info.calibrationStatus, 'test-only');
  assert.match(info.notes, /Synthetic/);
  r.properties.Gear = '4';
  assert.equal(r.call('amazingRpmDiagnostics().source'), 'car-data');
  assert.equal(r.call('amazingRpmDiagnostics().thresholds[0]'), 5715);
  r.properties.Gear = '7';
  assert.equal(r.call('amazingRpmDiagnostics().source'), 'unavailable');
});

test('Porsche override accepts all 12 physical colors and custom flash timing, or no redline overlay', () => {
  const config = fixture('porsche-911-gt3-r-992');
  const row = config.cars['porsche-911-gt3-r-992'].gears['3'];
  row.thresholds = Array(12).fill(5000);
  row.colors = Array(12).fill('#FFFFFF00');
  row.redlineColor = '#FF1234AB'; row.blinkIntervalMs = 100;
  const r = make(config, { CarId: 'porsche992rgt3', Gear: '3', Rpms: 6000 });
  assert.deepEqual(r.call('amazingRpmFrame()'), Array(12).fill('#FF1234AB'));
  r.tick(100);
  assert.deepEqual(r.call('amazingRpmFrame()'), Array(12).fill(black));
  r.properties.Rpms = 5999; r.call('amazingRpmFrame()');
  r.properties.Rpms = 6000;
  assert.deepEqual(r.call('amazingRpmFrame()'), Array(12).fill('#FF1234AB'));
  row.redline = null;
  const steady = make(config, { CarId: 'porsche992rgt3', Gear: '3', Rpms: 10000 });
  assert.deepEqual(steady.call('amazingRpmFrame()'), row.colors);
  steady.call("AMAZING_RPM.mode = 'generic'");
  assert.equal(steady.call('amazingRpmDiagnostics().source'), 'unavailable');
  steady.call("AMAZING_RPM.mode = 'off'");
  assert.deepEqual(steady.call('amazingRpmFrame()'), Array(12).fill(null));
});

test('empty overrides preserve source tables and custom edits never mutate vendor data', () => {
  const baseline = loadRpm({ cars: {} });
  assert.ok(baseline.cars.every((car) => !car.override));
  const custom = loadRpm(fixture());
  assert.deepEqual(custom.cars.map((car) => car.data), baseline.cars.map((car) => car.data));
  assert.deepEqual(loadRpm({ cars: {} }), baseline);
});

test('invalid custom data is rejected before generating profiles', () => {
  const invalid = [
    [c => { c.cars.unknown = c.cars['bmw-m4-gt3-evo']; }, /unknown car/],
    [c => { c.cars['bmw-m4-gt3-evo'].notes = ''; }, /missing notes/],
    [c => { c.cars['bmw-m4-gt3-evo'].gears = {}; }, /must not be empty/],
    [c => { c.cars['bmw-m4-gt3-evo'].gears['0'] = {}; }, /invalid gear/],
  ];
  for (const [edit, error] of invalid) {
    const config = fixture(); edit(config); assert.throws(() => loadRpm(config), error);
  }
  for (const patch of [
    { thresholds: [5000] }, { thresholds: Array(12).fill('5000') },
    { thresholds: Array(12).fill(-1) }, { thresholds: Array(12).fill(6001) },
    { redline: 0 }, { redline: false }, { redline: '6000' },
    { colors: null }, { colors: Array(12).fill('#FFFFFF') },
    { redlineColor: null }, { blinkIntervalMs: -1 }, { blinkIntervalMs: '100' },
    { blinkIntervalMs: null }, { typo: 1 },
  ]) {
    const config = fixture(); Object.assign(config.cars['bmw-m4-gt3-evo'].gears['3'], patch);
    assert.throws(() => loadRpm(config), /RPM overrides:/, JSON.stringify(patch));
  }
  for (const config of [null, [], {}, { cars: [] }, { cars: {}, typo: true }]) {
    assert.throws(() => loadRpm(config), /RPM overrides:/);
  }
});
