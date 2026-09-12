const vm = require('node:vm');

function runtime(source, overrides = {}) {
  let now = 10000;
  const properties = {
    'DataCorePlugin.CurrentGame': 'IRacing', 'GameName': 'IRacing',
    'DataCorePlugin.GameRunning': true, GameRunning: true,
    CarId: 'bmwm2g87', CarModel: 'BMW M2 Racing (G87)', CarClass: 'M2',
    TrackName: 'Okayama', SessionTypeName: 'Practice',
    'GameRawData.Telemetry.SessionTime': 100,
    'GameRawData.Telemetry.BrakeRaw': 0,
    'GameRawData.Telemetry.IsOnTrack': true,
    EngineIgnitionOn: true, EngineStarted: true, Rpms: 3000,
    SpeedKmh: 100, Gear: '3', Brake: 0, Throttle: 30,
    ...overrides,
  };
  const buttons = new Set();
  const ctx = vm.createContext({
    $prop: (name) => properties[name], root: {},
    getcontrollerbuttonstate: (_device, id) => buttons.has(id),
    isincreasing: () => false, isdecreasing: () => false, Changed: () => false,
    isnull: (value, fallback) => value == null ? fallback : value,
    Date: class extends Date { static now() { return now; } },
  });
  vm.runInContext(source, ctx, { timeout: 2000 });
  return {
    ctx, properties, buttons,
    call: (expression) => {
      const value = vm.runInContext(expression, ctx, { timeout: 1000 });
      return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    },
    tick: (ms = 100) => { now += ms; properties['GameRawData.Telemetry.SessionTime'] += ms / 1000; },
  };
}
module.exports = { runtime };
