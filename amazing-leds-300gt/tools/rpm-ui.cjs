// Native SimHub nodes, using the RPMSegments/Animation serialization from
// the existing theme pack. Car/gear routing stays in JS; tuning lives in the UI.
const jsFormula = (Expression) => ({ JSExt: 4, Interpreter: 1, Expression });
const group = (Description, expression, LedContainers) => ({
  ContainerType: 'Groups.CustomConditionalGroup', Description,
  TriggerFormula: jsFormula(expression), LedContainers,
});
const black = '#FF000000';

function gearSettings(car, gear) {
  if (car.override?.gears[gear]) return car.override.gears[gear];
  const row = car.data.ledRpm[0][gear];
  return {
    thresholds: car.mapping.map((i) => row[i]),
    colors: car.mapping.map((i) => car.data.ledColor[i]),
    redline: row[0], redlineColor: car.data.ledColor[0],
    blinkIntervalMs: car.data.redlineBlinkInterval,
  };
}

function gearNodes(car, gear) {
  const settings = gearSettings(car, gear);
  const enabled = settings.thresholds.map((rpm, i) => rpm > 0 && settings.colors[i].slice(1, 3) !== '00');
  const nodes = [{
    ContainerType: 'RPMSegments', Description: 'Progressive RPM - edit thresholds and colors',
    StartPosition: 1, RpmMode: 2, RelativeToRedline: false,
    BlinkEnabled: false, BlinkOnLastGear: false, BlinkDelay: 250,
    SegmentsCount: 12,
    Segments: settings.thresholds.map((rpm, i) => `1;${rpm};${enabled[i] ? settings.colors[i] : black};0;`),
  }];
  // A separate overlay retains the last progressive stage before redline.
  // Explicit black pixels prevent the progressive strip showing through off frames.
  const colors = (on) => enabled.map((active, i) => `0,${i},${on && active ? settings.redlineColor : black}`).join(';');
  const frames = [{ Colors: colors(true), FrameDuration: settings.blinkIntervalMs || 100 }];
  if (settings.blinkIntervalMs > 0) frames.push({ Colors: colors(false), FrameDuration: settings.blinkIntervalMs });
  nodes.push(group('Redline - edit trigger RPM here',
    settings.redline === null ? 'return false;' : `return amazingRpmCurrent() >= ${settings.redline};`, [{
      ContainerType: 'Animation', Description: 'Redline color and timing - one frame is steady',
      StartPosition: 1,
      Animation: { Columns: 12, Rows: 1, Frames: frames, PenColor: settings.redlineColor },
    }]));
  return group(`Gear ${gear}`, `return amazingRpmGear() === ${JSON.stringify(gear)};`, nodes);
}

function rpmUi(rpm) {
  return group('amazing-leds-300gt - iRacing RPM', 'return amazingRpmActive();', [
    { ContainerType: 'StaticColor', Description: 'RPM background - keep black',
      StartPosition: 1, LedCount: 12, Color: black, BlinkEnabled: false, EnableIdleBlinking: false },
    ...rpm.cars.map((car) => {
      const gears = new Set([...Object.keys(car.data.ledRpm[0]), ...Object.keys(car.override?.gears || {})]);
      const order = ['R', 'N', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      return group(car.name, `return amazingRpmUiCar(${JSON.stringify(car.id)});`,
        order.filter((gear) => gears.has(gear)).map((gear) => gearNodes(car, gear)));
    }),
    group('Generic RPM - live telemetry fallback', 'return !amazingRpmUiHasCarData();', [{
      ContainerType: 'ScriptedContent', Description: 'Dynamic telemetry window',
      StartPosition: 1, LedCount: 12, ContentFormula: jsFormula('return amazingRpmFrame();'),
    }]),
  ]);
}
module.exports = { rpmUi, gearSettings };
