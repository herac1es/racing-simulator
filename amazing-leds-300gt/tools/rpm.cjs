const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const color = (value) => typeof value === 'string' && /^#[0-9A-F]{8}$/i.test(value);
const positive = (value) => Number.isFinite(value) && value > 0;
function check(valid, message) { if (!valid) throw new Error('RPM configuration: ' + message); }

function loadRpm() {
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
    const source = provenance.files.find((entry) => entry.file === car.dataFile);
    check(source, car.id + ': missing provenance');
    const bytes = fs.readFileSync(path.join(root, 'vendor/lovely-car-data', source.file));
    check(crypto.createHash('sha256').update(bytes).digest('hex') === source.sha256, car.id + ': source hash mismatch');
    const data = JSON.parse(bytes);
    check(car.carIds.includes(data.carId), car.id + ': unexpected source car');
    check(Number.isInteger(data.ledNumber) && data.ledNumber > 0, car.id + ': invalid LED count');
    check(data.ledColor.length === data.ledNumber + 1 && data.ledColor.every(color), car.id + ': invalid colors');
    check(Number.isFinite(data.redlineBlinkInterval) && data.redlineBlinkInterval >= 0, car.id + ': invalid blink interval');
    check(car.mapping.length === 12 && car.mapping.every((i) => Number.isInteger(i) && i > 0 && i <= data.ledNumber), car.id + ': invalid mapping');
    check(new Set(car.mapping).size === 12, car.id + ': duplicate mapped lamp');
    check(data.ledRpm.length === 1, car.id + ': unexpected gear table');
    const gears = data.ledRpm[0];
    for (const gear of ['R', 'N', '1', '2', '3', '4', '5', '6']) {
      const row = gears[gear];
      check(row && row.length === data.ledNumber + 1 && positive(row[0]), car.id + ': invalid gear ' + gear);
      check(row.slice(1).every((rpm) => Number.isFinite(rpm) && rpm >= 0 && rpm <= row[0]), car.id + ': invalid thresholds for ' + gear);
    }
    return { ...car, data, source: { ...source, revision: provenance.revision, license: provenance.license } };
  });
  return { ...config, cars };
}
module.exports = { loadRpm };
