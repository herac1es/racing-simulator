const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { applyOverrides } = require('./overrides.cjs');
const root = path.resolve(__dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const color = (value) => typeof value === 'string' && /^#[0-9A-F]{8}$/i.test(value);
const positive = (value) => Number.isFinite(value) && value > 0;
function check(valid, message) { if (!valid) throw new Error('RPM configuration: ' + message); }

function loadRpm(overrides = read('src/rpm/iracing/overrides.json')) {
  const config = read('src/rpm/iracing/config.json');
  check(['auto', 'generic', 'off'].includes(config.mode), 'mode must be auto, generic or off');
  check(config.ledCount === 12, '300 GT requires 12 top LEDs');
  const g = config.generic;
  check(g.fallbackStartRatio > 0 && g.fallbackStartRatio < 1, 'invalid fallback start ratio');
  check(Number.isFinite(g.blinkIntervalMs) && g.blinkIntervalMs >= 0, 'invalid generic blink interval');
  check(g.colors.length === 12 && g.colors.every(color) && color(g.redlineColor), 'invalid generic colors');
  const provenance = read('vendor/lovely-car-data/upstream.json');
  const ids = new Set(), aliases = new Map();
  const cars = fs.readdirSync(path.join(root, 'src/rpm/iracing/cars')).filter((f) => f.endsWith('.json')).sort().map((file) => {
    const car = read('src/rpm/iracing/cars/' + file);
    check(car.id && !ids.has(car.id), 'duplicate or missing car id'); ids.add(car.id);
    check(car.carIds.length > 0 && Array.isArray(car.carNames), car.id + ': missing identity');
    for (const alias of [...car.carIds, ...car.carNames]) {
      const normalized = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      check(normalized && (!aliases.has(normalized) || aliases.get(normalized) === car.id), car.id + ': ambiguous alias'); aliases.set(normalized, car.id);
    }
    let source, data;
    check(car.dataSource === undefined || ['lovely-car-data', 'iracing-manual'].includes(car.dataSource), car.id + ': unknown data source');
    if (car.dataSource === 'iracing-manual') {
      const official = read('src/rpm/iracing/official/' + car.dataFile);
      source = official.source;
      check(source?.kind === 'iracing-manual' && source.url?.startsWith('https://s100.iracing.com/') &&
        Number.isInteger(source.page) && source.page > 0 && source.revision && source.gearScope && source.limitations,
        car.id + ': incomplete official source record');
      check(Array.isArray(official.sharedRpm), car.id + ': missing published RPM table');
      const { source: ignored, sharedRpm, ...fields } = official;
      // The manual has ONE table. Reuse it as a clearly labelled editable
      // baseline; do not claim eight independent official gear measurements.
      data = { ...fields, ledRpm: [Object.fromEntries(['R', 'N', '1', '2', '3', '4', '5', '6'].map((gear) => [gear, sharedRpm.slice()]))] };
    } else {
      const entry = provenance.files.find((entry) => entry.file === car.dataFile);
      check(entry, car.id + ': missing provenance');
      const bytes = fs.readFileSync(path.join(root, 'vendor/lovely-car-data', entry.file));
      check(crypto.createHash('sha256').update(bytes).digest('hex') === entry.sha256, car.id + ': source hash mismatch');
      data = JSON.parse(bytes);
      source = { ...entry, kind: 'lovely-car-data', revision: provenance.revision, license: provenance.license };
    }
    check(car.carIds.includes(data.carId), car.id + ': unexpected source car');
    check(Number.isInteger(data.ledNumber) && data.ledNumber > 0, car.id + ': invalid LED count');
    check(data.ledColor.length === data.ledNumber + 1 && data.ledColor.every(color), car.id + ': invalid colors');
    check(Number.isFinite(data.redlineBlinkInterval) && data.redlineBlinkInterval >= 0, car.id + ': invalid blink interval');
    check(car.mapping.length === 12 && car.mapping.every((i) => Number.isInteger(i) && i > 0 && i <= data.ledNumber), car.id + ': invalid mapping');
    // Repeated sources intentionally expand a smaller lamp group without
    // inventing RPM stages (BMW repeats its last two activation lamps).
    if (car.sourceLedOrder) {
      const order = car.sourceLedOrder;
      check(order.length === 10 && new Set(order).size === 10 &&
        order.every((i) => Number.isInteger(i) && i > 0 && i <= data.ledNumber), car.id + ': invalid source lamp order');
      check(JSON.stringify(car.mapping) === JSON.stringify([...order.slice(0, 8), order[8], order[8], order[9], order[9]]),
        car.id + ': 10-to-12 mapping must duplicate only the final two lamps');
    }
    check(data.ledRpm.length === 1, car.id + ': unexpected gear table');
    const gears = data.ledRpm[0];
    for (const gear of ['R', 'N', '1', '2', '3', '4', '5', '6']) {
      const row = gears[gear];
      check(row && row.length === data.ledNumber + 1 && positive(row[0]), car.id + ': invalid gear ' + gear);
      check(row.slice(1).every((rpm) => Number.isFinite(rpm) && rpm >= 0 && rpm <= row[0]), car.id + ': invalid thresholds for ' + gear);
      if (car.sourceLedOrder) check(car.sourceLedOrder.every((sourceIndex, i, order) =>
        row[sourceIndex] > 0 && data.ledColor[sourceIndex].slice(1, 3) !== '00' &&
        (i === 0 || row[sourceIndex] >= row[order[i - 1]])), car.id + ': invalid left-to-right activation order for ' + gear);
    }
    return { ...car, data, source };
  });
  return { ...config, cars: applyOverrides(cars, overrides) };
}
module.exports = { loadRpm };
