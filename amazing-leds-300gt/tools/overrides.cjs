const color = (value) => typeof value === 'string' && /^#[0-9A-F]{8}$/i.test(value);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
function check(valid, message) { if (!valid) throw new Error('RPM overrides: ' + message); }
function fields(value, allowed, label) {
  check(object(value), label + ': expected an object');
  for (const key of Object.keys(value)) check(allowed.includes(key), label + ': unknown field ' + key);
}

// Overrides address the 12 physical LEDs directly, independently of source mapping.
function applyOverrides(cars, overrides) {
  fields(overrides, ['cars'], 'root');
  check(object(overrides.cars), 'cars must be an object');
  for (const [id, custom] of Object.entries(overrides.cars)) {
    const car = cars.find((entry) => entry.id === id);
    check(car, 'unknown car ' + id);
    fields(custom, ['calibrationStatus', 'notes', 'gears'], id);
    for (const key of ['calibrationStatus', 'notes']) {
      check(typeof custom[key] === 'string' && custom[key].trim(), id + ': missing ' + key);
    }
    check(object(custom.gears) && Object.keys(custom.gears).length > 0, id + ': gears must not be empty');
    const resolved = {};
    for (const [gear, row] of Object.entries(custom.gears)) {
      const label = id + '/' + gear;
      check(/^(R|N|[1-9])$/.test(gear), label + ': invalid gear');
      fields(row, ['thresholds', 'colors', 'redline', 'redlineColor', 'blinkIntervalMs'], label);
      check(Array.isArray(row.thresholds) && row.thresholds.length === 12 &&
        row.thresholds.every((rpm) => Number.isFinite(rpm) && rpm >= 0), label + ': expected 12 nonnegative RPM thresholds');
      check(row.redline === null || (Number.isFinite(row.redline) && row.redline > 0), label + ': redline must be positive or null');
      check(row.redline === null || row.thresholds.every((rpm) => rpm <= row.redline), label + ': threshold exceeds redline');
      const colors = Object.hasOwn(row, 'colors') ? row.colors : car.mapping.map((i) => car.data.ledColor[i]);
      const redlineColor = Object.hasOwn(row, 'redlineColor') ? row.redlineColor : car.data.ledColor[0];
      const blinkIntervalMs = Object.hasOwn(row, 'blinkIntervalMs') ? row.blinkIntervalMs : car.data.redlineBlinkInterval;
      check(Array.isArray(colors) && colors.length === 12 && colors.every(color), label + ': expected 12 #AARRGGBB colors');
      check(color(redlineColor), label + ': invalid redline color');
      check(Number.isFinite(blinkIntervalMs) && blinkIntervalMs >= 0, label + ': invalid blink interval');
      resolved[gear] = { thresholds: row.thresholds.slice(), colors: colors.slice(), redline: row.redline, redlineColor, blinkIntervalMs };
    }
    car.override = { calibrationStatus: custom.calibrationStatus, notes: custom.notes, gears: resolved };
  }
  return cars;
}
module.exports = { applyOverrides };
