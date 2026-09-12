// Original renderer: MIT. Embedded Lovely Car Data: CC-BY-NC-SA-4.0.
// All arrays returned here address only physical LEDs 1..12.
function amazingRpmValue(keys) {
    for (var i = 0; i < keys.length; i++) {
        var value = $prop(keys[i]);
        if (value !== null && value !== undefined && String(value).trim() !== '') return value;
    }
    return null;
}

function amazingRpmNumber(value) {
    if (value === null || value === undefined || typeof value === 'boolean' || String(value).trim() === '') return null;
    var number = Number(value);
    return isFinite(number) && number >= 0 ? number : null;
}

function amazingRpmKey(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

function amazingRpmCar() {
    var id = amazingRpmKey(amazingRpmValue(['DataCorePlugin.CarId', 'CarId', 'DataCorePlugin.GameData.NewData.CarId']));
    var name = amazingRpmKey(amazingRpmValue(['DataCorePlugin.CarModel', 'CarModel', 'DataCorePlugin.GameData.NewData.CarModel']));
    for (var i = 0; i < AMAZING_RPM.cars.length; i++) {
        var car = AMAZING_RPM.cars[i], aliases = id ? car.carIds : car.carNames;
        for (var j = 0; j < aliases.length; j++) if (amazingRpmKey(aliases[j]) === (id || name)) return car;
    }
    return null;
}

function amazingRpmGear() {
    var value = amazingRpmValue(['Gear', 'DataCorePlugin.GameData.NewData.Gear', 'GameRawData.Telemetry.Gear']);
    if (value === null) return '';
    value = String(value).trim().toUpperCase();
    if (value === '-1') return 'R';
    if (value === '0') return 'N';
    return /^(R|N|[1-9])$/.test(value) ? value : '';
}

// A complete window comes from ONE source; invalid live fields cannot be mixed
// with session fields to fabricate a seemingly valid window.
function amazingRpmWindow(prefix, label) {
    var first = amazingRpmNumber($prop(prefix + 'FirstRPM'));
    var last = amazingRpmNumber($prop(prefix + 'LastRPM'));
    var shift = amazingRpmNumber($prop(prefix + 'ShiftRPM'));
    var blink = amazingRpmNumber($prop(prefix + 'BlinkRPM'));
    if (!(first > 0 && last > first)) return null;
    return { first: first, last: last, shift: shift > 0 ? shift : null,
        blink: blink >= last ? blink : null, source: label };
}

function amazingRpmGeneric() {
    var g = AMAZING_RPM.generic;
    var window = amazingRpmWindow('GameRawData.Telemetry.PlayerCarSL', 'live-telemetry') ||
        amazingRpmWindow('GameRawData.SessionData.DriverInfo.DriverCarSL', 'session-data');
    if (!window) {
        // Standard SimHub redline and then engine maximum are approximations.
        var keys = ['DataCorePlugin.GameData.NewData.CarSettings_CurrentGearRedLineRPM',
            'CarSettings_CurrentGearRedLineRPM', 'DataCorePlugin.GameData.NewData.CarSettings_RedLineRPM',
            'CarSettings_RedLineRPM', 'MaxRpm', 'DataCorePlugin.GameData.NewData.MaxRpm'];
        for (var k = 0; k < keys.length; k++) {
            var end = amazingRpmNumber($prop(keys[k]));
            if (end > 0) {
                window = { first: end * g.fallbackStartRatio, last: end, shift: null, blink: null, source: 'simhub-estimate:' + keys[k] };
                break;
            }
        }
    }
    if (!window) return null;
    var thresholds = [];
    for (var i = 0; i < 12; i++) thresholds.push(window.first + (window.last - window.first) * i / 11);
    return { source: window.source, thresholds: thresholds, colors: g.colors.slice(),
        redline: window.blink, shift: window.shift, redlineColor: g.redlineColor,
        blinkIntervalMs: g.blinkIntervalMs, calibrationStatus: 'generic-approximation' };
}

// Pure resolution: diagnostics do not advance or reset animation state.
function amazingRpmDiagnostics() {
    var car = amazingRpmCar(), gear = amazingRpmGear(), resolved = null;
    if (AMAZING_RPM.mode === 'auto' && car && car.data.ledRpm[0][gear]) {
        var row = car.data.ledRpm[0][gear];
        resolved = { source: 'car-data', car: car.id, gear: gear,
            thresholds: car.mapping.map(function (i) { return row[i]; }),
            colors: car.mapping.map(function (i) { return car.data.ledColor[i]; }),
            redline: row[0], redlineColor: car.data.ledColor[0],
            blinkIntervalMs: car.data.redlineBlinkInterval,
            calibrationStatus: car.calibrationStatus, revision: car.source.revision };
    }
    if (!resolved) resolved = amazingRpmGeneric() || { source: 'unavailable', thresholds: [], colors: [] };
    resolved.matchedCar = car ? car.id : null;
    resolved.gear = gear;
    resolved.mode = AMAZING_RPM.mode;
    resolved.rpm = amazingRpmNumber(amazingRpmValue(['Rpms', 'RPMS', 'DataCorePlugin.GameData.NewData.Rpms', 'GameRawData.Telemetry.RPM']));
    return resolved;
}

function amazingRpmFrame() {
    var empty = new Array(12).fill(null), dark = new Array(12).fill('#FF000000');
    var game = String(amazingRpmValue(['DataCorePlugin.CurrentGame', 'GameName']) || '').toLowerCase();
    var mode = amazingRpmValue(['ConspitLEDs.TelemetryFunction', 'CONSPITLEDS.TelemetryFunction']);
    var running = amazingRpmValue(['DataCorePlugin.GameRunning', 'GameRunning']);
    var ignition = amazingRpmValue(['EngineIgnitionOn', 'DataCorePlugin.GameData.NewData.EngineIgnitionOn']);
    var started = amazingRpmValue(['EngineStarted', 'DataCorePlugin.GameData.NewData.EngineStarted']);
    var spectating = $prop('Spectating') == true && $prop('ConspitLEDs.SpectateShowTelemetry') == 0;
    var onTrack = $prop('GameRawData.Telemetry.IsOnTrack');
    if (game !== 'iracing' || running != true || AMAZING_RPM.mode === 'off' ||
        (mode !== null && mode != 1 && mode != 2) || spectating ||
        ignition === false || ignition === 0 || started === false || started === 0 ||
        (onTrack != null && onTrack == false && $prop('GameRawData.Telemetry.IsReplayPlaying') != true) ||
        c300v27Paused() || cp300v3PitLimiter() || cp300v3InPitLane()) {
        globalThis.amazingRpmFlash = null;
        return empty;
    }
    var info = amazingRpmDiagnostics();
    if (!(info.rpm > 0) || info.source === 'unavailable') {
        globalThis.amazingRpmFlash = null;
        return dark;
    }
    var result = dark.slice();
    // Black out source gaps as well: alpha=0 must not reveal the idle layer.
    for (var i = 0; i < 12; i++) {
        if (info.thresholds[i] > 0 && info.rpm >= info.thresholds[i] && info.colors[i].slice(1, 3) !== '00') result[i] = info.colors[i];
    }
    if (info.redline > 0 && info.rpm >= info.redline) {
        var identity = amazingRpmKey(amazingRpmValue(['DataCorePlugin.CarId', 'CarId', 'CarModel']));
        var key = identity + ':' + info.source + ':' + info.gear + ':' + info.redline;
        var now = Date.now(), state = globalThis.amazingRpmFlash;
        if (!state || state.key !== key || now < state.start) state = { key: key, start: now };
        globalThis.amazingRpmFlash = state;
        // Interval is an on/off phase duration. Zero is a steady indication.
        var on = info.blinkIntervalMs === 0 || Math.floor((now - state.start) / info.blinkIntervalMs) % 2 === 0;
        for (var j = 0; j < 12; j++) {
            if (info.thresholds[j] > 0 && info.colors[j].slice(1, 3) !== '00') result[j] = on ? info.redlineColor : '#FF000000';
        }
    } else globalThis.amazingRpmFlash = null;
    return result;
}
