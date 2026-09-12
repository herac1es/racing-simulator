const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { compile } = require('../tools/build.cjs');
const { loadRpm } = require('../tools/rpm.cjs');
const { rpmUi } = require('../tools/rpm-ui.cjs');
const { runtime } = require('./helpers.cjs');
const theme = require('../src/themes/conspit-signature.json');
const profile = compile(theme);
const black = '#FF000000';
const make = (props) => runtime(profile.EmbeddedJavascript, props);
function find(node, description) {
  if (node.Description === description) return node;
  for (const child of node.LedContainers || []) {
    const found = find(child, description);
    if (found) return found;
  }
}
const root = find(profile, 'amazing-leds-300gt - iRacing RPM');
function activeLeaves(r, node, output = []) {
  if (node.ContainerType === 'Groups.GameRunningGroup' && !r.properties.GameRunning) return output;
  if (node.TriggerFormula && !r.call('(function(){' + node.TriggerFormula.Expression + '})()')) return output;
  if (node.LedContainers) node.LedContainers.forEach((child) => activeLeaves(r, child, output));
  else output.push(node);
  return output;
}
function segments(node) {
  return node.Segments.flatMap((entry) => {
    const [count, rpm, color] = entry.split(';');
    return Array.from({ length: Number(count) }, () => ({ rpm: Number(rpm), color }));
  });
}
// Inspect serialized native payloads, not a claim to execute SimHub's animation
// scheduler. animationFrame explicitly selects a stored frame for comparison.
function payloadFrame(r, node = root, animationFrame = 0) {
  const output = Array(12).fill(null);
  for (const leaf of activeLeaves(r, node)) {
    const start = (leaf.StartPosition || 1) - 1;
    let colors;
    if (leaf.ContainerType === 'StaticColor') colors = Array(leaf.LedCount).fill(leaf.Color);
    else if (leaf.ContainerType === 'RPMSegments') {
      colors = segments(leaf).map((segment) => r.properties.Rpms >= segment.rpm ? segment.color : black);
    } else if (leaf.ContainerType === 'Animation') {
      const frame = leaf.Animation.Frames[animationFrame % leaf.Animation.Frames.length];
      colors = Array(12).fill(null);
      for (const pixel of frame.Colors.split(';')) {
        const [row, col, color] = pixel.split(',');
        assert.equal(row, '0'); colors[Number(col)] = color;
      }
    } else if (leaf.ContainerType === 'ScriptedContent') {
      colors = r.call('(function(){' + leaf.ContentFormula.Expression + '})()');
    } else throw new Error('Unexpected native leaf: ' + leaf.ContainerType);
    colors.forEach((color, i) => { if (color !== null) output[start + i] = color; });
  }
  assert.equal(output.length, 12);
  return output;
}

test('all themes expose native per-car, per-gear RPM segments and redline animations', () => {
  for (const file of fs.readdirSync(require('node:path').resolve(__dirname, '../src/themes'))) {
    const built = compile(require('../src/themes/' + file));
    assert.doesNotMatch(built.Description, /not included/);
    const ui = find(built, root.Description);
    assert.equal(built.LedContainers[1], ui, 'RPM must be visible as a root editor row');
    assert.match(built.Name, / - RPM UI v2$/);
    const theme = require('../src/themes/' + file);
    assert.notEqual(built.ProfileId, theme.profileId, 'new import must not share the legacy profile ID');
    assert.equal(built.ProfileId, compile(theme).ProfileId, 'rebuilds retain stable IDs');
    for (const car of loadRpm().cars) {
      const group = find(ui, car.name);
      assert.deepEqual(group.LedContainers.map((n) => n.Description), ['Gear R', 'Gear N', 'Gear 1', 'Gear 2', 'Gear 3', 'Gear 4', 'Gear 5', 'Gear 6']);
      for (const gear of group.LedContainers) {
        const [bar, redline] = gear.LedContainers;
        assert.equal(bar.ContainerType, 'RPMSegments');
        assert.equal(bar.RpmMode, 2);
        assert.equal(bar.RelativeToRedline, false);
        assert.equal(bar.BlinkEnabled, false);
        assert.equal(bar.StartPosition, 1);
        assert.equal(bar.SegmentsCount, bar.Segments.length);
        assert.equal(segments(bar).length, 12);
        const animation = redline.LedContainers[0].Animation;
        assert.equal(animation.Columns, 12); assert.equal(animation.Rows, 1);
        assert.equal(animation.Frames.length, car.data.redlineBlinkInterval === 0 ? 1 : 2);
        assert.ok(animation.Frames.every((f) => f.FrameDuration > 0));
        assert.doesNotMatch(JSON.stringify(gear), /amazingRpmFrame|amazingRpmDiagnostics|ScriptedContent/);
      }
    }
  }
});

