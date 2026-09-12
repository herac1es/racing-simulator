const test = require('node:test');
const assert = require('node:assert/strict');
const { loadRpm } = require('../tools/rpm.cjs');
const { gearSettings } = require('../tools/rpm-ui.cjs');

test('10-to-12 mapping preserves source order and duplicates only the final two activation lamps', () => {
  let checked = 0;
  for (const car of loadRpm({ cars: {} }).cars) {
    for (const [gear, row] of Object.entries(car.data.ledRpm[0])) {
      const active = Array.from({ length: car.data.ledNumber }, (_, i) => i + 1)
        .filter((i) => row[i] > 0 && car.data.ledColor[i].slice(1, 3) !== '00');
      if (active.length !== 10) continue;
      checked++;
      const byActivation = active.slice().sort((a, b) => row[a] - row[b]);
      const finalPair = byActivation.slice(-2);
      // The boundary must identify two final lamps, not arbitrarily select two
      // out of a larger simultaneously lit group.
      assert.ok(row[byActivation[7]] < row[finalPair[0]], `${car.id}/${gear}: final pair is ambiguous`);
      const order = car.sourceLedOrder || active;
      assert.deepEqual([...order].sort((a, b) => a - b), active, 'retain every active source exactly once before expansion');
      const expected = order.flatMap((i) => finalPair.includes(i) ? [i, i] : [i]);
      assert.deepEqual(car.mapping, expected, `${car.id}/${gear}: duplicate final pair in documented layout order`);
      const settings = gearSettings(car, gear);
      assert.deepEqual(settings.thresholds, expected.map((i) => row[i]));
      assert.deepEqual(settings.colors, expected.map((i) => car.data.ledColor[i]));
      assert.equal(settings.redline, row[0]);
      assert.equal(settings.redlineColor, car.data.ledColor[0]);
      assert.equal(settings.blinkIntervalMs, car.data.redlineBlinkInterval);
    }
  }
  assert.ok(checked > 0, 'must cover at least one 10-lamp car');
});