test('native payloads retain every car/gear threshold, color and redline boundary', () => {
  for (const car of loadRpm().cars) {
    const r = make({ CarId: car.carIds[0] });
    for (const [gear, row] of Object.entries(car.data.ledRpm[0])) {
      r.properties.Gear = gear;
      const points = [...new Set([...row.filter((rpm) => rpm > 0).flatMap((rpm) => [rpm - 0.01, rpm]), row[0] + 100])];
      for (const rpm of points) {
        r.properties.Rpms = rpm;
        assert.deepEqual(payloadFrame(r), r.call('amazingRpmFrame()'), `${car.id}/${gear}/${rpm}`);
      }
      if (car.data.redlineBlinkInterval > 0) {
        r.tick(car.data.redlineBlinkInterval);
        assert.deepEqual(payloadFrame(r, root, 1), r.call('amazingRpmFrame()'));
        const animation = find(find(root, car.name), 'Gear ' + gear).LedContainers[1].LedContainers[0].Animation;
        assert.deepEqual(animation.Frames.map((f) => f.FrameDuration), [250, 250]);
      }
    }
  }
});

test('editing the UI segment and redline trigger changes output independently of embedded tables', () => {
  const edited = structuredClone(root);
  const gear = find(find(edited, 'BMW M4 GT3 EVO'), 'Gear 3');
  const [bar, redline] = gear.LedContainers;
  bar.Segments[0] = '1;4700;#FF123456;0;';
  redline.TriggerFormula.Expression = 'return amazingRpmCurrent() >= 7000;';
  const r = make({ CarId: 'bmwm4gt3', Gear: '3', Rpms: 4699 });
  assert.deepEqual(payloadFrame(r, edited), Array(12).fill(black));
  r.properties.Rpms = 4700;
  assert.deepEqual(payloadFrame(r, edited), ['#FF123456', ...Array(11).fill(black)]);
  assert.deepEqual(r.call('amazingRpmFrame()'), Array(12).fill(black), 'compiled baseline is not the native output');
  r.properties.Rpms = 6950;
  assert.equal(payloadFrame(r, edited)[0], '#FF123456', 'old redline cannot override UI threshold');
  r.properties.Rpms = 7000;
  assert.deepEqual(payloadFrame(r, edited), Array(12).fill('#FFFF0000'));
  r.properties.Gear = '4'; r.properties.Rpms = 4700;
  assert.deepEqual(payloadFrame(r, edited), Array(12).fill(black), 'other gears are unchanged');
});

test('native routing preserves fallback and session gates without drawing both RPM paths', () => {
  for (const props of [
    { CarId: 'bmwm4gt3', Gear: '7', MaxRpm: 7000 },
    { CarId: 'porsche992cup', CarModel: 'Porsche 911 GT3 R (992)', MaxRpm: 7000 },
    { CarId: 'porsche992rgt3', Gear: null, MaxRpm: 7000 },
    { CarId: 'unknown', MaxRpm: 0 },
  ]) {
    const r = make({ Rpms: 6000, ...props });
    assert.deepEqual(payloadFrame(r), r.call('amazingRpmFrame()'));
    assert.equal(activeLeaves(r, root).filter((n) => n.ContainerType === 'RPMSegments').length, 0);
  }
  for (const id of ['bmwm4gt3', 'porsche992rgt3']) {
    for (const rpm of [null, '', false, -1, 0, NaN, Infinity, 'invalid', 6000]) {
      const r = make({ CarId: id, Rpms: rpm });
      assert.deepEqual(payloadFrame(r), r.call('amazingRpmFrame()'));
      assert.equal(activeLeaves(r, root).filter((n) => n.ContainerType === 'ScriptedContent').length, 0);
    }
  }
  for (const props of [
    { GamePaused: true }, { IsInPitLane: true }, { PitLimiterOn: true },
    { EngineIgnitionOn: false }, { EngineStarted: false },
    { 'DataCorePlugin.GameRunning': false }, { 'DataCorePlugin.CurrentGame': 'LMU' },
    { GameRunning: false },
    { 'GameRawData.Telemetry.IsOnTrack': false },
    { Spectating: true, 'ConspitLEDs.SpectateShowTelemetry': 0 },
    { Spectating: true, 'ConspitLEDs.SpectateShowTelemetry': 2 },
    { 'ConspitLEDs.TelemetryFunction': 3 },
  ]) {
    const r = make({ CarId: 'bmwm4gt3', Rpms: 7000, ...props });
    assert.deepEqual(payloadFrame(r), Array(12).fill(null));
  }
  const r = make({ CarId: 'bmwm4gt3', Rpms: 6500, MaxRpm: 7000 });
  r.call("AMAZING_RPM.mode = 'generic'");
  assert.deepEqual(payloadFrame(r), r.call('amazingRpmFrame()'));
  r.call("AMAZING_RPM.mode = 'off'");
  assert.deepEqual(payloadFrame(r), Array(12).fill(null));
});

test('source overrides generate native controls including disabled redline and explicit lamp gaps', () => {
  const rpm = loadRpm({ cars: { 'bmw-m4-gt3-evo': {
    calibrationStatus: 'test-only', notes: 'Synthetic UI fixture',
    gears: { '3': { thresholds: [0, ...Array(11).fill(5000)], redline: null } },
  } } });
  const ui = rpmUi(rpm);
  const r = make({ CarId: 'bmwm4gt3', Gear: '3', Rpms: 9000 });
  r.call('AMAZING_RPM = ' + JSON.stringify(rpm));
  assert.deepEqual(payloadFrame(r, ui), r.call('amazingRpmFrame()'));
  assert.equal(payloadFrame(r, ui)[0], black);
  const redline = find(find(ui, 'BMW M4 GT3 EVO'), 'Gear 3').LedContainers[1];
  assert.equal(redline.TriggerFormula.Expression, 'return false;');
});
