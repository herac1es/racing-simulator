// Migrated non-RPM helpers from Conspit 300 GT Themes Pack V1.2.
// Palette values live in src/themes/. Historical helper names preserve compatibility.
let NM_LD_Behaviour;

let NM_CSP_Behaviour;

let TDMState;

class GlobalColours {
	constructor() {
		this.update();
	}

	update() {
		this.csp300_TCcolour_Hex = $prop('ConspitLEDs.TractionControlColour') ?? '#FF006CFF';
		this.csp300_ABScolour_Hex = $prop('ConspitLEDs.ABSColour') ?? '#FFFFFF00';
		this.csp300_BBcolour_Hex = $prop('ConspitLEDs.BrakeBiasColour') ?? '#FFFF2020';
		this.csp300_MAPcolour_Hex = $prop('ConspitLEDs.EngineMapColour') ?? '#FF00FF00';

		this.csp300_IgnitionOn_Hex = $prop('ConspitLEDs.IgnitionOnColour') ?? '#FFFFFF00';
		this.csp300_EngineOff_Hex = $prop('ConspitLEDs.EngineOffColour') ?? '#FFFF0018';
		this.csp300_EngineOn_Hex = $prop('ConspitLEDs.EngineOnColour') ?? '#FF00FF00';

		this.csp300_EngineStart_Hex = $prop('ConspitLEDs.EngineStartColour') ?? '#FFFF0018';

		this.csp300_Clutch_Hex = $prop('ConspitLEDs.ClutchColour') ?? '#FFFFFFFF';
		this.csp300_Brake_Hex = $prop('ConspitLEDs.BrakeColour') ?? '#FFFF2020';
		this.csp300_Flasher_Hex = $prop('ConspitLEDs.FlasherColour') ?? '#FF006CFF';

		this.csp300_Spotter_Hex = $prop('ConspitLEDs.SpotterColour') ?? '#FFFFFFFF';

		this.csp300_PitLimiter_Hex1 = $prop('ConspitLEDs.PitLimiterColour1') ?? '#FF00EFFF';
		this.csp300_PitLimiter_Hex2 = $prop('ConspitLEDs.PitLimiterColour2') ?? '#FFFFFFFF';

		this.csp300_Lowfuel_Hex = $prop('ConspitLEDs.LowFuelColour') ?? '#FFFF2020';
		this.csp300_LiftAndCoast_Hex = $prop('ConspitLEDs.LiftAndCoastColour') ?? '#FFFFFFFF';
	}
}

const UpdateGlobalColours = new GlobalColours();

const csp300_isdecreasing_maxTime_states = {};

function csp300_isdecreasing_maxTime (maxDuration, propertyValue, key = null) {
	const state = csp300_isdecreasing_maxTime_states[key] ??= {
		oldstate: propertyValue,
		newstate: propertyValue,
		triggerTime: null
	};

	state.oldstate = state.newstate;
	state.newstate = propertyValue;

	if (state.newstate < state.oldstate) {
		state.triggerTime = Date.now();
	}

	return state.triggerTime != null && Date.now() - state.triggerTime <= maxDuration;
}

function csp300_brake_propertySelect() {


	{
		return parseInt($prop('GameRawData.Telemetry.BrakeRaw') * 100);
	}






}

function csp300_ABSActive() {
	//if ($prop('DataCorePlugin.CurrentGame') == 'LMU') {
	//	const absForces = [
	//		$prop('GameRawData.physicsGuessing.ABSForce01'),
	//		$prop('GameRawData.physicsGuessing.ABSForce02'),
	//		$prop('GameRawData.physicsGuessing.ABSForce03'),
	//		$prop('GameRawData.physicsGuessing.ABSForce04')
	//		];
	//	return absForces.some(force => force > 0);
	//}
	return $prop('ABSActive') == 1;
}

function csp300_TCCut_propertySelect() {


	{
		return $prop('GameRawData.Telemetry.dcTractionControl2');
	}

}

function csp300_pitLaneMaxSpeed_propertySelect() {

	{
		return parseInt($prop('GameRawData.SessionData.WeekendInfo.TrackPitSpeedLimit'));
	}



}

var CP300V1_PIT_A = AMAZING_THEME.runtime["CP300V1_PIT_A_1"];

var CP300V1_PIT_B = AMAZING_THEME.runtime["CP300V1_PIT_B_1"];

GlobalColours.prototype.update = function() {
    this.csp300_TCcolour_Hex = '#FF006CFF';
    this.csp300_ABScolour_Hex = '#FFFFFF00';
    this.csp300_BBcolour_Hex = '#FFFF2020';
    this.csp300_MAPcolour_Hex = '#FF00FF00';
    this.csp300_IgnitionOn_Hex = '#FFFFFFFF';
    this.csp300_EngineOff_Hex = '#FFFF0018';
    this.csp300_EngineOn_Hex = '#FF00FF00';
    this.csp300_EngineStart_Hex = '#FFFF0018';
    this.csp300_Clutch_Hex = '#FFFFFFFF';
    this.csp300_Brake_Hex = '#FFFF2020';
    this.csp300_Flasher_Hex = '#FFFFFFFF';
    this.csp300_Spotter_Hex = '#FFFFFFFF';
    this.csp300_PitLimiter_Hex1 = CP300V1_PIT_A;
    this.csp300_PitLimiter_Hex2 = CP300V1_PIT_B;
    this.csp300_Lowfuel_Hex = '#FFFF2020';
    this.csp300_LiftAndCoast_Hex = '#FFFFFFFF';
};

var CP300V3_BTN1 = AMAZING_THEME.runtime["CP300V3_BTN1_1"];

var CP300V3_BTN2 = AMAZING_THEME.runtime["CP300V3_BTN2_1"];

var CP300V3_BTN3 = AMAZING_THEME.runtime["CP300V3_BTN3_1"];

var CP300V3_BTN4 = AMAZING_THEME.runtime["CP300V3_BTN4_1"];

var CP300V3_RING1 = AMAZING_THEME.runtime["CP300V3_RING1_1"];

var CP300V3_RING2 = AMAZING_THEME.runtime["CP300V3_RING2_1"];

var CP300V3_RING3 = AMAZING_THEME.runtime["CP300V3_RING3_1"];

var CP300V3_ACCENT = AMAZING_THEME.runtime["CP300V3_ACCENT_1"];

var CP300V3_PIT_A = AMAZING_THEME.runtime["CP300V3_PIT_A_1"];

var CP300V3_PIT_B = AMAZING_THEME.runtime["CP300V3_PIT_B_1"];

function cp300v3Num(v, fallback) { var n = Number(v); return isNaN(n) ? (fallback || 0) : n; }

function cp300v3Clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function cp300v3Ease(t) { t = cp300v3Clamp(t, 0, 1); return t * t * (3 - 2 * t); }

function cp300v3Empty(n) { return Array(n).fill(null); }

function cp300v3Black() { return '#FF000000'; }

function cp300v3Dim(hex, factor) {
    if (!hex || typeof hex !== 'string') return hex;
    factor = cp300v3Clamp(factor, 0, 1);
    try {
        var raw = hex.charAt(0) === '#' ? hex.substring(1) : hex;
        if (raw.length === 6) raw = 'FF' + raw;
        var a = parseInt(raw.substring(0,2), 16);
        var r = Math.round(parseInt(raw.substring(2,4), 16) * factor);
        var g = Math.round(parseInt(raw.substring(4,6), 16) * factor);
        var b = Math.round(parseInt(raw.substring(6,8), 16) * factor);
        function h(x) { return Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'); }
        return ('#' + h(a) + h(r) + h(g) + h(b)).toUpperCase();
    } catch(e) { return hex; }
}

function cp300v3Blend(a, b, t) {
    if (!a) return b;
    if (!b) return a;
    t = cp300v3Clamp(t, 0, 1);
    try {
        var ra = (a.charAt(0) === '#' ? a.substring(1) : a); if (ra.length === 6) ra = 'FF' + ra;
        var rb = (b.charAt(0) === '#' ? b.substring(1) : b); if (rb.length === 6) rb = 'FF' + rb;
        function part(s, i) { return parseInt(s.substring(i, i+2), 16); }
        function h(x) { return Math.round(cp300v3Clamp(x,0,255)).toString(16).padStart(2,'0'); }
        return ('#' + h(part(ra,0)+(part(rb,0)-part(ra,0))*t) + h(part(ra,2)+(part(rb,2)-part(ra,2))*t) + h(part(ra,4)+(part(rb,4)-part(ra,4))*t) + h(part(ra,6)+(part(rb,6)-part(ra,6))*t)).toUpperCase();
    } catch(e) { return b; }
}

function cp300v3ButtonMap() {
    // True 300 GT symmetry: left 0/2/3/4 mirrored to right 5/6/7/8.
    return [
        {led:0, inputs:[0], colour:CP300V3_BTN1, pair:0, side:'L'},
        {led:2, inputs:[1], colour:CP300V3_BTN2, pair:1, side:'L'},
        {led:3, inputs:[2], colour:CP300V3_BTN3, pair:2, side:'L'},
        {led:4, inputs:[3], colour:CP300V3_BTN4, pair:3, side:'L'},
        {led:5, inputs:[4], colour:CP300V3_BTN1, pair:0, side:'R'},
        {led:6, inputs:[5], colour:CP300V3_BTN2, pair:1, side:'R'},
        {led:7, inputs:[6], colour:CP300V3_BTN3, pair:2, side:'R'},
        {led:8, inputs:[7], colour:CP300V3_BTN4, pair:3, side:'R'}
    ];
}

function cp300v3Rings() { return [{start:9, colour:CP300V3_RING1}, {start:21, colour:CP300V3_RING2}, {start:33, colour:CP300V3_RING3}]; }

function cp300v3GameRunning() { return cp300v3Num($prop('DataCorePlugin.GameRunning'), 0) === 1 || cp300v3Num($prop('GameRunning'), 0) === 1; }

function cp300v3IgnitionOn() { return cp300v3Num($prop('EngineIgnitionOn'), 0) === 1 || cp300v3Num($prop('EngineIgnition'), 0) === 1; }

function cp300v3EngineStarted() { return cp300v3Num($prop('EngineStarted'), 0) === 1 || cp300v3Num($prop('CarStarted'), 0) === 1 || cp300v3Num($prop('EngineRunning'), 0) === 1; }

function cp300v3Rpm() { return cp300v3Num($prop('Rpms'), cp300v3Num($prop('RPMS'), 0)); }

function cp300v3InPitLane() { return cp300v3Num($prop('IsInPitLane'),0) === 1 || cp300v3Num($prop('IsInPit'),0) === 1; }

function cp300v3PitLimiter() { return cp300v3Num($prop('PitLimiterOn'),0) === 1; }

function cp300v3IgnitionOffActive() { return cp300v3GameRunning() && !cp300v3IgnitionOn() && !cp300v3EngineStarted() && cp300v3Rpm() < 450; }

function cp300v3FlagColour() {
    if (cp300v3Num($prop('RedFlag'),0) === 1) return '#FFFF0000';
    if (cp300v3Num($prop('YellowFlag'),0) === 1) return '#FFFFFF00';
    if (cp300v3Num($prop('BlueFlag'),0) === 1) return '#FF006CFF';
    if (cp300v3Num($prop('WhiteFlag'),0) === 1) return '#FFFFFFFF';
    if (cp300v3Num($prop('BlackFlag'),0) === 1) return '#FF050505';
    return null;
}

function cp300v3ApplyButtons(leds, strength, overrideColour) {
    var buttons = cp300v3ButtonMap();
    for (var i = 0; i < buttons.length; i++) leds[buttons[i].led] = cp300v3Dim(overrideColour || buttons[i].colour, strength);
}

function cp300v3TopThemeStatic(strength) {
    var leds = cp300v3Empty(12); strength = strength === undefined ? 0.72 : strength;
    for (var i = 0; i < 12; i++) {
        var col = (i < 2 || i > 9) ? CP300V3_BTN1 : ((i < 4 || i > 7) ? CP300V3_BTN2 : CP300V3_BTN3);
        leds[i] = cp300v3Dim(col, strength);
    }
    return leds;
}

function cp300v3IdlePhase(cycleMs) { return (Date.now() % cycleMs) / cycleMs; }

function cp300v3IdleTop() {
    if (cp300v3GameRunning()) return cp300v3Empty(12);
    var leds = cp300v3Empty(12);
    var p = cp300v3IdlePhase(6800);
    var breath = 0.20 + 0.62 * (0.5 + 0.5 * Math.sin(2 * Math.PI * p - Math.PI / 2));
    var head = Math.floor(p * 24);
    for (var i = 0; i < 12; i++) {
        var mirrorDist = Math.min(Math.abs(i - head), Math.abs(i - (23 - head)), 12 - Math.abs(i - (head % 12)));
        var col = (i < 2 || i > 9) ? CP300V3_BTN1 : ((i < 4 || i > 7) ? CP300V3_BTN2 : CP300V3_BTN3);
        var tick = mirrorDist <= 0 ? 0.22 : (mirrorDist === 1 ? 0.10 : 0);
        leds[i] = cp300v3Dim(col, cp300v3Clamp(breath + tick, 0, 0.92));
    }
    return leds;
}

function cp300v3EngineStartAge() {
    if (!globalThis.cp300v3Engine) globalThis.cp300v3Engine = {lastStarted:false, startAt:0, lastIgnition:false, ignitionAt:0};
    var s = globalThis.cp300v3Engine, now = Date.now();
    var ign = cp300v3IgnitionOn();
    var started = cp300v3EngineStarted() || cp300v3Rpm() > 650;
    if (ign && !s.lastIgnition) s.ignitionAt = now;
    if (started && !s.lastStarted) s.startAt = now;
    s.lastIgnition = ign; s.lastStarted = started;
    return started ? now - s.startAt : 999999;
}

function cp300v3EngineStartupTop() {
    var age = cp300v3EngineStartAge();
    if (age < 0 || age > 2350) return cp300v3Empty(12);
    var p = age / 2350;
    var leds = cp300v3Empty(12);
    var centerOrder = [5,6,4,7,3,8,2,9,1,10,0,11];
    var fill = cp300v3Ease(p) * 12.8;
    for (var k = 0; k < centerOrder.length; k++) {
        var i = centerOrder[k];
        var lit = cp300v3Clamp(fill - k, 0, 1);
        if (lit > 0) {
            var col = (k < 4) ? CP300V3_ACCENT : ((k < 8) ? CP300V3_BTN2 : CP300V3_BTN1);
            leds[i] = cp300v3Blend(cp300v3Dim(col, 0.28 + 0.64 * lit), '#FFFFFFFF', p > 0.82 ? (p - 0.82) * 0.55 : 0);
        } else leds[i] = cp300v3Black();
    }
    return leds;
}

function cp300v3EngineStartupWheel() {
    var age = cp300v3EngineStartAge();
    if (age < 0 || age > 2350) return cp300v3Empty(45);
    var p = age / 2350;
    var leds = cp300v3Empty(45);
    var buttons = cp300v3ButtonMap();
    // Mirrored arming sequence: lower pair, arrows, inner top, outer top.
    var orderPairs = [3,2,1,0];
    for (var b = 0; b < buttons.length; b++) {
        var pairIndex = orderPairs.indexOf(buttons[b].pair);
        var lit = cp300v3Clamp(cp300v3Ease(p * 1.22) * 4.6 - pairIndex, 0, 1);
        leds[buttons[b].led] = lit > 0 ? cp300v3Dim(buttons[b].colour, 0.16 + 0.78 * lit) : cp300v3Black();
    }
    var rings = cp300v3Rings();
    var fill = cp300v3Ease(p) * 12;
    for (var r = 0; r < rings.length; r++) {
        var offset = r * 2;
        for (var j = 0; j < 12; j++) {
            var radial = Math.min((j - offset + 12) % 12, (offset - j + 12) % 12);
            var lit2 = cp300v3Clamp(fill - radial, 0, 1);
            var col = rings[r].colour;
            leds[rings[r].start + j] = lit2 > 0 ? cp300v3Dim(col, 0.12 + 0.74 * lit2) : cp300v3Dim(col, 0.04);
        }
    }
    if (p > 0.86) {
        var kick = cp300v3Ease((p - 0.86) / 0.14) * 0.30;
        for (var i = 0; i < leds.length; i++) if (leds[i]) leds[i] = cp300v3Blend(leds[i], '#FFFFFFFF', kick);
    }
    return leds;
}

function cp300v3SpotterWheel() {
    var left = cp300v3Num($prop('SpotterCarLeft'),0) === 1;
    var right = cp300v3Num($prop('SpotterCarRight'),0) === 1;
    if (!left && !right) return cp300v3Empty(45);
    var leds = cp300v3Empty(45);
    var blue = '#FF008CFF';
    var pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(Date.now()/120));
    var buttons = cp300v3ButtonMap();
    for (var i = 0; i < buttons.length; i++) {
        if ((left && buttons[i].side === 'L') || (right && buttons[i].side === 'R') || (left && right)) leds[buttons[i].led] = cp300v3Dim(blue, pulse);
    }
    var rings = cp300v3Rings();
    for (var r = 0; r < rings.length; r++) {
        var sideRing = r === 0 ? 'L' : (r === 2 ? 'R' : 'C');
        if ((left && sideRing !== 'R') || (right && sideRing !== 'L') || (left && right)) {
            for (var j = 0; j < 12; j++) leds[rings[r].start + j] = cp300v3Dim(blue, 0.10 + 0.54 * pulse);
        }
    }
    return leds;
}

function cp300v3FlagsWheel() {
    var col = cp300v3FlagColour();
    if (!col) return cp300v3Empty(45);
    var leds = cp300v3Empty(45);
    var pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(Date.now()/150));
    cp300v3ApplyButtons(leds, pulse, col);
    var rings = cp300v3Rings();
    for (var r = 0; r < rings.length; r++) for (var j = 0; j < 12; j++) leds[rings[r].start + j] = cp300v3Dim(col, 0.10 + 0.58 * pulse);
    return leds;
}

function cp300v3PitTop() {
    var lane = cp300v3InPitLane();
    var limiter = cp300v3PitLimiter();
    if (!lane && !limiter) return cp300v3Empty(12);
    var leds = cp300v3Empty(12);
    var p = (Date.now() % (limiter ? 980 : 1420)) / (limiter ? 980 : 1420);
    var breath = limiter ? (0.42 + 0.58 * (0.5 + 0.5 * Math.sin(2*Math.PI*p))) : (0.28 + 0.48 * (0.5 + 0.5 * Math.sin(2*Math.PI*p - Math.PI/2)));
    for (var i = 0; i < 12; i++) {
        var pair = Math.min(i, 11-i);
        var base = (pair % 2 === 0) ? CP300V3_PIT_A : CP300V3_PIT_B;
        var phaseLift = limiter ? 0 : (0.12 * cp300v3Ease(cp300v3Clamp((p*6)-pair,0,1)));
        leds[i] = cp300v3Dim(base, cp300v3Clamp(breath + phaseLift, 0.10, 0.98));
    }
    return leds;
}

function cp300v3PitWheel() {
    var lane = cp300v3InPitLane();
    var limiter = cp300v3PitLimiter();
    if (!lane && !limiter) return cp300v3Empty(45);
    var leds = cp300v3Empty(45);
    var p = (Date.now() % (limiter ? 980 : 1420)) / (limiter ? 980 : 1420);
    var pulse = limiter ? (0.46 + 0.52 * (0.5 + 0.5 * Math.sin(2*Math.PI*p))) : (0.30 + 0.46 * (0.5 + 0.5 * Math.sin(2*Math.PI*p - Math.PI/2)));
    var buttons = cp300v3ButtonMap();
    for (var i = 0; i < buttons.length; i++) {
        // Clean cyan/orange gate: left outer and right inner orange, opposite pair cyan, all mirrored by pair.
        var col = (buttons[i].pair % 2 === 0) ? CP300V3_PIT_A : CP300V3_PIT_B;
        leds[buttons[i].led] = cp300v3Dim(col, pulse);
    }
    var rings = cp300v3Rings();
    for (var r = 0; r < rings.length; r++) {
        for (var j = 0; j < 12; j++) {
            var quadrant = (j < 3 || j > 8);
            var col2 = quadrant ? CP300V3_PIT_A : CP300V3_PIT_B;
            var local = pulse * (quadrant ? 0.82 : 0.48);
            if (limiter) local += (j % 3 === 0 ? 0.10 : 0);
            leds[rings[r].start + j] = cp300v3Dim(col2, cp300v3Clamp(local, 0.08, 0.92));
        }
    }
    return leds;
}

function cp300v3TopOverlay() {

    if (cp300v3PitLimiter() || cp300v3InPitLane()) return cp300v3PitTop();
    var start = cp300v3EngineStartupTop();
    for (var e = 0; e < start.length; e++) if (start[e] !== null) return start;
    if (cp300v3IgnitionOffActive()) return cp300v3TopThemeStatic(0.50);
    return cp300v3IdleTop();
}

function cp300v4Num(v, fallback) { var n = Number(v); return isNaN(n) ? (fallback || 0) : n; }

function cp300v4Clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function cp300v4EaseInOut(t) { t = cp300v4Clamp(t, 0, 1); return 0.5 - 0.5 * Math.cos(t * Math.PI); }

function cp300v4Smooth(t) { t = cp300v4Clamp(t,0,1); return t*t*(3-2*t); }

function cp300v4Empty(n) { return Array(n).fill(null); }

function cp300v4Black() { return '#FF000000'; }

function cp300v4HexChannels(color) {
    if (!color) return [255,0,0,0];
    var hex = String(color).replace('#','');
    if (hex.length === 6) hex = 'FF' + hex;
    return [
        parseInt(hex.substring(0,2),16),
        parseInt(hex.substring(2,4),16),
        parseInt(hex.substring(4,6),16),
        parseInt(hex.substring(6,8),16)
    ];
}

function cp300v4HexFromChannels(a,r,g,b) {
    function h(v) { var s = Math.round(cp300v4Clamp(v,0,255)).toString(16).toUpperCase(); return s.length === 1 ? '0' + s : s; }
    return '#' + h(a) + h(r) + h(g) + h(b);
}

function cp300v4Blend(a,b,ratio) {
    ratio = cp300v4Clamp(ratio,0,1);
    var ca = cp300v4HexChannels(a), cb = cp300v4HexChannels(b);
    return cp300v4HexFromChannels(
        ca[0] + (cb[0]-ca[0]) * ratio,
        ca[1] + (cb[1]-ca[1]) * ratio,
        ca[2] + (cb[2]-ca[2]) * ratio,
        ca[3] + (cb[3]-ca[3]) * ratio
    );
}

function cp300v4Dim(colour, factor) { return cp300v4Blend('#FF000000', colour, cp300v4Clamp(factor,0,1)); }

function cp300v4AnyLit(arr) { for (var i=0; i<arr.length; i++) if (arr[i] !== null && arr[i] !== undefined) return true; return false; }

function cp300v4ButtonMap() {
    // Local wheel LED array: buttons are 0..7, rotary rings start at 8/20/32.
    // Layout pairs are spatial: top outer, top inner, middle arrow, bottom.
    return [
        {led:0, inputs:[0], colour:CP300V3_BTN1, pair:0, side:'L', row:'topOuter'},
        {led:1, inputs:[1], colour:CP300V3_BTN2, pair:1, side:'L', row:'topInner'},
        {led:2, inputs:[2], colour:CP300V3_BTN3, pair:2, side:'L', row:'middle'},
        {led:3, inputs:[3], colour:CP300V3_BTN4, pair:3, side:'L', row:'bottom'},
        {led:4, inputs:[4], colour:CP300V3_BTN1, pair:0, side:'R', row:'topOuter'},
        {led:5, inputs:[5], colour:CP300V3_BTN2, pair:1, side:'R', row:'topInner'},
        {led:6, inputs:[6], colour:CP300V3_BTN3, pair:2, side:'R', row:'middle'},
        {led:7, inputs:[7], colour:CP300V3_BTN4, pair:3, side:'R', row:'bottom'}
    ];
}

function cp300v4Rings() { return [{start:8, colour:CP300V3_RING1, side:'L'}, {start:20, colour:CP300V3_RING2, side:'C'}, {start:32, colour:CP300V3_RING3, side:'R'}]; }

function cp300v4ButtonThemeAt(i) {
    var map = cp300v4ButtonMap();
    for (var k=0; k<map.length; k++) if (map[k].led === i) return map[k].colour;
    return CP300V3_ACCENT || '#FFFFFFFF';
}

function cp300v4OrderPosition(order, index) { for (var i=0; i<order.length; i++) if (order[i] === index) return i; return index; }

function cp300v4BreathState(cycleMs) {
    cycleMs = cycleMs || 9200;
    var breathMs = 1650;
    var buildMs = (cycleMs - breathMs * 2) / 2;
    var t = Date.now() % cycleMs;
    var state = {breathMs:breathMs, buildMs:buildMs, phase:'breathDownA', phaseTime:t, direction:'bottomTop'};
    if (t < breathMs) { state.phase='breathDownA'; state.phaseTime=t; state.direction='bottomTop'; }
    else if (t < breathMs + buildMs) { state.phase='buildBottomTop'; state.phaseTime=t-breathMs; state.direction='bottomTop'; }
    else if (t < breathMs*2 + buildMs) { state.phase='breathDownB'; state.phaseTime=t-breathMs-buildMs; state.direction='topBottom'; }
    else { state.phase='buildTopBottom'; state.phaseTime=t-breathMs*2-buildMs; state.direction='topBottom'; }
    return state;
}

function cp300v4ButtonOrderBottomToTop() { return [3,7,2,6,1,5,0,4]; }

function cp300v4ButtonOrderTopToBottom() { return [0,4,1,5,2,6,3,7]; }

function cp300v4BreathWave(count, orderBottom, orderTop, renderer, maxIntensity, minIntensity, cycleMs) {
    var leds = cp300v4Empty(count);
    maxIntensity = maxIntensity === undefined ? 0.98 : maxIntensity;
    minIntensity = minIntensity === undefined ? 0.0 : minIntensity;
    var state = cp300v4BreathState(cycleMs || 9200);
    var order = state.direction === 'topBottom' ? orderTop : orderBottom;
    for (var i=0; i<count; i++) {
        var intensity = minIntensity;
        if (state.phase === 'breathDownA' || state.phase === 'breathDownB') {
            intensity = minIntensity + (maxIntensity - minIntensity) * (1 - cp300v4EaseInOut(state.phaseTime / state.breathMs));
        } else {
            var position = cp300v4OrderPosition(order, i);
            var head = (state.phaseTime / state.buildMs) * (count + 1.2);
            var local = cp300v4Clamp(head - position, 0, 1);
            intensity = minIntensity + (maxIntensity - minIntensity) * cp300v4EaseInOut(local);
            var leaderDistance = Math.abs(head - position);
            if (leaderDistance < 0.58 && intensity > 0.002) {
                var shimmer = (0.58 - leaderDistance) / 0.58;
                leds[i] = cp300v4Blend(renderer(i, count, intensity), '#FFFFFFFF', shimmer * 0.16);
                continue;
            }
        }
        leds[i] = intensity <= 0.002 ? cp300v4Black() : renderer(i, count, intensity);
    }
    return leds;
}

function cp300v4IdleButtonArray() {
    return cp300v4BreathWave(8, cp300v4ButtonOrderBottomToTop(), cp300v4ButtonOrderTopToBottom(), function(i,c,intensity) {
        return cp300v4Dim(cp300v4ButtonThemeAt(i), intensity);
    }, 0.98, 0.0, 9200);
}

function cp300v4IdleRingIntensityAt(index, ringIndex) {
    var state = cp300v4BreathState(9200);
    var maxIntensity = 0.64, minIntensity = 0.02;
    if (state.phase === 'breathDownA' || state.phase === 'breathDownB') {
        return minIntensity + (maxIntensity - minIntensity) * (1 - cp300v4EaseInOut(state.phaseTime / state.breathMs));
    }
    var order = state.direction === 'topBottom' ? [0,11,1,10,2,9,3,8,4,7,5,6] : [5,6,4,7,3,8,2,9,1,10,0,11];
    var pos = cp300v4OrderPosition(order, index);
    var head = (state.phaseTime / state.buildMs) * (12 + 1.2);
    var local = cp300v4Clamp(head - pos, 0, 1);
    var leader = Math.abs(head - pos) < 0.55 ? 0.12 : 0;
    return cp300v4Clamp(minIntensity + (maxIntensity - minIntensity) * cp300v4EaseInOut(local) + leader, 0, 0.72);
}

function cp300v4IdleWheel() {
    var leds = cp300v4Empty(44);
    var buttons = cp300v4IdleButtonArray();
    for (var i=0; i<8; i++) leds[i] = buttons[i];
    var rings = cp300v4Rings();
    for (var r=0; r<rings.length; r++) {
        for (var j=0; j<12; j++) {
            var strength = cp300v4IdleRingIntensityAt(j, r);
            var colour = rings[r].colour;
            if (j === 0 || j === 11 || j === 1) colour = cp300v4Blend(colour, CP300V3_ACCENT || '#FFFFFFFF', 0.10);
            leds[rings[r].start + j] = cp300v4Dim(colour, strength);
        }
    }
    return leds;
}

function cp300v4StaticWheel(strength) {
    strength = strength === undefined ? 0.88 : strength;
    var leds = cp300v4Empty(44);
    var buttons = cp300v4ButtonMap();
    for (var b=0; b<buttons.length; b++) leds[buttons[b].led] = cp300v4Dim(buttons[b].colour, strength);
    var rings = cp300v4Rings();
    for (var r=0; r<rings.length; r++) for (var j=0; j<12; j++) leds[rings[r].start+j] = cp300v4Dim(rings[r].colour, 0.46);
    return leds;
}

function cp300v4GameRunning() { return cp300v4Num($prop('DataCorePlugin.GameRunning'),0) === 1 || cp300v4Num($prop('GameRunning'),0) === 1; }

function cp300v4Rpm() { return cp300v4Num($prop('Rpms'), cp300v4Num($prop('RPMS'), 0)); }

function cp300v4Speed() { return Math.abs(cp300v4Num($prop('SpeedKmh'), cp300v4Num($prop('Speed'), 0))); }

function cp300v4PitLimiter() { return cp300v4Num($prop('PitLimiterOn'),0) === 1; }

function cp300v4PitCyan() { return '#FF00FFF0'; }

function cp300v4PitOrange() { return '#FFFF6A00'; }

function cp300v4ReadButton(inputs) {
    for (var i=0; i<inputs.length; i++) {
        try { if (getcontrollerbuttonstate('0x3514,0x000E', inputs[i])) return true; } catch(e) {}
    }
    return false;
}

function cp300v4ApplyButtonPress(base) {
    if (!globalThis.cp300v4Buttons) globalThis.cp300v4Buttons = {};
    var now = Date.now();
    var buttons = cp300v4ButtonMap();
    for (var i=0; i<buttons.length; i++) {
        var b = buttons[i], key = 'b' + b.led;
        var st = globalThis.cp300v4Buttons[key] || {down:false, pressAt:0, releaseAt:0, quickPulseAt:0, holdRelease:false};
        var down = cp300v4ReadButton(b.inputs);
        if (down && !st.down) { st.pressAt = now; st.quickPulseAt = 0; st.holdRelease = false; }
        if (!down && st.down) {
            var held = now - st.pressAt;
            st.releaseAt = now;
            st.holdRelease = held > 520;
            if (!st.holdRelease) st.quickPulseAt = now;
        }
        st.down = down; globalThis.cp300v4Buttons[key] = st;
        var brightness = null;
        if (down) {
            var settle = cp300v4Smooth(cp300v4Clamp((now - st.pressAt) / 420,0,1));
            brightness = 0.95 * (1 - settle) + 0.10 * settle;
        } else if (st.holdRelease && now - st.releaseAt < 540) {
            brightness = 0.10 + 0.86 * cp300v4Smooth((now - st.releaseAt) / 540);
        } else if (st.quickPulseAt && now - st.quickPulseAt < 1120) {
            var q = (now - st.quickPulseAt) / 1120;
            brightness = 0.10 + 0.86 * Math.abs(Math.cos(2 * Math.PI * q));
        }
        if (brightness !== null) base[b.led] = cp300v4Dim(b.colour, brightness);
    }
    return base;
}

function cp300v4IgnitionWheel() {
    var leds = cp300v4StaticWheel(0.32);
    var p = (Date.now() % 2600) / 2600;
    var pulse = 0.26 + 0.50 * (0.5 + 0.5 * Math.sin(2*Math.PI*p - Math.PI/2));
    var buttons = cp300v4ButtonMap();
    for (var b=0; b<buttons.length; b++) leds[buttons[b].led] = cp300v4Dim(buttons[b].colour, pulse);
    var rings = cp300v4Rings();
    var fill = Math.floor(cp300v4Smooth(p) * 6);
    for (var r=0; r<rings.length; r++) for (var j=0; j<12; j++) {
        var d = Math.min(j, 11-j);
        leds[rings[r].start+j] = cp300v4Dim(rings[r].colour, d <= fill ? 0.70 : 0.12);
    }
    return leds;
}

function cp300v5SafeProp(name, fallback) { try { var v = $prop(name); return (v === undefined || v === null || v === '' || v === '--') ? fallback : v; } catch(e) { return fallback; } }

function cp300v5BoolProp(name) { var v = cp300v5SafeProp(name, 0); return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true'; }

function cp300v5NumProp(name, fallback) { return cp300v4Num(cp300v5SafeProp(name, fallback), fallback); }

function cp300v5FirstValid(names, min, max) { for (var i=0; i<names.length; i++) { var n = cp300v5NumProp(names[i], NaN); if (!isNaN(n) && n > min && (max === undefined || n < max)) return n; } return 0; }

function cp300v5GameRunning() { return cp300v4GameRunning(); }

function cp300v5InPitLane() {
    return cp300v5BoolProp('IsInPitLane') ||
           cp300v5BoolProp('IsInPit') ||
           cp300v5BoolProp('DataCorePlugin.GameData.IsInPitLane') ||
           cp300v5BoolProp('DataCorePlugin.GameData.NewData.IsInPitLane') ||
           cp300v5BoolProp('GameRawData.IsInPitLane');
}

function cp300v5PitLimiterOn() { return cp300v5BoolProp('PitLimiterOn') || cp300v5BoolProp('DataCorePlugin.GameData.NewData.PitLimiterOn'); }

function cp300v5PitLimitKmh() {
    try { if (typeof csp_pitLaneMaxSpeed_propertySelect === 'function') { var legacy = Number(csp_pitLaneMaxSpeed_propertySelect()); if (!isNaN(legacy) && legacy > 5 && legacy < 200) return legacy; } } catch(e) {}
    var direct = cp300v5FirstValid(['PitSpeedLimit', 'PitLaneSpeedLimit', 'PitLimiterSpeed', 'SpeedLimiterSpeed', 'GameRawData.SessionData.WeekendInfo.TrackPitSpeedLimit', 'GameRawData.SessionPitSpeedLimit'], 5, 200);
    if (direct > 0) {
        // Raceroom style value can be m/s. If tiny, convert to km/h.
        if (direct > 5 && direct < 35 && false) return direct * 3.6;
        return direct;
    }
    var game = "IRacing";


    return 0;
}

function cp300v5PitSpeedState() {
    var limit = cp300v5PitLimitKmh();
    var speed = cp300v4Speed();
    if (limit <= 0) return {known:false, speeding:false, speed:speed, limit:0, margin:0};
    var margin = speed - limit;
    return {known:true, speeding:margin > 1.0, speed:speed, limit:limit, margin:margin};
}

CP300V3_BTN1 = AMAZING_THEME.runtime["CP300V3_BTN1_2"];

CP300V3_BTN2 = AMAZING_THEME.runtime["CP300V3_BTN2_2"];

CP300V3_BTN3 = AMAZING_THEME.runtime["CP300V3_BTN3_2"];

CP300V3_BTN4 = AMAZING_THEME.runtime["CP300V3_BTN4_2"];

CP300V3_RING1 = AMAZING_THEME.runtime["CP300V3_RING1_2"];

CP300V3_RING2 = AMAZING_THEME.runtime["CP300V3_RING2_2"];

CP300V3_RING3 = AMAZING_THEME.runtime["CP300V3_RING3_2"];

CP300V3_ACCENT = AMAZING_THEME.runtime["CP300V3_ACCENT_2"];

CP300V3_PIT_A = AMAZING_THEME.runtime["CP300V3_PIT_A_2"];

CP300V3_PIT_B = AMAZING_THEME.runtime["CP300V3_PIT_B_2"];

function cp300v6SafeProp(name, fallback) { try { var v = $prop(name); return (v === undefined || v === null || v === '' || v === '--') ? fallback : v; } catch(e) { return fallback; } }

function cp300v6Num(v, fallback) { var n = Number(v); return isNaN(n) || !isFinite(n) ? (fallback || 0) : n; }

function cp300v6NumProp(name, fallback) { return cp300v6Num(cp300v6SafeProp(name, fallback), fallback); }

function cp300v6BoolValue(v) { if (v === true || v === 1) return true; var s = String(v).toLowerCase(); return s === 'true' || s === '1' || s === 'yes' || s === 'on'; }

function cp300v6BoolProp(name) { return cp300v6BoolValue(cp300v6SafeProp(name, false)); }

function cp300v6Known(name) { var v = cp300v6SafeProp(name, null); if (v === null || v === undefined) return false; var s = String(v).toLowerCase(); return s !== '' && s !== '--' && s !== 'nan' && s !== 'null' && s !== 'undefined'; }

function cp300v6FirstNumber(names, min, max) {
    for (var i=0; i<names.length; i++) {
        var v = cp300v6NumProp(names[i], NaN);
        if (!isNaN(v) && isFinite(v) && v > min && (max === undefined || v < max)) return v;
    }
    return 0;
}

function cp300v6Clamp(v,a,b) { return Math.max(a, Math.min(b, v)); }

function cp300v6Ease(t) { return 0.5 - 0.5 * Math.cos(cp300v6Clamp(t,0,1) * Math.PI); }

function cp300v6Pulse(ms, lo, hi) { return lo + (hi-lo) * (0.5 + 0.5 * Math.sin((Date.now()/ms) * Math.PI * 2)); }

function cp300v6GameRunning() { return cp300v5GameRunning ? cp300v5GameRunning() : cp300v4GameRunning(); }

function cp300v6Rpm() { return cp300v4Rpm(); }

function cp300v6Speed() { return cp300v4Speed(); }

function cp300v6Rings() { return cp300v4Rings(); }

function cp300v6PitLimiterOn() { return cp300v5PitLimiterOn ? cp300v5PitLimiterOn() : cp300v4PitLimiter(); }

function cp300v6InPitLane() { return cp300v5InPitLane ? cp300v5InPitLane() : cp300v6BoolProp('IsInPitLane'); }

function cp300v6PitActive() { return cp300v6PitLimiterOn() || cp300v6InPitLane(); }

function cp300v6PitSpeedState() { return cp300v5PitSpeedState ? cp300v5PitSpeedState() : {known:false,speeding:false,speed:cp300v6Speed(),limit:0,margin:0}; }

function cp300v6PitButtonsLimiter(leds) {
    var cyan=cp300v4PitCyan(), orange=cp300v4PitOrange(), green='#FF00FF00', white='#FFFFFFFF';
    var pairCols=[cyan,orange,orange,cyan];
    for (var i=0;i<8;i++) leds[i]=cp300v4Dim(pairCols[i%4],0.26);
    var p=Math.floor(Date.now()/185)%8; var cursor=p<4?p:7-p;
    var L=[3,2,1,0], R=[7,6,5,4];
    for (var s=0;s<4;s++) {
        var d=Math.abs(s-cursor); var col=d===0?cp300v4Blend(orange,white,0.12):(d===1?orange:cyan); var st=d===0?0.90:(d===1?0.46:0.20);
        leds[L[s]]=cp300v4Dim(col,st); leds[R[s]]=cp300v4Dim(col,st);
    }
    leds[2]=cp300v4Blend(leds[2],green,0.34); leds[6]=cp300v4Blend(leds[6],green,0.34);
    return leds;
}

function cp300v6PitButtonsLane(leds) {
    var state=cp300v6PitSpeedState(); var cyan=cp300v4PitCyan(), orange=cp300v4PitOrange(), red='#FFFF0000', green='#FF00FF00';
    for (var i=0;i<8;i++) leds[i]=cp300v4Dim(cp300v4ButtonThemeAt(i),0.22);
    if (state.known && state.speeding) {
        var on=Math.floor(Date.now()/96)%2===0; for (var r=0;r<8;r++) leds[r]=on?cp300v4Dim(red,0.92):cp300v4Dim(orange,0.18); return leds;
    }
    leds[0]=cp300v4Dim(cyan,0.54); leds[4]=cp300v4Dim(cyan,0.54);
    leds[1]=cp300v4Dim(orange,0.48); leds[5]=cp300v4Dim(orange,0.48);
    leds[2]=cp300v4Dim(cyan,0.64); leds[6]=cp300v4Dim(cyan,0.64);
    leds[3]=cp300v4Dim(orange,0.58); leds[7]=cp300v4Dim(orange,0.58);
    if (state.known) { var gp=cp300v6Pulse(620,0.28,0.72); leds[0]=cp300v4Blend(leds[0],green,gp); leds[4]=cp300v4Blend(leds[4],green,gp); }
    return leds;
}

function cp300v6SettingTo12(v) {
    v = cp300v6Num(v, 0);
    if (v > 0 && v < 1) return Math.round(v * 12);
    if (v > 12 && v <= 100) return Math.round((v/100) * 12);
    return Math.round(cp300v6Clamp(v,0,12));
}

function cp300v6AbsValue() {
    var direct = cp300v6FirstNumber(['ABSLevel', 'ABS', 'GameRawData.Telemetry.dcABS', 'DataCorePlugin.GameData.NewData.ABSLevel'], -0.001, 101);
    return cp300v6SettingTo12(direct);
}

function cp300v6TcValue() {
    var direct = cp300v6FirstNumber(['TCLevel', 'TC', 'TractionControl', 'GameRawData.Telemetry.dcTractionControl', 'DataCorePlugin.GameData.NewData.TCLevel'], -0.001, 101);
    if (direct <= 0) { try { direct = Number(csp300_TCCut_propertySelect()) || 0; } catch(e) {} }
    return cp300v6SettingTo12(direct);
}

function cp300v6AbsActive() {
    try { if (typeof csp300_ABSActive === 'function' && csp300_ABSActive()) return true; } catch(e) {}
    if (cp300v6BoolProp('ABSActive') || cp300v6BoolProp('DataCorePlugin.GameData.NewData.ABSActive') || false) return true;
    var force = cp300v6FirstNumber([], 0.01, 999);
    return force > 0;
}

function cp300v6BrakeInput01() {
    var v = cp300v6FirstNumber(['Brake', 'BrakePedal', 'BrakeInput', 'DataCorePlugin.GameData.NewData.Brake'], -0.001, 101);
    if (v > 1.001) v = v / 100;
    return cp300v6Clamp(v,0,1);
}

function cp300v6PaintSettingRing(leds, ringStart, filledCount, fillColour, activeFlash) {
    var white = '#FFFFFFFF';
    var flashOn = Math.floor(Date.now()/80)%2===0;
    for (var j=0;j<12;j++) {
        if (activeFlash) leds[ringStart+j] = flashOn ? cp300v4Dim(fillColour,1.0) : cp300v4Dim(fillColour,0.18);
        else leds[ringStart+j] = j < filledCount ? cp300v4Dim(fillColour,0.92) : cp300v4Dim(white,0.54);
    }
}

function cp300v6PaintBrakeRing(leds, ringStart) {
    var red = '#FFFF0000', white = '#FFFFFFFF';
    var order = [5,6,4,7,3,8,2,9,1,10,0,11];
    var brake = cp300v6BrakeInput01();
    var fill = Math.round(brake * 12);
    for (var j=0;j<12;j++) leds[ringStart+j] = cp300v4Dim(white,0.42);
    for (var k=0;k<fill;k++) {
        var idx = order[k];
        if (idx !== undefined) leds[ringStart+idx] = cp300v4Dim(red,0.30 + 0.68*brake);
    }
    if (brake > 0.02 && fill < 1) leds[ringStart+5] = cp300v4Dim(red,0.38);
}

function cp300v6ApplyRingTelemetry(leds) {
    var rings = cp300v6Rings();
    cp300v6PaintSettingRing(leds, rings[0].start, cp300v6AbsValue(), '#FFFFFF00', cp300v6AbsActive());
    cp300v6PaintBrakeRing(leds, rings[1].start);
    cp300v6PaintSettingRing(leds, rings[2].start, cp300v6TcValue(), '#FF006CFF', cp300v6TcActive());
    return leds;
}

function cp300v6EngineStarted() {
    if (cp300v6Known('EngineStarted')) return cp300v6BoolProp('EngineStarted');
    if (cp300v6Known('EngineRunning')) return cp300v6BoolProp('EngineRunning');
    if (cp300v6Known('DataCorePlugin.GameData.NewData.EngineStarted')) return cp300v6BoolProp('DataCorePlugin.GameData.NewData.EngineStarted');
    if (cp300v6Known('DataCorePlugin.GameData.NewData.EngineRunning')) return cp300v6BoolProp('DataCorePlugin.GameData.NewData.EngineRunning');
    if (cp300v6Known('DataCorePlugin.GameRawData.EngineStarted')) return cp300v6BoolProp('DataCorePlugin.GameRawData.EngineStarted');
    if (cp300v6Known('GameRawData.EngineStarted')) return cp300v6BoolProp('GameRawData.EngineStarted');
    return cp300v6GameRunning() && cp300v6Rpm() > 350;
}

function cp300v6IgnitionOn() {
    if (cp300v6Known('EngineIgnitionOn')) return cp300v6BoolProp('EngineIgnitionOn');
    if (cp300v6Known('EngineIgnition')) return cp300v6BoolProp('EngineIgnition');
    if (cp300v6Known('DataCorePlugin.GameData.NewData.EngineIgnitionOn')) return cp300v6BoolProp('DataCorePlugin.GameData.NewData.EngineIgnitionOn');
    if (cp300v6Known('GameRawData.EngineIgnitionOn')) return cp300v6BoolProp('GameRawData.EngineIgnitionOn');
    return cp300v6GameRunning() && !cp300v6EngineStarted() && cp300v6Rpm() < 450;
}

function cp300v6StartupProgress(durationMs) {
    if (!globalThis.cp300v6Engine) globalThis.cp300v6Engine = {lastStarted:cp300v6EngineStarted(), lastRpm:cp300v6Rpm(), startupAt:0, lastIgn:cp300v6IgnitionOn(), ignitionAt:0};
    var m=globalThis.cp300v6Engine, now=Date.now();
    var started=cp300v6EngineStarted();
    var rpm=cp300v6Rpm();
    var ign=cp300v6IgnitionOn();
    if (ign && !m.lastIgn) m.ignitionAt = now;
    if ((started && !m.lastStarted) || (rpm > 550 && m.lastRpm < 220)) m.startupAt = now;
    if (!started && rpm < 220) m.startupAt = 0;
    m.lastStarted=started; m.lastRpm=rpm; m.lastIgn=ign;
    if (m.startupAt > 0) { var age=now-m.startupAt; if (age>=0 && age<durationMs) return age/durationMs; }
    return -1;
}

function cp300v6IgnitionProgress(durationMs) {
    cp300v6StartupProgress(1); // updates ignition memory too
    var m=globalThis.cp300v6Engine; if (!m || !m.ignitionAt) return -1;
    var age=Date.now()-m.ignitionAt;
    return age>=0 && age<durationMs ? age/durationMs : -1;
}

function cp300v6StartupWheel() {
    var p=cp300v6StartupProgress(3050); if (p < 0 || p < 0.04) return cp300v4Empty(44);
    var leds=cp300v4StaticWheel(0.06); var order=[3,7,2,6,1,5,0,4];
    var wake=cp300v6Ease(cp300v6Clamp((p-0.04)/0.68,0,1))*(order.length+0.6);
    var settle=cp300v6Ease(cp300v6Clamp((p-0.70)/0.30,0,1));
    for (var i=0;i<order.length;i++) { var idx=order[i]; var lit=cp300v6Clamp(wake-i,0,1); if (lit>0) leds[idx]=cp300v4Blend(cp300v4Dim(cp300v4ButtonThemeAt(idx),0.16+lit*0.80),'#FFFFFFFF',Math.max(0,1-Math.abs(wake-i))*0.12); }
    var rings=cp300v6Rings(), ringOrder=[5,6,4,7,3,8,2,9,1,10,0,11];
    var rf=cp300v6Ease(cp300v6Clamp((p-0.12)/0.62,0,1))*13;
    for (var r=0;r<rings.length;r++) for (var j=0;j<12;j++) { var pos=cp300v4OrderPosition(ringOrder,j); var lit2=cp300v6Clamp(rf-pos-r*0.28,0,1); leds[rings[r].start+j]=lit2>0?cp300v4Dim(rings[r].colour,0.10+0.72*lit2):cp300v4Dim(rings[r].colour,0.03); }
    if (settle>0) { for (var b=0;b<8;b++) leds[b]=cp300v4Blend(leds[b]||cp300v4Black(),cp300v4Dim(cp300v4ButtonThemeAt(b),0.96),settle); leds=cp300v6ApplyRingTelemetry(leds); }
    return leds;
}

function cp300v6IgnitionWheel() {
    var p=cp300v6IgnitionProgress(1500); if (p<0) return cp300v4Empty(44);
    var leds=cp300v4StaticWheel(0.08); var order=[3,7,2,6,1,5,0,4]; var fill=cp300v6Ease(p)*(order.length+0.8);
    for (var i=0;i<order.length;i++) { var idx=order[i]; var lit=cp300v6Clamp(fill-i,0,1); leds[idx]=lit>0?cp300v4Dim(cp300v4ButtonThemeAt(idx),0.16+0.76*lit):cp300v4Black(); }
    var rings=cp300v6Rings(); for (var r=0;r<rings.length;r++) for (var j=0;j<12;j++) { var d=Math.min(j,11-j); var lit2=cp300v6Clamp(p*6.6-d-r*0.18,0,1); leds[rings[r].start+j]=lit2>0?cp300v4Dim(rings[r].colour,0.10+0.58*lit2):cp300v4Dim(rings[r].colour,0.03); }
    return leds;
}

function cp300v6DrivingActive() { return cp300v6GameRunning() && (cp300v6EngineStarted() || cp300v6Rpm() > 450 || cp300v6Speed() > 2 || cp300v6PitActive()); }

function cp300v6IdleActive() { return !cp300v6GameRunning() || (cp300v6GameRunning() && !cp300v6DrivingActive() && !cp300v6IgnitionOn()); }

function cp300v6IgnitionOnlyActive() { return cp300v6GameRunning() && cp300v6IgnitionOn() && !cp300v6EngineStarted() && cp300v6Rpm() < 650; }

function cp300v7PairBrakeLevel01() { return cp300v6BrakeInput01 ? cp300v6BrakeInput01() : 0; }

function cp300v7PaintBrakeRing(leds, ringStart) {
    var red = '#FFFF0000', white = '#FFFFFFFF';
    var brake = cp300v7PairBrakeLevel01();
    var pairs = [[5,6],[4,7],[3,8],[2,9],[1,10],[0,11]];
    var progress = cp300v6Clamp(brake * pairs.length, 0, pairs.length);
    var fullPairs = Math.floor(progress);
    var partial = progress - fullPairs;
    var warn = brake >= 0.90;
    var flash = Math.floor(Date.now()/92)%2===0;

    for (var j=0; j<12; j++) leds[ringStart+j] = cp300v4Dim(white, 0.42);

    for (var p=0; p<pairs.length; p++) {
        var lit = p < fullPairs ? 1 : (p === fullPairs ? partial : 0);
        if (brake > 0.015 && p === 0 && lit < 0.22) lit = 0.22;
        if (lit <= 0) continue;
        var strength = 0.28 + 0.68 * cp300v6Clamp(lit,0,1);
        if (warn) strength = flash ? 1.0 : 0.18;
        leds[ringStart + pairs[p][0]] = cp300v4Dim(red, strength);
        leds[ringStart + pairs[p][1]] = cp300v4Dim(red, strength);
    }

    if (warn && !flash) {
        for (var k=0; k<12; k++) leds[ringStart+k] = cp300v4Blend(leds[ringStart+k], white, 0.10);
    }
}

function cp300v7ApplyRingTelemetry(leds) {
    var rings = cp300v6Rings();
    cp300v6PaintSettingRing(leds, rings[0].start, cp300v6AbsValue(), '#FFFFFF00', cp300v6AbsActive());
    cp300v7PaintBrakeRing(leds, rings[1].start);
    cp300v6PaintSettingRing(leds, rings[2].start, cp300v6TcValue(), '#FF006CFF', cp300v6TcActive());
    return leds;
}

function cp300v7StartupWheel() {
    var p = cp300v6StartupProgress(3050); if (p < 0 || p < 0.04) return cp300v4Empty(44);
    var leds=cp300v4StaticWheel(0.06); var order=[3,7,2,6,1,5,0,4];
    var wake=cp300v6Ease(cp300v6Clamp((p-0.04)/0.68,0,1))*(order.length+0.6);
    var settle=cp300v6Ease(cp300v6Clamp((p-0.70)/0.30,0,1));
    for (var i=0;i<order.length;i++) { var idx=order[i]; var lit=cp300v6Clamp(wake-i,0,1); if (lit>0) leds[idx]=cp300v4Blend(cp300v4Dim(cp300v4ButtonThemeAt(idx),0.16+lit*0.80),'#FFFFFFFF',Math.max(0,1-Math.abs(wake-i))*0.12); }
    var rings=cp300v6Rings(), ringOrder=[5,6,4,7,3,8,2,9,1,10,0,11];
    var rf=cp300v6Ease(cp300v6Clamp((p-0.12)/0.62,0,1))*13;
    for (var r=0;r<rings.length;r++) for (var j=0;j<12;j++) { var pos=cp300v4OrderPosition(ringOrder,j); var lit2=cp300v6Clamp(rf-pos-r*0.28,0,1); leds[rings[r].start+j]=lit2>0?cp300v4Dim(rings[r].colour,0.10+0.72*lit2):cp300v4Dim(rings[r].colour,0.03); }
    if (settle>0) { for (var b=0;b<8;b++) leds[b]=cp300v4Blend(leds[b]||cp300v4Black(),cp300v4Dim(cp300v4ButtonThemeAt(b),0.96),settle); leds=cp300v7ApplyRingTelemetry(leds); }
    return leds;
}

function cp300v8PaintPitLimiterRings(leds) {
    var rings=cp300v6Rings();
    var cyan=cp300v4PitCyan(), orange=cp300v4PitOrange(), green='#FF00FF00', white='#FFFFFFFF';
    var tick=Math.floor(Date.now()/165)%12;
    for (var r=0;r<rings.length;r++) {
        for (var j=0;j<12;j++) {
            var d=Math.min(Math.abs(j-tick),12-Math.abs(j-tick));
            var col = d===0 ? cp300v4Blend(orange,white,0.18) : (d===1 ? cp300v4Blend(orange,cyan,0.20) : cyan);
            var str = d===0 ? 1.0 : (d===1 ? 0.88 : 0.64);
            if (j===5 || j===6) col = cp300v4Blend(col, green, 0.34);
            leds[rings[r].start+j] = cp300v4Dim(col, str);
        }
    }
    return leds;
}

function cp300v8PaintPitLaneRings(leds) {
    var rings=cp300v6Rings();
    var state=cp300v6PitSpeedState();
    var red='#FFFF0000', green='#FF00FF00', cyan=cp300v4PitCyan(), orange=cp300v4PitOrange(), white='#FFFFFFFF';
    if (state.known && state.speeding) {
        var on=Math.floor(Date.now()/86)%2===0;
        for (var r=0;r<rings.length;r++) for (var j=0;j<12;j++) leds[rings[r].start+j]=on?cp300v4Dim(red,1.0):cp300v4Dim(orange,0.62);
        return leds;
    }
    if (state.known) {
        var pulse = 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(Date.now()/260));
        for (var rr=0;rr<rings.length;rr++) for (var k=0;k<12;k++) {
            var marker=(k===5||k===6||k===0||k===11);
            var col=marker?cp300v4Blend(green,white,0.18):green;
            leds[rings[rr].start+k]=cp300v4Dim(col,pulse);
        }
        return leds;
    }
    var cursor=Math.floor(Date.now()/195)%12;
    for (var a=0;a<rings.length;a++) for (var b=0;b<12;b++) {
        var d=Math.min(Math.abs(b-cursor),12-Math.abs(b-cursor));
        var col=d===0?cp300v4Blend(orange,white,0.14):(d===1?orange:cyan);
        var str=d===0?1.0:(d===1?0.82:0.56);
        leds[rings[a].start+b]=cp300v4Dim(col,str);
    }
    return leds;
}

function cp300v8PitWheel() {
    var leds = cp300v4StaticWheel(0.24);
    if (cp300v6PitLimiterOn()) { leds = cp300v6PitButtonsLimiter(leds); return cp300v8PaintPitLimiterRings(leds); }
    leds = cp300v6PitButtonsLane(leds);
    return cp300v8PaintPitLaneRings(leds);
}

function cp300v8DynamicWheel() { var base=cp300v4StaticWheel(0.90); base=cp300v8ApplyRingTelemetry(base); return cp300v4ApplyButtonPress(base); }

function cp300v8IdleWheel() { return cp300v4ApplyButtonPress(cp300v4IdleWheel()); }

function cp300v8StartupWheel() { var leds=cp300v7StartupWheel(); return cp300v4AnyLit(leds) ? leds : cp300v6StartupWheel(); }

function cp300v9Bool(names) {
    for (var i=0;i<names.length;i++) {
        try {
            var v = $prop(names[i]);
            if (v === true || v === 'true' || v === 'True') return true;
            var n = Number(v);
            if (isFinite(n) && !isNaN(n) && n > 0.5) return true;
        } catch(e) {}
    }
    return false;
}

function cp300v9SpotterLeft() {
    return cp300v9Bool(['SpotterCarLeft', 'DataCorePlugin.GameData.NewData.SpotterCarLeft', 'DataCorePlugin.GameData.SpotterCarLeft', 'GameRawData.Telemetry.SpotterCarLeft', 'PersistantTrackerPlugin.CarLeft', 'CarLeft', 'IsCarLeft']);
}

function cp300v9SpotterRight() {
    return cp300v9Bool(['SpotterCarRight', 'DataCorePlugin.GameData.NewData.SpotterCarRight', 'DataCorePlugin.GameData.SpotterCarRight', 'GameRawData.Telemetry.SpotterCarRight', 'PersistantTrackerPlugin.CarRight', 'CarRight', 'IsCarRight']);
}

function cp300v9SpotterEnvelope() {
    // Single shared envelope for buttons and encoder rings.
    // First half: breathe ON in cyan-blue.
    // Second half: breathe OFF from clean white to full black/off.
    var cycle = 980;
    var t = Date.now() % cycle;
    var rise = 430;
    var cyan = '#FF00D8FF';
    var blue = '#FF006CFF';
    var white = '#FFFFFFFF';
    if (t < rise) {
        var p = cp300v4EaseInOut(t / rise);
        var col = cp300v4Blend(blue, cyan, 0.72);
        return { colour: col, intensity: 0.10 + 0.90 * p, phase:'cyanOn' };
    }
    var q = cp300v4EaseInOut((t - rise) / (cycle - rise));
    return { colour: white, intensity: 1.0 - q, phase:'whiteOff' };
}

function cp300v9PaintSpotterButton(leds, led, env) {
    if (env.intensity <= 0.025) leds[led] = cp300v4Black();
    else leds[led] = cp300v4Dim(env.colour, env.intensity);
}

function cp300v9PaintSpotterRing(leds, ringStart, env) {
    for (var j=0;j<12;j++) {
        if (env.intensity <= 0.025) leds[ringStart+j] = cp300v4Black();
        else leds[ringStart+j] = cp300v4Dim(env.colour, env.intensity);
    }
}

function cp300v9SpotterWheel() {
    var left = cp300v9SpotterLeft();
    var right = cp300v9SpotterRight();
    if (!left && !right) return cp300v4Empty(44);

    // Black baseline gives the spotter a clean cockpit-level alert without
    // colour noise from the normal theme underneath.
    var leds = cp300v4Empty(44);
    for (var i=0;i<44;i++) leds[i] = cp300v4Black();

    var env = cp300v9SpotterEnvelope();
    var buttons = cp300v4ButtonMap();
    for (var b=0;b<buttons.length;b++) {
        var activeButton = (left && buttons[b].side === 'L') || (right && buttons[b].side === 'R') || (left && right);
        leds[buttons[b].led] = activeButton ? cp300v4Black() : cp300v4Black();
        if (activeButton) cp300v9PaintSpotterButton(leds, buttons[b].led, env);
    }

    var rings = cp300v4Rings();
    // Left-only = left encoder ring. Right-only = right encoder ring.
    // Both sides = all three encoder rings for a clear three-wide warning.
    if (left && right) {
        for (var rb=0;rb<rings.length;rb++) cp300v9PaintSpotterRing(leds, rings[rb].start, env);
    } else if (left) {
        cp300v9PaintSpotterRing(leds, rings[0].start, env);
    } else if (right) {
        cp300v9PaintSpotterRing(leds, rings[2].start, env);
    }
    return leds;
}

function cp300v10PaintBrakeRing(leds, ringStart) {
    var red = '#FFFF0000', white = '#FFFFFFFF';
    var brake = 0;
    try { brake = cp300v7PairBrakeLevel01 ? cp300v7PairBrakeLevel01() : 0; } catch(e) { brake = 0; }
    brake = cp300v6Clamp(brake, 0, 1);

    // Corrected physical centre-ring ladder for 300 GT:
    // bottom pair -> lower pair -> mid pair -> upper pair -> shoulder pair -> top/last pair.
    // This removes one early left-side LED compared with V9/V8.
    var pairs = [[5,7],[4,8],[3,9],[2,10],[1,11],[0,6]];
    var progress = brake * pairs.length;
    var fullPairs = Math.floor(progress);
    var partial = progress - fullPairs;
    var warn = brake >= 0.90;
    var flash = Math.floor(Date.now()/86)%2===0;

    // 0% brake must be a full white 12/12 ring.
    for (var j=0;j<12;j++) leds[ringStart+j] = cp300v4Dim(white, 0.95);

    for (var p=0;p<pairs.length;p++) {
        var lit = p < fullPairs ? 1 : (p === fullPairs ? partial : 0);
        if (lit <= 0.01) continue;
        var strength = 0.34 + 0.66 * cp300v6Clamp(lit, 0, 1);
        if (warn) strength = flash ? 1.0 : 0.18;
        leds[ringStart+pairs[p][0]] = cp300v4Dim(red, strength);
        leds[ringStart+pairs[p][1]] = cp300v4Dim(red, strength);
    }
}

function cp300v8ApplyRingTelemetry(leds) {
    var rings = cp300v6Rings();
    cp300v6PaintSettingRing(leds, rings[0].start, cp300v6AbsValue(), '#FFFFFF00', cp300v6AbsActive());
    cp300v10PaintBrakeRing(leds, rings[1].start);
    cp300v6PaintSettingRing(leds, rings[2].start, cp300v6TcValue(), '#FF006CFF', cp300v6TcActive());
    return leds;
}

function cp300v12State() {
    if (!globalThis.cp300v12ThumbState) globalThis.cp300v12ThumbState = {prev:{}, pulse:{}};
    return globalThis.cp300v12ThumbState;
}

function cp300v13Prop(name, fallback) {
    try {
        var v = $prop(name);
        if (v === undefined || v === null || v === '' || v === '--') return fallback;
        return v;
    } catch(e) { return fallback; }
}

function cp300v13Truth(v) {
    if (v === true) return true;
    if (v === false || v === null || v === undefined) return false;
    if (typeof v === 'number') return v !== 0;
    var s = String(v).toLowerCase();
    return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

function cp300v13Bool(name) { return cp300v13Truth(cp300v13Prop(name, false)); }

function cp300v13AnyBool(names) {
    for (var i=0; i<names.length; i++) if (cp300v13Bool(names[i])) return true;
    return false;
}

function cp300v13IRacingFlag(name) {
    return cp300v13AnyBool([
        'GameRawData.Telemetry.SessionFlagsDetails.Is' + name,
        'DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.Is' + name,
        'GameRawData.Telemetry.SessionFlagsDetails.is' + name,
        'DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.is' + name
    ]);
}

function cp300v13YellowActive() {
    if (cp300v13AnyBool(['Flag_Yellow','YellowFlag','Flag_YellowSector1','Flag_YellowSector2','Flag_YellowSector3','Flag_FullCourseYellow'])) return true;


    if (cp300v13IRacingFlag('yellow')) return true;
    if (cp300v13AnyBool(['GameRawData.Telemetry.SessionFlagsDetails.Isyellow','GameRawData.Telemetry.SessionFlagsDetails.Iscaution','DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.Isyellow'])) return true;
     // AMS2 yellow


    return false;
}

function cp300v13BlueActive() {
    if (cp300v13AnyBool(['Flag_Blue','BlueFlag'])) return true;
    if (cp300v13IRacingFlag('blue')) return true;
    if (cp300v13AnyBool(['GameRawData.Telemetry.SessionFlagsDetails.Isblue','DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.Isblue'])) return true;

    return false;
}

function cp300v13RedActive() {
    if (cp300v13AnyBool(['Flag_Red','RedFlag','GameRawData.RedFlagShown','DataCorePlugin.GameRawData.RedFlagShown'])) return true;
    if (cp300v13IRacingFlag('red')) return true;
    if (cp300v13AnyBool(['GameRawData.Telemetry.SessionFlagsDetails.Isred','DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.Isred'])) return true;
     // AMS2 red


    return false;
}

function cp300v13BlackActive() {
    if (cp300v13AnyBool(['Flag_Black','BlackFlag'])) return true;
    if (cp300v13IRacingFlag('black')) return true;
    if (cp300v13AnyBool(['GameRawData.Telemetry.SessionFlagsDetails.Isblack','DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.Isblack'])) return true;
    return false;
}

function cp300v13WhiteActive() {
    if (cp300v13AnyBool(['Flag_White','WhiteFlag'])) return true;
    if (cp300v13IRacingFlag('white')) return true;
    if (cp300v13AnyBool(['GameRawData.Telemetry.SessionFlagsDetails.Iswhite','DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.Iswhite'])) return true;

    return false;
}

function cp300v13GreenActive() {
    if (cp300v13AnyBool(['Flag_Green','GreenFlag'])) return true;
    if (cp300v13IRacingFlag('green')) return true;
    if (cp300v13AnyBool(['GameRawData.Telemetry.SessionFlagsDetails.Isgreen','DataCorePlugin.GameRawData.Telemetry.SessionFlagsDetails.Isgreen'])) return true;
    return false;
}

function cp300v13OrangeActive() {
    if (cp300v13AnyBool(['Flag_Orange','OrangeFlag','Flag_Mechanical','MeatballFlag'])) return true;
    return false;
}

function cp300v13FlagColour() {
    // Priority order: red/black safety-critical first, then yellow/blue/white/green.
    if (cp300v13RedActive()) return '#FFFF0000';
    if (cp300v13BlackActive()) return '#FFFFFFFF'; // black flag stays visible on LEDs
    if (cp300v13YellowActive()) return '#FFFFFF00';
    if (cp300v13BlueActive()) return '#FF009DFF';
    if (cp300v13OrangeActive()) return '#FFFF7A00';
    if (cp300v13WhiteActive()) return '#FFFFFFFF';
    if (cp300v13GreenActive()) return '#FF00FF00';
    return null;
}

function cp300v13FlagPulse01() {
    // Quick breathing, visible but not seizure-strobe. Peak about every 0.38s.
    var raw = 0.5 + 0.5 * Math.sin(Date.now() / 60);
    try { return cp300v4Smooth(raw); } catch(e) { return raw; }
}

function cp300v13PaintFlags(leds, colour) {
    if (!leds || leds.length < 44) leds = cp300v4StaticWheel(0.82);
    var p = cp300v13FlagPulse01();
    var power = 0.02 + 0.98 * p;
    var flagButtons = [2,3,6,7];
    for (var i=0; i<flagButtons.length; i++) leds[flagButtons[i]] = cp300v4Dim(colour, power);
    for (var j=0; j<12; j++) leds[20+j] = cp300v4Dim(colour, power);
    return leds;
}

function cp300v15Now() { return Date.now(); }

function cp300v15Prop(name, fallback) {
    try {
        var v = $prop(name);
        if (v === undefined || v === null) return fallback;
        if (v === '' || v === '--') return fallback;
        var s = String(v).toLowerCase();
        if (s === 'nan' || s === 'null' || s === 'undefined') return fallback;
        return v;
    } catch(e) { return fallback; }
}

function cp300v15Num(name, fallback) {
    var v = cp300v15Prop(name, fallback);
    var n = Number(v);
    return isFinite(n) && !isNaN(n) ? n : fallback;
}

function cp300v15Bool(name) {
    var v = cp300v15Prop(name, false);
    if (v === true || v === 1) return true;
    var s = String(v).toLowerCase();
    return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

function cp300v15Text(name) {
    var v = cp300v15Prop(name, '');
    var s = String(v || '').trim();
    if (!s || s === '--') return '';
    var l = s.toLowerCase();
    if (l === 'nan' || l === 'none' || l === 'null' || l === 'undefined' || l === 'unknown') return '';
    return s;
}

function cp300v15FirstText(names) {
    for (var i=0;i<names.length;i++) {
        var s = cp300v15Text(names[i]);
        if (s) return s;
    }
    return '';
}

function cp300v15FirstNumber(names, fallback) {
    for (var i=0;i<names.length;i++) {
        var v = cp300v15Prop(names[i], null);
        if (v === null) continue;
        var n = Number(v);
        if (isFinite(n) && !isNaN(n)) return n;
    }
    return fallback;
}

function cp300v15GameConnected() {
    var gr = cp300v15Bool('DataCorePlugin.GameRunning') || cp300v15Bool('GameRunning');
    var game = cp300v15Text('DataCorePlugin.CurrentGame');
    if (!gr) return false;
    if (!game) return false;
    var g = game.toLowerCase();
    if (g === 'none' || g === 'no game' || g === 'desktop' || g === 'launcher') return false;
    return true;
}

function cp300v15SessionText() {
    return cp300v15FirstText(['SessionTypeName', 'DataCorePlugin.GameData.NewData.SessionTypeName', 'DataCorePlugin.GameData.SessionTypeName', 'DataCorePlugin.GameData.NewData.SessionType', 'DataCorePlugin.GameData.SessionType', 'GameRawData.SessionTypeName', 'GameRawData.SessionData.SessionTypeName']);
}

function cp300v15TrackText() {
    return cp300v15FirstText([
        'TrackName','TrackCode','TrackId',
        'DataCorePlugin.GameData.NewData.TrackName',
        'DataCorePlugin.GameData.NewData.TrackCode',
        'DataCorePlugin.GameData.TrackName',
        'GameRawData.TrackName',
        'GameRawData.SessionData.WeekendInfo.TrackName'
    ]);
}

function cp300v15CarText() {
    return cp300v15FirstText(['CarModel', 'CarId', 'CarClass', 'DataCorePlugin.GameData.NewData.CarModel', 'DataCorePlugin.GameData.NewData.CarName', 'DataCorePlugin.GameData.NewData.CarId', 'GameRawData.CarModel']);
}

function cp300v15SessionClock() {
    return cp300v15FirstNumber(['SessionTime', 'SessionTimeLeft', 'SessionTimeRemaining', 'SessionTimeElapsed', 'DataCorePlugin.GameData.NewData.SessionTime', 'DataCorePlugin.GameData.NewData.SessionTimeLeft', 'DataCorePlugin.GameData.NewData.SessionTimeRemaining', 'DataCorePlugin.GameData.NewData.SessionTimeElapsed', 'CurrentLapTime', 'LapCurrentLapTime', 'DataCorePlugin.GameData.NewData.CurrentLapTime', 'GameRawData.Telemetry.SessionTime'], -1);
}

function cp300v15SignalSignature() {
    var rpm = 0, speed = 0;
    try { rpm = cp300v6Rpm ? cp300v6Rpm() : cp300v15Num('Rpms', 0); } catch(e) { rpm = cp300v15Num('Rpms', 0); }
    try { speed = cp300v6Speed ? cp300v6Speed() : cp300v15Num('SpeedKmh', 0); } catch(e) { speed = cp300v15Num('SpeedKmh', 0); }
    var gear = cp300v15FirstText(['Gear', 'DataCorePlugin.GameData.NewData.Gear']);
    var lap = cp300v15FirstNumber(['CurrentLap', 'Lap', 'DataCorePlugin.GameData.NewData.CurrentLap', 'DataCorePlugin.GameData.NewData.Lap'], -1);
    var pos = cp300v15FirstNumber(['Position', 'DataCorePlugin.GameData.NewData.Position'], -1);
    var clock = cp300v15SessionClock();
    var pit = (cp300v15Bool('PitLimiterOn') || cp300v15Bool('IsInPitLane') || cp300v15Bool('IsInPit') || cp300v15Bool('DataCorePlugin.GameData.IsInPitLane')) ? 1 : 0;
    var flag = cp300v15FirstText(['Flag', 'Flags']);
    // Quantise noisy values. We only need to know whether the stream is alive.
    return [
        cp300v15Text('DataCorePlugin.CurrentGame'),
        cp300v15SessionText(), cp300v15TrackText(), cp300v15CarText(),
        Math.round(rpm / 20), Math.round(speed * 2), gear,
        Math.round(clock * 2), lap, pos, pit, flag
    ].join('|');
}

function cp300v15StrongSessionMarker() {
    // Broad cross-sim marker set. A car/track/session combo alone is enough to
    // keep a loaded garage/session alive, but stale cached telemetry is still
    // caught by the freshness gate below.
    var session = cp300v15SessionText();
    var track = cp300v15TrackText();
    var car = cp300v15CarText();
    var game = cp300v15Text('DataCorePlugin.CurrentGame');
    var hasIdentity = !!(game && (session || track || car));
    var clock = cp300v15SessionClock();
    var hasClock = isFinite(clock) && clock >= 0;
    return hasIdentity || hasClock;
}

function cp300v15LiveInputMarker() {
    var brake = cp300v15FirstNumber(['Brake', 'BrakeRaw'], 0);
    var throttle = cp300v15FirstNumber(['Throttle', 'ThrottleRaw'], 0);
    return Math.abs(brake) > 0.015 || Math.abs(throttle) > 0.015;
}

function cp300v15LiveMotionMarker() {
    var rpm = 0, speed = 0;
    try { rpm = cp300v6Rpm ? cp300v6Rpm() : cp300v15Num('Rpms',0); } catch(e) { rpm = cp300v15Num('Rpms',0); }
    try { speed = cp300v6Speed ? cp300v6Speed() : cp300v15Num('SpeedKmh',0); } catch(e) { speed = cp300v15Num('SpeedKmh',0); }
    var pit = false; try { pit = cp300v6PitActive ? cp300v6PitActive() : false; } catch(e) {}
    var ign = false; try { ign = cp300v6IgnitionOn ? cp300v6IgnitionOn() : false; } catch(e) {}
    var started = false; try { started = cp300v6EngineStarted ? cp300v6EngineStarted() : false; } catch(e) {}
    return rpm > 180 || speed > 1.0 || pit || ign || started || cp300v15LiveInputMarker();
}

function cp300v15State() {
    if (!globalThis.cp300v15SessionGate) {
        globalThis.cp300v15SessionGate = {
            sig:null,
            changedAt:0,
            liveAt:0,
            lockedIdle:true,
            lastGame:false
        };
    }
    return globalThis.cp300v15SessionGate;
}

function cp300v15UpdateSessionGate() {
    var now = cp300v15Now();
    var st = cp300v15State();
    var connected = cp300v15GameConnected();
    if (!connected) {
        st.sig = null;
        st.changedAt = now;
        st.liveAt = 0;
        st.lockedIdle = true;
        st.lastGame = false;
        return st;
    }

    var sig = cp300v15SignalSignature();
    var changed = (sig !== st.sig);
    if (changed) {
        st.sig = sig;
        st.changedAt = now;
        // Any meaningful signature movement means SimHub is receiving a fresh
        // stream again, so unlock from desktop/menu idle.
        if (cp300v15StrongSessionMarker() || cp300v15LiveMotionMarker()) st.lockedIdle = false;
    }
    if (cp300v15LiveMotionMarker()) {
        st.liveAt = now;
        st.lockedIdle = false;
    }

    // If the sim is open but session data has disappeared, treat that as menu.
    if (!cp300v15StrongSessionMarker() && !cp300v15LiveMotionMarker()) {
        if (now - st.changedAt > 900) st.lockedIdle = true;
    }

    // Frozen/cached telemetry trap: after leaving a session, some sims keep the
    // last RPM, pit, flag, or button state around. If nothing has changed for a
    // few seconds and no new live input/motion has been seen, force idle.
    var staleMs = now - st.changedAt;
    var liveAge = st.liveAt ? (now - st.liveAt) : 999999;
    if (staleMs > 6200 && liveAge > 6200) st.lockedIdle = true;

    st.lastGame = true;
    return st;
}

function cp300v15ShouldForceIdle() {
    var st = cp300v15UpdateSessionGate();
    return !!st.lockedIdle;
}

function cp300v18State() {
    if (!globalThis.cp300v18ThumbState) globalThis.cp300v18ThumbState = {prev:{}, pulse:{}};
    return globalThis.cp300v18ThumbState;
}

function cp300v19State() {
    if (!globalThis.cp300v19ThumbState) globalThis.cp300v19ThumbState = {prev:{}, pulse:{}, edgeAt:{}, lastRightTop:0};
    return globalThis.cp300v19ThumbState;
}

function cp300v20State() {
    if (!globalThis.cp300v20ThumbState) globalThis.cp300v20ThumbState = {prev:{}, edgeAt:{}, pulse:{}, lastTopR:0, lastTopL:0};
    return globalThis.cp300v20ThumbState;
}

function cp300v21Now() { return Date.now(); }

function cp300v21Clamp(v,a,b) { try { return cp300v4Clamp(v,a,b); } catch(e) { return Math.max(a, Math.min(b, v)); } }

function cp300v21Smooth01(t) { t = cp300v21Clamp(t,0,1); return t*t*(3-2*t); }

function cp300v21RawBtn(id) { try { return !!getcontrollerbuttonstate('0x3514,0x000E', id); } catch(e) { return false; } }

function cp300v21State() {
    if (!globalThis.cp300v21ThumbState) {
        globalThis.cp300v21ThumbState = {prev:{}, edgeAt:{}, pulse:{}, snapAt:0, snap:null, lastTopR:0, lastTopL:0};
    }
    return globalThis.cp300v21ThumbState;
}

function cp300v21Snapshot() {
    var st = cp300v21State();
    var now = cp300v21Now();
    // Reuse within a single SimHub render pass so one ID cannot be consumed by
    // the first detector and disappear for the second detector.
    if (st.snap && now - st.snapAt < 14) return st.snap;

    var ids = [8,9,10,11,12,13,14,15,16,17,18,19];
    var hit = {}, liveMap = {};
    for (var i=0; i<ids.length; i++) {
        var id = ids[i];
        var key = 'id' + id;
        var live = cp300v21RawBtn(id);
        liveMap[id] = live;
        var old = !!st.prev[key];
        var edge = (live !== old);
        var simhubEdge = false;
        try { if (isincreasing(760, getcontrollerbuttonstate('0x3514,0x000E', id))) simhubEdge = true; } catch(e) {}
        try { if (isdecreasing(760, getcontrollerbuttonstate('0x3514,0x000E', id))) simhubEdge = true; } catch(e) {}
        try { if (Changed(760, getcontrollerbuttonstate('0x3514,0x000E', id))) simhubEdge = true; } catch(e) {}
        if (edge || simhubEdge || live) st.edgeAt[key] = now;
        st.prev[key] = live;
        hit[id] = !!(st.edgeAt[key] && now - st.edgeAt[key] < 360);
    }
    st.snap = {hit:hit, live:liveMap, at:now};
    st.snapAt = now;
    return st.snap;
}

function cp300v21AnyHit(s, ids) {
    for (var i=0; i<ids.length; i++) if (s.hit[ids[i]]) return true;
    return false;
}

function cp300v21Arm(key, active, side, family, dir) {
    var st = cp300v21State();
    var prevKey = 'pulse_' + key;
    var was = !!st.prev[prevKey];
    if (active && !was) {
        st.pulse[key] = {at:cp300v21Now(), side:side, family:family, dir:dir, v21:true};
        if (side === 'R' && family === 'top') st.lastTopR = cp300v21Now();
        if (side === 'L' && family === 'top') st.lastTopL = cp300v21Now();
    }
    st.prev[prevKey] = !!active;
}

function cp300v21ThemeAt(led, fallback) { try { return cp300v4ButtonThemeAt(led); } catch(e) { return fallback || '#FFFFFFFF'; } }

function cp300v21Blend(a,b,t) { try { return cp300v4Blend(a,b,t); } catch(e) { return b; } }

function cp300v21Dim(c,l) { try { return cp300v4Dim(c,l); } catch(e) { return c; } }

function cp300v21Accent(side) { return side === 'L' ? '#FF00E5FF' : '#FFFF8A00'; }

function cp300v21BreathLevel(age, index, count, passMs, repeats) {
    if (age < 0 || age > passMs * repeats) return 0;
    var local = age % passMs;
    var stepMs = passMs / count;
    var start = index * stepMs;
    var end = start + stepMs * 1.10;
    if (local < start || local > end) return 0;
    var u = (local - start) / (end - start);
    var tri = 1 - Math.abs(2*u - 1);
    return cp300v21Clamp(0.28 + 0.72 * cp300v21Smooth01(tri), 0, 1);
}

function cp300v21PaintButton(leds, led, level, side, lead) {
    if (!leds || led < 0 || led >= leds.length || level <= 0.01) return;
    var base = leds[led] || cp300v21ThemeAt(led, '#FF202020');
    var accent = cp300v21Accent(side);
    var body = cp300v21Blend(accent, '#FFFFFFFF', lead ? 0.36 : 0.24);
    var signal = cp300v21Dim(body, 0.64 + 0.36 * level);
    var out = cp300v21Blend(base, signal, 0.68 + 0.32 * level);
    if (level > 0.78) out = cp300v21Blend(out, '#FFFFFFFF', lead ? 0.34 : 0.22);
    leds[led] = out;
}

function cp300v21PaintMiddleThumb(leds, side, dir, age) {
    var passMs = 560, repeats = 2;
    if (age < 0 || age > passMs * repeats) return false;
    var order;
    if (side === 'L') order = (dir > 0) ? [3,2,1,0] : [0,1,2,3];
    else order = (dir > 0) ? [7,6,5,4] : [4,5,6,7];
    for (var i=0; i<order.length; i++) {
        cp300v21PaintButton(leds, order[i], cp300v21BreathLevel(age, i, order.length, passMs, repeats), side, i===0);
    }
    return true;
}

function cp300v1ClearTopThumbPulses() {
    function clearBag(bag) {
        if (!bag) return;
        for (var k in bag) {
            if (!bag.hasOwnProperty(k)) continue;
            var p = bag[k];
            if (p && p.family === 'top') delete bag[k];
        }
    }
    try { clearBag(cp300v12State().pulse); } catch(e) {}
    try { clearBag(cp300v18State().pulse); } catch(e) {}
    try { clearBag(cp300v19State().pulse); } catch(e) {}
    try { clearBag(cp300v20State().pulse); } catch(e) {}
    try { clearBag(cp300v21State().pulse); } catch(e) {}
}

function cp300v1CaptureMiddleThumbEncoders() {
    cp300v1ClearTopThumbPulses();
    var s;
    try { s = cp300v21Snapshot(); } catch(e) { s = null; }
    if (!s) return;
    try { cp300v21Arm('v1_midL_down', cp300v21AnyHit(s, [16]), 'L', 'middle', -1); } catch(e) {}
    try { cp300v21Arm('v1_midL_up',   cp300v21AnyHit(s, [17]), 'L', 'middle',  1); } catch(e) {}
    try { cp300v21Arm('v1_midR_down', cp300v21AnyHit(s, [18]), 'R', 'middle', -1); } catch(e) {}
    try { cp300v21Arm('v1_midR_up',   cp300v21AnyHit(s, [19]), 'R', 'middle',  1); } catch(e) {}
}

function cp300v1ApplyMiddleThumbButtons(leds) {
    cp300v1CaptureMiddleThumbEncoders();
    cp300v1ClearTopThumbPulses();
    var st;
    try { st = cp300v21State(); } catch(e) { return leds; }
    var now = Date.now();
    for (var key in st.pulse) {
        if (!st.pulse.hasOwnProperty(key)) continue;
        var p = st.pulse[key];
        var age = now - p.at;
        if (!p || p.family === 'top') { delete st.pulse[key]; continue; }
        if (p.family === 'middle') {
            try { cp300v21PaintMiddleThumb(leds, p.side, p.dir, age); } catch(e) {}
        }
        if (age > 1450) delete st.pulse[key];
    }
    return leds;
}

function cp300v1WheelOverlay() {
    var leds;
    if (cp300v15ShouldForceIdle()) {
        leds = cp300v4IdleWheel();
    } else {
        leds = cp300v14CoreWheelNoFlag();
        var colour = cp300v13FlagColour();
        if (colour) leds = cp300v13PaintFlags(leds, colour);
    }
    try { leds = cp300v4ApplyButtonPress(leds); } catch(e) {}
    try { leds = cp300v1ApplyMiddleThumbButtons(leds); } catch(e) {}
    return leds;
}

function cp300v14CoreWheelNoFlag() {

    var start = cp300v8StartupWheel(); if (cp300v4AnyLit(start)) return cp300v14ApplyThumbEncoderButtons(start);
    var ign = cp300v6IgnitionWheel(); if (cp300v4AnyLit(ign)) return cp300v14ApplyThumbEncoderButtons(ign);
    if (cp300v6PitActive()) return cp300v14ApplyThumbEncoderButtons(cp300v4ApplyButtonPress(cp300v8PitWheel()));
    var spot = cp300v9SpotterWheel(); if (cp300v4AnyLit(spot)) return cp300v14ApplyThumbEncoderButtons(cp300v4ApplyButtonPress(spot));
    if (cp300v6IgnitionOnlyActive()) return cp300v14ApplyThumbEncoderButtons(cp300v4ApplyButtonPress(cp300v4IgnitionWheel()));
    if (cp300v6IdleActive()) return cp300v14ApplyThumbEncoderButtons(cp300v8IdleWheel());
    return cp300v14ApplyThumbEncoderButtons(cp300v8DynamicWheel());
}

function cp300v6TcActive() {
    var game = "IRacing";
    var bools = ['TCActive', 'DataCorePlugin.GameData.NewData.TCActive', 'DataCorePlugin.GameData.NewData.TCActive'];
    for (var i=0; i<bools.length; i++) { try { if (cp300v6BoolProp(bools[i])) return true; } catch(e0) {} }
    var inAction = cp300v6FirstNumber([], 0.05, 999);

    return inAction > 0.05;
}

CP300V3_BTN1 = AMAZING_THEME.runtime["CP300V3_BTN1_3"];

CP300V3_BTN2 = AMAZING_THEME.runtime["CP300V3_BTN2_3"];

CP300V3_BTN3 = AMAZING_THEME.runtime["CP300V3_BTN3_3"];

CP300V3_BTN4 = AMAZING_THEME.runtime["CP300V3_BTN4_3"];

CP300V3_RING1 = AMAZING_THEME.runtime["CP300V3_RING1_3"];

CP300V3_RING2 = AMAZING_THEME.runtime["CP300V3_RING2_3"];

CP300V3_RING3 = AMAZING_THEME.runtime["CP300V3_RING3_3"];

CP300V3_ACCENT = AMAZING_THEME.runtime["CP300V3_ACCENT_3"];

var C300V25 = C300V25 || {
    pitKnown:false, pitLast:false, pitExitAt:0,
    ignitionMode:'', ignitionAt:0,
    buttons:{}, encoderPrev:{}, encoderLast:{}, encoderWaves:[],
    lmuSignature:'', lmuKey:''
};

function c300v25Prop(name,fallback){
    try{
        var v=$prop(name);
        if(v===undefined||v===null)return fallback;
        if(typeof v==='string'){
            var s=v.trim().toLowerCase();
            if(s===''||s==='--'||s==='nan'||s==='null'||s==='undefined')return fallback;
        }
        return v;
    }catch(e){return fallback;}
}

function c300v25Num(name,fallback){var n=Number(c300v25Prop(name,fallback));return isFinite(n)&&!isNaN(n)?n:fallback;}

function c300v25Bool(name){var v=c300v25Prop(name,false);return v===true||v===1||String(v).toLowerCase()==='true'||String(v)==='1';}

function c300v25Clamp(v,a,b){return Math.max(a,Math.min(b,Number(v)||0));}

function c300v25Smooth(t){t=c300v25Clamp(t,0,1);return 0.5-0.5*Math.cos(Math.PI*t);}

function c300v25Empty(n,fill){var a=[];for(var i=0;i<n;i++)a.push(fill===undefined?null:fill);return a;}

function c300v25Blend(a,b,t){try{return cp300v4Blend(a,b,t);}catch(e){return b||a;}}

function c300v25Dim(c,t){try{return cp300v4Dim(c,t);}catch(e){return c;}}

function c300v25AnyLit(a){if(!a)return false;for(var i=0;i<a.length;i++)if(a[i]!==null&&a[i]!==undefined&&a[i]!=='#00000000')return true;return false;}

function c300v25Game(){
    try{if(typeof cp300v4GameRunning==='function')return cp300v4GameRunning();}catch(e){}
    return c300v25Num('DataCorePlugin.GameRunning',c300v25Num('GameRunning',0))===1;
}

function c300v25ForceIdle(){
    try{if(typeof cp300v15ShouldForceIdle==='function')return cp300v15ShouldForceIdle();}catch(e){}
    return !c300v25Game();
}

function c300v25Ignition(){
    try{if(typeof cp300v6IgnitionOn==='function')return cp300v6IgnitionOn();}catch(e){}
    return c300v25Bool('EngineIgnitionOn')||c300v25Bool('EngineIgnition');
}

function c300v25Rpm(){return c300v25Num('Rpms',c300v25Num('RPMS',0));}

function c300v25Engine(){
    try{if(typeof cp300v6EngineStarted==='function'&&cp300v6EngineStarted())return true;}catch(e){}
    return c300v25Bool('EngineStarted')||c300v25Bool('EngineRunning')||c300v25Bool('CarStarted')||c300v25Rpm()>450;
}

function c300v25Limiter(){return c300v25Bool('PitLimiterOn');}

function c300v25InPit(){return c300v25Bool('IsInPitLane')||c300v25Bool('IsInPit')||c300v25Bool('DataCorePlugin.GameData.IsInPitLane');}

function c300v25Speed(){return Math.abs(c300v25Num('SpeedKmh',c300v25Num('Speed',0)));}

function c300v25PitLimit(){
    var names=['PitSpeedLimit','PitLimiterSpeed','GameRawData.PitSpeedLimit','DataCorePlugin.GameData.NewData.PitSpeedLimit'];
    for(var i=0;i<names.length;i++){var n=c300v25Num(names[i],0);if(n>1)return n;}
    return 60;
}

cp300v6PitActive=function(){return c300v25Limiter();};

function c300v25IgnitionProgress(){
    var mode=c300v25Ignition()?'on':'off',now=Date.now();
    if(C300V25.ignitionMode!==mode||!C300V25.ignitionAt){C300V25.ignitionMode=mode;C300V25.ignitionAt=now;}
    var u=((now-C300V25.ignitionAt)%5600)/5600;
    var ping=u<0.5?u*2:(1-u)*2;
    return c300v25Smooth(ping);
}

function c300v25PaintPath(arr,path,cursor,baseColour){
    for(var i=0;i<path.length;i++){
        var dist=Math.abs(i-cursor),mix=0;
        if(dist<=0.34)mix=1;
        else if(dist<1.42)mix=((1.42-dist)/1.08)*0.68;
        else if(dist<2.18)mix=((2.18-dist)/0.76)*0.18;
        if(mix>0)arr[path[i]]=c300v25Blend(baseColour,'#FFFFFFFF',c300v25Clamp(mix,0,1));
    }
}

function c300v25PitSync(){
    var u=(Date.now()%2640)/2640,ping=u<0.5?u*2:(1-u)*2;
    return {u:u,progress:c300v25Smooth(ping),direction:u<0.5?1:-1};
}

function c300v25PitColour(distance){
    var blue='#FF006CFF',cyan='#FF00FFE0',orange='#FFFF5A00',white='#FFFFFFFF';
    var head=Math.max(0,1-distance/1.18),trail=Math.max(0,1-distance/2.85);
    var col=c300v25Blend(blue,cyan,0.28+0.34*trail);
    col=c300v25Blend(col,orange,Math.pow(head,0.78));
    if(distance<0.34)col=c300v25Blend(col,white,(0.34-distance)/0.34*0.22);
    var strength=Math.max(0.28,Math.min(1,0.28+0.38*trail+0.44*head));
    return c300v25Dim(col,strength);
}

function c300v25PitWarningRings(base){
    if(!c300v25InPit()||c300v25Limiter())return base;
    var over=c300v25Speed()>c300v25PitLimit()+0.35,col=over?'#FFFF0000':'#FF00FF40';
    var phase=Math.floor(Date.now()/110)%12,left=8,right=32;
    for(var i=0;i<12;i++){
        var d=Math.min(Math.abs(i-phase),12-Math.abs(i-phase));
        var strength=d===0?1:(d===1?0.52:(d===2?0.18:0.06));
        base[left+i]=c300v25Dim(col,strength);
        base[right+i]=c300v25Dim(col,strength);
    }
    return base;
}

function c300v25ButtonRaw(id){try{return !!getcontrollerbuttonstate('0x3514,0x000E',id);}catch(e){return false;}}

function c300v25Triple(age){if(age<0||age>=800)return null;var period=800/3,local=(age%period)/period,p=Math.sin(Math.PI*local);if(p<0.12)return '#FF000000';return c300v25Dim('#FFFFFFFF',0.34+0.66*p);}

function c300v25Hold(held){var ph=((Math.max(0,held-260))%720)/720,b=0.5-0.5*Math.cos(2*Math.PI*ph);if(b<0.06)return '#FF000000';return c300v25Dim('#FFFFFFFF',0.20+0.80*b);}

function c300v25ApplyButtons(base){
    var now=Date.now();
    for(var i=0;i<8;i++){
        var down=c300v25ButtonRaw(i),s=C300V25.buttons[i];
        if(!s){s={down:down,pressedAt:down?now:0,releasedAt:0,quick:false};C300V25.buttons[i]=s;}
        if(down&&!s.down){s.pressedAt=now;s.releasedAt=0;s.quick=false;}
        if(!down&&s.down){var held=Math.max(0,now-s.pressedAt);s.releasedAt=now;s.quick=held<430;}
        s.down=down;
        if(s.down){var heldNow=now-s.pressedAt;base[i]=heldNow<260?'#FFFFFFFF':c300v25Hold(heldNow);}
        else if(s.quick&&s.releasedAt>0&&now-s.releasedAt<800){var f=c300v25Triple(now-s.releasedAt);if(f!==null)base[i]=f;}
    }
    return base;
}

function c300v25Pulse(id,key){
    var now=Date.now(),live=c300v25ButtonRaw(id),old=!!C300V25.encoderPrev[key],native=false;
    try{if(isincreasing(850,getcontrollerbuttonstate('0x3514,0x000E',id)))native=true;}catch(e){}
    C300V25.encoderPrev[key]=live;
    var last=Number(C300V25.encoderLast[key]||0),rise=(live&&!old)||native;
    if(rise&&now-last>110){C300V25.encoderLast[key]=now;return true;}
    return false;
}

function c300v25AnyPulse(ids,key){for(var i=0;i<ids.length;i++)if(c300v25Pulse(ids[i],key+'_'+ids[i]))return true;return false;}

function c300v25EncoderStart(side,kind,direction){
    var keep=[];for(var i=0;i<C300V25.encoderWaves.length;i++){var w=C300V25.encoderWaves[i];if(!(w.side===side&&w.kind===kind))keep.push(w);}
    keep.push({side:side,kind:kind,direction:direction,at:Date.now()});C300V25.encoderWaves=keep;
}

function c300v25Bell(distance,width){return Math.exp(-0.5*(distance*distance)/(width*width));}

function c300v25Fade(age,duration){var a=c300v25Clamp(age/115,0,1),b=c300v25Clamp((duration-age)/150,0,1);return c300v25Smooth(Math.min(a,b));}

function c300v25EncoderOrder(w){
    if(w.kind==='top'){
        if(w.side==='left')return w.direction==='up'?[1,0]:[0,1];
        return w.direction==='up'?[5,4]:[4,5];
    }
    if(w.side==='left')return w.direction==='up'?[3,2,1,0]:[0,1,2,3];
    return w.direction==='up'?[7,6,5,4]:[4,5,6,7];
}

cp300v1WheelOverlay=function(){
    var leds;
    if(c300v25ForceIdle())leds=cp300v4IdleWheel();
    else{
        var startup=null;try{startup=cp300v8StartupWheel();}catch(e0){}
        if(c300v25AnyLit(startup))leds=startup;
        else if(c300v25Game()&&!c300v25Engine())leds=c300v25Ignition()?c300v25IgnitionWheel('#FFFFFF00'):c300v25IgnitionWheel('#FFFF0000');
        else if(c300v25Game()&&c300v25Engine()&&c300v25Limiter())leds=c300v25PitWheel();
        else{
            leds=cp300v14CoreWheelNoFlag();
            try{var flag=cp300v13FlagColour();if(flag)leds=cp300v13PaintFlags(leds,flag);}catch(e1){}
            leds=c300v25PitWarningRings(leds);
        }
    }
    leds=c300v25ApplyButtons(leds);
    leds=c300v25ApplyEncoders(leds);
    return leds;
};

if (typeof C300V25 === 'object') {
    if (C300V25.pitExitLimiterAt === undefined) C300V25.pitExitLimiterAt = 0;
}

function c300v26CircularDistance(a,b,n) {
    var d=Math.abs(a-b); return Math.min(d,n-d);
}

function c300v26RingHead(baseColour, phase) {
    var ring=c300v25Empty(12,baseColour);
    var pos=((phase%1)+1)%1*12;
    for(var j=0;j<12;j++) {
        var d=c300v26CircularDistance(j,pos,12);
        var whiteMix=0;
        if(d<0.48) whiteMix=1.0-(d/0.48)*0.08;
        else if(d<1.30) whiteMix=(1.30-d)/0.82*0.34;
        else if(d<2.05) whiteMix=(2.05-d)/0.75*0.08;
        if(whiteMix>0) ring[j]=c300v25Blend(baseColour,'#FFFFFFFF',c300v25Clamp(whiteMix,0,1));
    }
    return ring;
}

function c300v26PaintAllRings(out,baseColour,phase) {
    var rings=cp300v4Rings();
    var ring=c300v26RingHead(baseColour,phase);
    for(var r=0;r<rings.length;r++) for(var j=0;j<12;j++) out[rings[r].start+j]=ring[j];
    return out;
}

function c300v25IgnitionWheel(baseColour) {
    var out=c300v25Empty(44,null);
    for(var b=0;b<8;b++) out[b]=baseColour;
    var p=c300v25IgnitionProgress(),cursor=p*3;
    c300v25PaintPath(out,[0,1,2,3],cursor,baseColour);
    c300v25PaintPath(out,[4,5,6,7],cursor,baseColour);
    var now=Date.now(), start=Number(C300V25.ignitionAt||now);
    var phase=((now-start)%5600)/5600;
    return c300v26PaintAllRings(out,baseColour,phase);
}

function c300v26PitExitAlertAge() {
    var at=Number(C300V25.pitExitLimiterAt||0);
    if(at<=0) return -1;
    var age=Date.now()-at;
    return age>=0&&age<1250?age:-1;
}

function c300v26PitExitWheel() {
    var age=c300v26PitExitAlertAge(); if(age<0) return null;
    var on=(Math.floor(age/105)%2)===0;
    return c300v25Empty(44,on?'#FFFFFFFF':'#FF000000');
}

function cp300v14ApplyThumbEncoderButtons(leds) { return leds; }

function c300v25CaptureEncoders() {
    if(c300v25AnyPulse([13],'tl_left'))  c300v25EncoderStart('left','top','down');
    if(c300v25AnyPulse([12],'tl_right')) c300v25EncoderStart('left','top','up');
    if(c300v25AnyPulse([14],'tr_left'))  c300v25EncoderStart('right','top','down');
    if(c300v25AnyPulse([15],'tr_right')) c300v25EncoderStart('right','top','up');
    if(c300v25AnyPulse([16],'ml_down'))  c300v25EncoderStart('left','middle','down');
    if(c300v25AnyPulse([17],'ml_up'))    c300v25EncoderStart('left','middle','up');
    if(c300v25AnyPulse([18],'mr_down'))  c300v25EncoderStart('right','middle','down');
    if(c300v25AnyPulse([19],'mr_up'))    c300v25EncoderStart('right','middle','up');
}

cp300v1WheelOverlay=function() {
    var leds;
    if(c300v25ForceIdle()) leds=cp300v4IdleWheel();
    else {
        var startup=null; try { startup=cp300v8StartupWheel(); } catch(e0) {}
        if(c300v25AnyLit(startup)) leds=startup;
        else if(c300v25Game()&&!c300v25Engine()) leds=c300v25Ignition()?c300v25IgnitionWheel('#FFFFFF00'):c300v25IgnitionWheel('#FFFF0000');
        else {
            var exitAlert=c300v26PitExitWheel();
            if(exitAlert) leds=exitAlert;
            else if(c300v25Game()&&c300v25Engine()&&c300v25Limiter()) leds=c300v25PitWheel();
            else {
                leds=cp300v14CoreWheelNoFlag();
                try { var flag=cp300v13FlagColour(); if(flag) leds=cp300v13PaintFlags(leds,flag); } catch(e1) {}
                leds=c300v25PitWarningRings(leds);
            }
        }
    }
    leds=c300v25ApplyButtons(leds);
    leds=c300v25ApplyEncoders(leds);
    return leds;
};

if(typeof C300V25==='object'){
    if(!C300V25.backButtons) C300V25.backButtons={};
}

function c300v27HasValue(name){
    try{
        var v=$prop(name);
        if(v===undefined||v===null)return false;
        if(typeof v==='string'){
            var s=v.trim().toLowerCase();
            if(s===''||s==='--'||s==='nan'||s==='null'||s==='undefined'||s==='n/a')return false;
        }
        return true;
    }catch(e){return false;}
}

function c300v27Text(names){
    for(var i=0;i<names.length;i++){
        var v=c300v25Prop(names[i],'');
        if(v!==''&&v!==null&&v!==undefined)return String(v).toLowerCase();
    }
    return '';
}

function c300v27Paused(){
    var flags=['GamePaused', 'IsPaused', 'DataCorePlugin.GameData.NewData.IsPaused', 'DataCorePlugin.GameData.IsPaused'];
    for(var i=0;i<flags.length;i++)if(c300v25Bool(flags[i]))return true;
    var t=c300v27Text(['Status','SessionStatus','SessionPhase','GameState','DataCorePlugin.GameData.NewData.Status','DataCorePlugin.GameData.NewData.SessionStatus']);
    return t.indexOf('paused')>=0||t==='pause';
}

function c300v27TelemetryPresent(){
    // Presence, not movement. A stationary car still has valid telemetry.
    var keys=[
        'Rpms','RPMS','DataCorePlugin.GameData.NewData.Rpms','DataCorePlugin.GameData.NewData.RPMS',
        'SpeedKmh','Speed','DataCorePlugin.GameData.NewData.SpeedKmh','DataCorePlugin.GameData.NewData.Speed',
        'Gear','DataCorePlugin.GameData.NewData.Gear','EngineStarted','EngineRunning',
        'CurrentLapTime','LapCurrentLapTime','DataCorePlugin.GameData.NewData.CurrentLapTime',
        'IsInPitLane','PitLimiterOn','Throttle','Brake'
    ];
    for(var i=0;i<keys.length;i++)if(c300v27HasValue(keys[i]))return true;
    return false;
}

function c300v27CalmState(){
    if(!c300v25Game())return false; // desktop keeps the established idle animation
    if(c300v27Paused())return true;
    // Only treat an open game as telemetry-loss when all useful live markers
    // are missing. Cached zero RPM at a stopped car is still valid telemetry.
    return !c300v27TelemetryPresent();
}

function c300v27CalmWheel(){return cp300v4StaticWheel(0.88);}

function c300v27PitRing(sync){
    var ring=c300v25Empty(12,null),pos=((sync.u%1)+1)%1*12;
    for(var j=0;j<12;j++){
        var d=c300v26CircularDistance(j,pos,12);
        ring[j]=c300v25PitColour(d*1.18);
    }
    return ring;
}

function c300v25PitWheel(){
    var out=cp300v4StaticWheel(0.34),sync=c300v25PitSync(),cursor=sync.progress*3;
    var left=[0,1,2,3],right=[4,5,6,7];
    for(var i=0;i<4;i++){
        var c=c300v25PitColour(Math.abs(i-cursor)*1.35);
        out[left[i]]=c;out[right[i]]=c;
    }
    var rings=cp300v4Rings(),ring=c300v27PitRing(sync);
    for(var r=0;r<rings.length;r++)for(var j=0;j<12;j++)out[rings[r].start+j]=ring[j];
    return out;
}

function c300v25ApplyEncoders(base){
    c300v25CaptureEncoders();
    var now=Date.now(),keep=[];
    for(var w=0;w<C300V25.encoderWaves.length;w++){
        var wave=C300V25.encoderWaves[w],age=now-wave.at,duration=wave.kind==='middle'?980:650;
        if(age>duration)continue;
        keep.push(wave);
        var order=c300v25EncoderOrder(wave);
        var x=c300v25Smooth(c300v25Clamp(age/duration,0,1))*(order.length-1);
        var env=c300v25Fade(age,duration);
        // Dark runway makes a white cue readable even on a white theme button.
        for(var q=0;q<order.length;q++)base[order[q]]=c300v25Dim(cp300v4ButtonThemeAt(order[q]),0.075);
        for(var i=0;i<order.length;i++){
            var dist=Math.abs(i-x);
            var head=c300v25Bell(dist,0.52);
            var trail=c300v25Bell(dist,1.08)*0.24;
            var strength=c300v25Clamp((head+trail)*env,0,1);
            base[order[i]]=c300v25Blend('#FF030303','#FFFFFFFF',strength);
        }
    }
    C300V25.encoderWaves=keep;
    return base;
}

function c300v27BackLevel(id,key){
    var now=Date.now(),down=c300v25ButtonRaw(id),s=C300V25.backButtons[key];
    if(!s){s={down:down,pressedAt:down?now:0,releasedAt:0,quick:false};C300V25.backButtons[key]=s;}
    if(down&&!s.down){s.pressedAt=now;s.releasedAt=0;s.quick=false;}
    if(!down&&s.down){var held=Math.max(0,now-s.pressedAt);s.releasedAt=now;s.quick=held<430;}
    s.down=down;
    if(s.down){var age=now-s.pressedAt;return age<230?'#FFFFFFFF':c300v25Hold(age);}
    if(s.quick&&s.releasedAt>0&&now-s.releasedAt<800)return c300v25Triple(now-s.releasedAt);
    return null;
}

function c300v27PaintPair(base,pair,colour){
    if(colour===null||colour===undefined)return base;
    // Direct ownership, rather than blending, guarantees visibility over theme,
    // idle, flags, pit limiter and menu states while the rear input is active.
    for(var i=0;i<pair.length;i++)base[pair[i]]=colour;
    return base;
}

function c300v27ApplyRearButtons(base){
    // Diagram inputs 11/12 are SimHub zero-based HID indices 10/11.
    var left=c300v27BackLevel(10,'leftRear');
    var right=c300v27BackLevel(11,'rightRear');
    c300v27PaintPair(base,[0,1],left);
    c300v27PaintPair(base,[4,5],right);
    return base;
}

function c300v27ApplyFinalInputs(base){
    base=c300v25ApplyButtons(base);
    base=c300v25ApplyEncoders(base);
    base=c300v27ApplyRearButtons(base);
    return base;
}

cp300v1WheelOverlay=function(){
    var leds;
    if(c300v27CalmState())leds=c300v27CalmWheel();
    else if(c300v25ForceIdle())leds=cp300v4IdleWheel();
    else{
        var startup=null;try{startup=cp300v8StartupWheel();}catch(e0){}
        if(c300v25AnyLit(startup))leds=startup;
        else if(c300v25Game()&&!c300v25Engine())leds=c300v25Ignition()?c300v25IgnitionWheel('#FFFFFF00'):c300v25IgnitionWheel('#FFFF0000');
        else{
            var exitAlert=c300v26PitExitWheel();
            if(exitAlert)leds=exitAlert;
            else if(c300v25Game()&&c300v25Engine()&&c300v25Limiter())leds=c300v25PitWheel();
            else{
                leds=cp300v14CoreWheelNoFlag();
                try{var flag=cp300v13FlagColour();if(flag)leds=cp300v13PaintFlags(leds,flag);}catch(e1){}
                leds=c300v25PitWarningRings(leds);
            }
        }
    }
    return c300v27ApplyFinalInputs(leds);
};

c300v27ApplyRearButtons = function(base){
    // Conspit hardware diagram is 1-based; getcontrollerbuttonstate is 0-based.
    var left=c300v27BackLevel(8,'leftRear');   // button ID 9
    var right=c300v27BackLevel(9,'rightRear'); // button ID 10

    // Wheel overlay starts at physical LED 13:
    // local [0,1] = LEDs 13,14; local [5,4] = LEDs 18,17.
    c300v27PaintPair(base,[0,1],left);
    c300v27PaintPair(base,[5,4],right);
    return base;
};

if (typeof C300V25 === 'object' && !C300V25.funkyFeedback) {
    C300V25.funkyFeedback = { prev:{}, last:{left:0,right:0}, held:{left:false,right:false} };
}

function c300v29FunkyState(){
    if (!C300V25.funkyFeedback) C300V25.funkyFeedback={prev:{},last:{left:0,right:0},held:{left:false,right:false}};
    return C300V25.funkyFeedback;
}

function c300v29FunkyRead(id){
    try { return !!getcontrollerbuttonstate('0x3514,0x000E', id); } catch(e) { return false; }
}

function c300v29FunkyEdge(id,key){
    var st=c300v29FunkyState(), now=Date.now(), live=c300v29FunkyRead(id), old=!!st.prev[key], edge=(live&&!old);
    try { if (isincreasing(900,getcontrollerbuttonstate('0x3514,0x000E',id))) edge=true; } catch(e0) {}
    try { if (isdecreasing(900,getcontrollerbuttonstate('0x3514,0x000E',id))) edge=true; } catch(e1) {}
    try { if (Changed(900,getcontrollerbuttonstate('0x3514,0x000E',id))) edge=true; } catch(e2) {}
    st.prev[key]=live;
    return edge;
}

function c300v29CaptureFunky(){
    var st=c300v29FunkyState(), now=Date.now();
    var leftIds=[20,21,22,23,24,25,26], rightIds=[27,28,29];
    var leftHeld=false, rightHeld=false, leftEdge=false, rightEdge=false;
    for(var i=0;i<leftIds.length;i++){
        var li=leftIds[i]; if(c300v29FunkyRead(li))leftHeld=true;
        if(c300v29FunkyEdge(li,'L'+li))leftEdge=true;
    }
    for(var j=0;j<rightIds.length;j++){
        var ri=rightIds[j]; if(c300v29FunkyRead(ri))rightHeld=true;
        if(c300v29FunkyEdge(ri,'R'+ri))rightEdge=true;
    }
    st.held.left=leftHeld; st.held.right=rightHeld;
    if(leftEdge)st.last.left=now;
    if(rightEdge)st.last.right=now;
}

function c300v29FunkyColour(side){
    var st=c300v29FunkyState(), now=Date.now(), held=!!st.held[side], age=now-Number(st.last[side]||0);
    if(!held&&(age<0||age>900))return null;
    var wave;
    if(held){
        var hp=(now%720)/720; wave=0.5-0.5*Math.cos(2*Math.PI*hp);
    }else{
        var period=300, local=(age%period)/period; wave=Math.sin(Math.PI*local);
        if(wave<0)wave=0;
    }
    wave=c300v25Clamp(wave,0,1);
    return c300v25Blend('#FF020202','#FFFFFFFF',0.12+0.88*wave);
}

function c300v29ApplyFunky(base){
    c300v29CaptureFunky();
    var left=c300v29FunkyColour('left'), right=c300v29FunkyColour('right');
    // Local wheel indices 2 and 6 correspond to physical LEDs 15 and 19.
    if(left!==null)base[2]=left;
    if(right!==null)base[6]=right;
    return base;
}

var c300v29BaseFinalInputs=c300v27ApplyFinalInputs;

c300v27ApplyFinalInputs=function(base){
    base=c300v29BaseFinalInputs(base);
    return c300v29ApplyFunky(base);
};

function c300v11Prop(name,fallback){
    try{var v=$prop(name);return (v===undefined||v===null||v===''||v==='--')?fallback:v;}catch(e){return fallback;}
}

function c300v11Norm(v){
    var s=String(v===undefined||v===null?'':v).toLowerCase();
    try{s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(e){}
    return s.replace(/&/g,' and ').replace(/[^a-z0-9#]+/g,' ').replace(/\s+/g,' ').trim();
}

function c300v11Compact(v){return c300v11Norm(v).replace(/[^a-z0-9]/g,'');}

function c300v11Bundle(){
    var textKeys=['CarModel', 'CarId', 'CarName', 'CarClass', 'CarCategory', 'CarNumber', 'TeamName', 'DataCorePlugin.GameData.NewData.CarModel', 'DataCorePlugin.GameData.NewData.CarId', 'DataCorePlugin.GameData.NewData.CarName', 'DataCorePlugin.GameData.NewData.CarClass', 'DataCorePlugin.GameData.NewData.CarCategory', 'DataCorePlugin.GameData.NewData.CarNumber', 'DataCorePlugin.GameData.NewData.TeamName', 'GameRawData.VehicleName', 'GameRawData.CarName', 'GameRawData.CarNumber', 'GameRawData.TeamName', 'GameRawData.CurrentPlayerVehicleName', 'GameRawData.CurrentPlayerCarName', 'GameRawData.Telemetry.PlayerCarName', 'GameRawData.Telemetry.PlayerCarModel', 'GameRawData.Telemetry.PlayerCarNumber', 'GameRawData.Telemetry.PlayerTeamName'];
    var numberKeys=['CarNumber', 'DataCorePlugin.GameData.NewData.CarNumber', 'GameRawData.CarNumber', 'GameRawData.Telemetry.PlayerCarNumber'];
    var parts=[],numbers=[];
    for(var i=0;i<textKeys.length;i++){
        var v=c300v11Prop(textKeys[i],'');if(v!==''&&v!==null&&v!==undefined)parts.push(String(v));
    }
    for(var j=0;j<numberKeys.length;j++){
        var n=c300v11Prop(numberKeys[j],'');if(n!==''&&n!==null&&n!==undefined)numbers.push(String(n));
    }
    var cls=c300v11Norm(c300v11Prop('CarClass',
        c300v11Prop('DataCorePlugin.GameData.NewData.CarClass',
        '')));
    var text=c300v11Norm(parts.join(' | '));
    return {text:text,compact:c300v11Compact(text),cls:cls,numbers:numbers,signature:text+'||'+cls+'||'+numbers.join('|')};
}

function c300v11IsHyperBundle(b){
    var c=b.cls,t=b.text;
    return c.indexOf('hyper')>=0||c.indexOf('lmh')>=0||c.indexOf('lmdh')>=0||
           t.indexOf('hypercar')>=0||t.indexOf(' lmh')>=0||t.indexOf(' lmdh')>=0;
}

function c300v11Canonical(){
    return '';




    // Hypercar models, including the 2026 Toyota and Evo/Joker identities.


    // Team/livery fallbacks. Manufacturer names shared by both classes are gated.




    // Final defensive route. Numbers are accepted only after the class is known.




}

function c300v11HyperParent(){
    var b=c300v11Bundle();return c300v11IsHyperBundle(b)||(
        false);
}

function c300v12Clamp(v, a, b) { return Math.max(a, Math.min(b, Number(v) || 0)); }

function c300v12Smooth01(t) {
    t = c300v12Clamp(t, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function c300v12Bell(distance, width) {
    width = Math.max(0.05, Number(width) || 0.72);
    return Math.exp(-0.5 * (distance * distance) / (width * width));
}

function c300v12Fade(age, duration) {
    var fadeIn = c300v12Clamp(age / 115, 0, 1);
    var fadeOut = c300v12Clamp((duration - age) / 150, 0, 1);
    return c300v12Smooth01(Math.min(fadeIn, fadeOut));
}

function c300v12Black() { return '#FF000000'; }

function c300v12Norm(v) {
    var s = String(v === undefined || v === null ? '' : v).toLowerCase();
    try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    return s.replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function c300v12Compact(v) { return c300v12Norm(v).replace(/[^a-z0-9]/g, ''); }

function c300v12Prop(name, fallback) {
    try {
        var v = $prop(name);
        if (v === undefined || v === null || v === '' || v === '--') return fallback;
        return v;
    } catch (e) { return fallback; }
}

function c300v12AbsContext() {
    var parts = [];
    var keys = ['DataCorePlugin.CurrentGame', 'GameName', 'CarClass', 'CarCategory', 'CarModel', 'CarName', 'CarId', 'TeamName', 'DataCorePlugin.GameData.NewData.CarClass', 'DataCorePlugin.GameData.NewData.CarCategory', 'DataCorePlugin.GameData.NewData.CarModel', 'DataCorePlugin.GameData.NewData.CarName', 'GameRawData.Telemetry.PlayerCarModel', 'GameRawData.Telemetry.PlayerCarName'];
    for (var i = 0; i < keys.length; i++) {
        var v = c300v12Prop(keys[i], '');
        if (v !== '') parts.push(String(v));
    }
    try {
        if (typeof c300v11Bundle === 'function') {
            var b = c300v11Bundle();
            if (b) parts.push(JSON.stringify(b));
        }
    } catch (e0) {}
    return c300v12Compact(parts.join(' '));
}

function c300v12AbsEligible() {
    // The proven LMU canonical resolver is the strongest authority.
    try {
        if (typeof c300v11HyperParent === 'function' && false) return false;
    } catch (e0) {}
    try {
        if (typeof c300v11Canonical === 'function') {
            var key = "";
            var noAbsCanonical = [
                'toyota','peugeot','genesis','ferrari499','cadillac','bmw_hyper',
                'valkyrie','alpine','porsche963','lamborghini_sc63','isotta',
                'glickenhaus','vanwall'
            ];
            if (noAbsCanonical.indexOf(key) >= 0) return false;
        }
    } catch (e1) {}

    var text = c300v12AbsContext();
    var noAbsTokens = [
        'hypercar','hyper','lmdh','lmh','gtp','gtpclass','gtpcar','wecprototype','prototype',
        'lmp1','lmp2','lmp3','dpi','daytonaprototype',
        'formula1','formulaone','formulahybrid','superformula','indycar','dallara ir18','dallarair18'
    ];
    for (var i = 0; i < noAbsTokens.length; i++) {
        if (text.indexOf(c300v12Compact(noAbsTokens[i])) >= 0) return false;
    }
    return true;
}

var c300v12BaseCspAbsActive = (typeof csp300_ABSActive === 'function') ? csp300_ABSActive : function() { return false; };

var c300v12BaseAbsActive = (typeof cp300v6AbsActive === 'function') ? cp300v6AbsActive : function() { return false; };

csp300_ABSActive = function() {
    if (!c300v12AbsEligible()) return false;
    try { return !!c300v12BaseCspAbsActive(); } catch (e) { return false; }
};

cp300v6AbsActive = function() {
    if (!c300v12AbsEligible()) return false;
    try { return !!c300v12BaseAbsActive(); } catch (e) { return false; }
};

function c300v12MiddleOrder(wave) {
    if (wave.side === 'left') return wave.direction === 'up' ? [0,1,2,3] : [3,2,1,0];
    return wave.direction === 'up' ? [7,6,5,4] : [4,5,6,7];
}

function c300v12ApplyMiddleBaseWave(base, wave, age) {
    var duration = 780;
    if (age < 0 || age > duration) return;
    var order = c300v12MiddleOrder(wave);
    var head = (age / duration) * (order.length + 0.6);
    for (var i = 0; i < order.length; i++) {
        var dist = Math.abs(i - head);
        if (dist >= 2.1) continue;
        var strength = dist < 0.45 ? 1 : (dist < 1.15 ? 0.72 : 0.34);
        var idx = order[i];
        var current = base[idx] || c300v12Black();
        var white = null;
        try { white = c300v25Dim('#FFFFFFFF', strength); } catch (e0) { white = '#FFFFFFFF'; }
        try { base[idx] = c300v25Blend(current, white, 0.72 + 0.28 * strength); }
        catch (e1) { base[idx] = white; }
    }
}

function c300v12ApplyMiddleGoldHead(base, wave, age) {
    var duration = 1040;
    if (age < 0 || age > duration) return;
    var order = c300v12MiddleOrder(wave);
    var u = c300v12Smooth01(age / duration);
    var x = u * (order.length - 1);
    var envelope = c300v12Fade(age, duration);
    for (var i = 0; i < order.length; i++) {
        var dist = Math.abs(i - x);
        var head = c300v12Bell(dist, 0.66);
        var soft = c300v12Bell(dist, 1.18) * 0.24;
        var strength = c300v12Clamp((head + soft) * envelope, 0, 1);
        if (strength <= 0.025) continue;
        var idx = order[i];
        try { base[idx] = c300v25Dim('#FFFFFFFF', strength); }
        catch (e0) { base[idx] = '#FFFFFFFF'; }
    }
}

c300v25ApplyEncoders = function(base) {
    try { c300v25CaptureEncoders(); } catch (e0) {}
    var now = Date.now(), keep = [];
    var waves = (typeof C300V25 === 'object' && C300V25.encoderWaves) ? C300V25.encoderWaves : [];
    for (var w = 0; w < waves.length; w++) {
        var wave = waves[w];
        if (!wave || wave.kind !== 'middle') continue; // top thumb effects stay disabled
        var age = now - wave.at;
        if (age < 0 || age > 1040) continue;
        keep.push(wave);
        c300v12ApplyMiddleBaseWave(base, wave, age);
        c300v12ApplyMiddleGoldHead(base, wave, age);
    }
    if (typeof C300V25 === 'object') C300V25.encoderWaves = keep;
    return base;
};

function c300v13Clamp(v, lo, hi) {
    v = Number(v);
    if (!Number.isFinite(v)) v = 0;
    return Math.max(lo, Math.min(hi, v));
}

function c300v13Black() { return '#FF000000'; }

function c300v13CaptureEncoders() {
    // Hardware diagram is one-based. SimHub HID button IDs are zero-based.
    // Top left direction A: 73,77,...113 -> 72,76,...112
    // Top left direction B: 74,78,...114 -> 73,77,...113
    // Top right direction A: 75,79,...115 -> 74,78,...114
    // Top right direction B: 76,80,...116 -> 75,79,...115
    if (c300v25AnyPulse([72,76,80,84,88,92,96,100,104,108,112], 'v13_tl_a')) c300v25EncoderStart('left','top','down');
    if (c300v25AnyPulse([73,77,81,85,89,93,97,101,105,109,113], 'v13_tl_b')) c300v25EncoderStart('left','top','up');
    if (c300v25AnyPulse([74,78,82,86,90,94,98,102,106,110,114], 'v13_tr_a')) c300v25EncoderStart('right','top','down');
    if (c300v25AnyPulse([75,79,83,87,91,95,99,103,107,111,115], 'v13_tr_b')) c300v25EncoderStart('right','top','up');

    // Middle thumb wheels: diagram 17/18 left and 19/20 right.
    if (c300v25AnyPulse([16], 'v13_ml_down')) c300v25EncoderStart('left','middle','down');
    if (c300v25AnyPulse([17], 'v13_ml_up'))   c300v25EncoderStart('left','middle','up');
    if (c300v25AnyPulse([18], 'v13_mr_down')) c300v25EncoderStart('right','middle','down');
    if (c300v25AnyPulse([19], 'v13_mr_up'))   c300v25EncoderStart('right','middle','up');
}

c300v25CaptureEncoders = function() { return c300v13CaptureEncoders(); };

function c300v13EncoderOrder(wave) {
    if (wave.kind === 'top') {
        if (wave.side === 'left') return wave.direction === 'up' ? [1,0] : [0,1];
        return wave.direction === 'up' ? [5,4] : [4,5];
    }
    if (wave.side === 'left') return wave.direction === 'up' ? [3,2,1,0] : [0,1,2,3];
    return wave.direction === 'up' ? [7,6,5,4] : [4,5,6,7];
}

function c300v13Ease(t) {
    t = c300v13Clamp(t,0,1);
    return t*t*t*(t*(t*6-15)+10);
}

function c300v13Bell(d,w) { return Math.exp(-0.5*(d*d)/(w*w)); }

function c300v13Envelope(age,duration) {
    var a = c300v13Ease(c300v13Clamp(age/90,0,1));
    var b = c300v13Ease(c300v13Clamp((duration-age)/145,0,1));
    return Math.min(a,b);
}

function c300v13ThemeButton(index) {
    try { return cp300v4ButtonThemeAt(index); } catch (e) { return '#FF101010'; }
}

function c300v13Dim(colour, strength) {
    try { return c300v25Dim(colour, strength); } catch (e) { return colour; }
}

function c300v13Blend(a,b,t) {
    try { return c300v25Blend(a,b,t); } catch (e) { return t > 0.5 ? b : a; }
}

function c300v13PaintTop(base,wave,age) {
    var duration = 680, order = c300v13EncoderOrder(wave);
    if (age < 0 || age > duration) return;
    var x = c300v13Ease(age/duration) * (order.length-1);
    var env = c300v13Envelope(age,duration);
    for (var q=0;q<order.length;q++) base[order[q]] = c300v13Dim(c300v13ThemeButton(order[q]),0.06);
    for (var i=0;i<order.length;i++) {
        var d=Math.abs(i-x), head=c300v13Bell(d,0.42), trail=c300v13Bell(d,0.88)*0.22;
        var strength=c300v13Clamp((head+trail)*env,0,1);
        base[order[i]]=c300v13Blend(c300v13Black(),'#FFFFFFFF',strength);
    }
}

function c300v13PaintMiddle(base,wave,age) {
    var order = c300v13EncoderOrder(wave), duration = 1040;
    if (age < 0 || age > duration) return;
    for (var q=0;q<order.length;q++) base[order[q]] = c300v13Dim(c300v13ThemeButton(order[q]),0.055);

    // Original 290 GP directional wave.
    if (age <= 780) {
        var headA=(age/780)*(order.length+0.6);
        for (var a=0;a<order.length;a++) {
            var da=Math.abs(a-headA), sa=da<0.45?1:(da<1.15?0.72:(da<2.1?0.34:0));
            if (sa>0) base[order[a]]=c300v13Blend(base[order[a]],'#FFFFFFFF',0.64+0.36*sa);
        }
    }

    // Smooth white travelling head layered over the directional wave.
    var x=c300v13Ease(age/duration)*(order.length-1),env=c300v13Envelope(age,duration);
    for (var i=0;i<order.length;i++) {
        var d=Math.abs(i-x), head=c300v13Bell(d,0.60), soft=c300v13Bell(d,1.15)*0.24;
        var strength=c300v13Clamp((head+soft)*env,0,1);
        if (strength>0.015) base[order[i]]=c300v13Dim('#FFFFFFFF',strength);
    }
}

c300v25ApplyEncoders = function(base) {
    try { c300v13CaptureEncoders(); } catch (e0) {}
    var now=Date.now(),keep=[];
    var waves=(typeof C300V25==='object'&&C300V25.encoderWaves)?C300V25.encoderWaves:[];
    for (var i=0;i<waves.length;i++) {
        var wave=waves[i];
        if (!wave || (wave.kind!=='top'&&wave.kind!=='middle')) continue;
        var age=now-wave.at, duration=wave.kind==='top'?680:1040;
        if (age<0||age>duration) continue;
        keep.push(wave);
        if (wave.kind==='top') c300v13PaintTop(base,wave,age);
        else c300v13PaintMiddle(base,wave,age);
    }
    if (typeof C300V25==='object') C300V25.encoderWaves=keep;
    return base;
};

function c300v14Clamp(v,a,b){ return Math.max(a,Math.min(b,Number(v)||0)); }

function c300v14Smooth01(t){
    t=c300v14Clamp(t,0,1);
    return t*t*t*(t*(t*6-15)+10);
}

function c300v14Bell(distance,width){
    width=Math.max(0.05,Number(width)||0.72);
    return Math.exp(-0.5*(distance*distance)/(width*width));
}

function c300v14Fade(age,duration){
    var fadeIn=c300v14Clamp(age/115,0,1);
    var fadeOut=c300v14Clamp((duration-age)/150,0,1);
    return c300v14Smooth01(Math.min(fadeIn,fadeOut));
}

function c300v14Dim(colour,strength){
    try{return c300v25Dim(colour,strength);}catch(e0){}
    try{return cp300v4Dim(colour,strength);}catch(e1){}
    return colour;
}

function c300v14Blend(a,b,t){
    try{return c300v25Blend(a,b,t);}catch(e0){}
    try{return cp300v4Blend(a,b,t);}catch(e1){}
    return t>=0.5?b:a;
}

var C300V14_INPUT=globalThis.C300V14_INPUT||{prev:{},last:{},waves:[]};

function c300v14Read(id){
    try{return !!getcontrollerbuttonstate('0x3514,0x000E',id);}catch(e){return false;}
}

function c300v14Rising(id,key){
    var live=c300v14Read(id),old=!!C300V14_INPUT.prev[key],rise=live&&!old;
    try{if(isincreasing(900,getcontrollerbuttonstate('0x3514,0x000E',id)))rise=true;}catch(e0){}
    C300V14_INPUT.prev[key]=live;
    return rise;
}

function c300v14AnyRising(ids,key){
    var rise=false;
    for(var i=0;i<ids.length;i++)if(c300v14Rising(ids[i],key+'_'+ids[i]))rise=true;
    if(!rise)return false;
    var now=Date.now(),last=Number(C300V14_INPUT.last[key]||0);
    if(now-last<92)return false;
    C300V14_INPUT.last[key]=now;
    return true;
}

function c300v14StartWave(side,kind,direction){
    var keep=[];
    for(var i=0;i<C300V14_INPUT.waves.length;i++){
        var w=C300V14_INPUT.waves[i];
        if(w.side===side&&w.kind===kind)continue;
        keep.push(w);
    }
    keep.push({side:side,kind:kind,direction:direction,at:Date.now()});
    C300V14_INPUT.waves=keep;
}

function c300v14CaptureEncoders(){
    // Top silver thumb rollers. Normal pairs are diagram 13/14 and 15/16,
    // converted to zero-based 12/13 and 14/15. The high families are the same
    // direction signals while the wheel's mode selectors are in other positions.
    if(c300v14AnyRising([12,72,76,80,84,88,92,96,100,104,108,112],'tl_down'))c300v14StartWave('left','top','down');
    if(c300v14AnyRising([13,73,77,81,85,89,93,97,101,105,109,113],'tl_up'))c300v14StartWave('left','top','up');
    if(c300v14AnyRising([14,74,78,82,86,90,94,98,102,106,110,114],'tr_down'))c300v14StartWave('right','top','down');
    if(c300v14AnyRising([15,75,79,83,87,91,95,99,103,107,111,115],'tr_up'))c300v14StartWave('right','top','up');

    // Middle P-ENC rollers, diagram 17/18 left and 19/20 right.
    if(c300v14AnyRising([16],'ml_down'))c300v14StartWave('left','middle','down');
    if(c300v14AnyRising([17],'ml_up'))c300v14StartWave('left','middle','up');
    if(c300v14AnyRising([18],'mr_down'))c300v14StartWave('right','middle','down');
    if(c300v14AnyRising([19],'mr_up'))c300v14StartWave('right','middle','up');
}

function c300v14WaveOrder(w){
    if(w.kind==='top'){
        if(w.side==='left')return w.direction==='up'?[1,0]:[0,1];
        return w.direction==='up'?[4,5]:[5,4];
    }
    if(w.side==='left')return w.direction==='up'?[3,2,1,0]:[0,1,2,3];
    return w.direction==='up'?[4,5,6,7]:[7,6,5,4];
}

function c300v14ApplyReferenceBaseWave(base,wave,age){
    var duration=wave.kind==='middle'?780:680;
    if(age<0||age>duration)return;
    var order=c300v14WaveOrder(wave),head=(age/duration)*(order.length+0.6);
    for(var i=0;i<order.length;i++){
        var dist=Math.abs(i-head);
        if(dist>=2.1)continue;
        var strength=dist<0.45?1:(dist<1.15?0.72:0.34);
        var idx=order[i],under=base[idx]||'#FF000000';
        base[idx]=c300v14Blend(under,c300v14Dim('#FFFFFFFF',strength),0.72+0.28*strength);
    }
}

function c300v14ApplyExactMiddleHead(base,wave,age){
    var duration=1040;
    if(age<0||age>duration)return;
    var order=c300v14WaveOrder(wave);
    var u=c300v14Smooth01(age/duration),x=u*(order.length-1),envelope=c300v14Fade(age,duration);
    for(var i=0;i<order.length;i++){
        var dist=Math.abs(i-x);
        var head=c300v14Bell(dist,0.66),soft=c300v14Bell(dist,1.18)*0.24;
        var strength=c300v14Clamp((head+soft)*envelope,0,1);
        if(strength>0.025)base[order[i]]=c300v14Dim('#FFFFFFFF',strength);
    }
}

c300v25CaptureEncoders=function(){return c300v14CaptureEncoders();};

c300v25ApplyEncoders=function(base){
    c300v14CaptureEncoders();
    var now=Date.now(),keep=[];
    for(var i=0;i<C300V14_INPUT.waves.length;i++){
        var wave=C300V14_INPUT.waves[i];
        var retention=wave.kind==='middle'?1040:680;
        var age=now-wave.at;
        if(age<0||age>retention)continue;
        keep.push(wave);
        c300v14ApplyReferenceBaseWave(base,wave,age);
        if(wave.kind==='middle')c300v14ApplyExactMiddleHead(base,wave,age);
    }
    C300V14_INPUT.waves=keep;
    // Retire stale waves from older encoder layers so they cannot paint beneath
    // the final reference renderer.
    try{if(typeof C300V25==='object')C300V25.encoderWaves=[];}catch(e0){}
    return base;
};

function c300v15MiddleFamily(first, last) {
    var out=[];
    for(var id=first; id<=last; id+=4) out.push(id);
    return out;
}

function c300v15MergeIds() {
    var out=[], seen={};
    for(var a=0;a<arguments.length;a++){
        var arr=arguments[a]||[];
        for(var i=0;i<arr.length;i++){
            var id=Number(arr[i]);
            if(!isFinite(id)||seen[id])continue;
            seen[id]=true;out.push(id);
        }
    }
    return out;
}

var C300V15_MIDDLE_IDS = {
    leftDown:  c300v15MergeIds([16,22], c300v15MiddleFamily(72,112)),
    leftUp:    c300v15MergeIds([17,23], c300v15MiddleFamily(73,113)),
    rightDown: c300v15MergeIds([18,24], c300v15MiddleFamily(74,114)),
    rightUp:   c300v15MergeIds([19,25], c300v15MiddleFamily(75,115))
};

c300v14CaptureEncoders=function(){
    // Fixed top silver thumb rollers only.
    if(c300v14AnyRising([12],'tl_down'))c300v14StartWave('left','top','down');
    if(c300v14AnyRising([13],'tl_up'))c300v14StartWave('left','top','up');
    if(c300v14AnyRising([14],'tr_down'))c300v14StartWave('right','top','down');
    if(c300v14AnyRising([15],'tr_up'))c300v14StartWave('right','top','up');

    // Middle P-Encoder 2/3, including every programming-knob remap family.
    if(c300v14AnyRising(C300V15_MIDDLE_IDS.leftDown,'ml_down'))c300v14StartWave('left','middle','down');
    if(c300v14AnyRising(C300V15_MIDDLE_IDS.leftUp,'ml_up'))c300v14StartWave('left','middle','up');
    if(c300v14AnyRising(C300V15_MIDDLE_IDS.rightDown,'mr_down'))c300v14StartWave('right','middle','down');
    if(c300v14AnyRising(C300V15_MIDDLE_IDS.rightUp,'mr_up'))c300v14StartWave('right','middle','up');
};

c300v25CaptureEncoders=function(){return c300v14CaptureEncoders();};

var C300V110=globalThis.C300V110||{prev:{},last:{},waves:[],buttons:{},rear:{}};

function c300v110raw(id){try{return !!getcontrollerbuttonstate('0x3514,0x000E',Number(id));}catch(e){return false;}}

function c300v110clamp(v,a,b){v=Number(v)||0;return Math.max(a,Math.min(b,v));}

function c300v110smooth(t){t=c300v110clamp(t,0,1);return t*t*t*(t*(t*6-15)+10);}

function c300v110dim(c,t){try{return cp300v4Dim(c,t);}catch(e){return t>.03?c:'#FF000000';}}

function c300v110blend(a,b,t){try{return cp300v4Blend(a,b,t);}catch(e){return t>.5?b:a;}}

function c300v110edge(id,key){var n=Date.now(),live=c300v110raw(id),k=key+'_'+id,old=!!C300V110.prev[k],hit=live&&!old;C300V110.prev[k]=live;try{if(isincreasing(700,getcontrollerbuttonstate('0x3514,0x000E',id)))hit=true;}catch(e0){}try{if(Changed(700,getcontrollerbuttonstate('0x3514,0x000E',id))&&live)hit=true;}catch(e1){}if(!hit)return false;var l=Number(C300V110.last[k]||0);if(n-l<65)return false;C300V110.last[k]=n;return true;}

function c300v110any(ids,key){for(var i=0;i<ids.length;i++)if(c300v110edge(ids[i],key))return true;return false;}

function c300v110fam(first,last){var a=[];for(var i=first;i<=last;i+=4)a.push(i);return a;}

var C300V110_MAP={
 tlD:[12],tlU:[13],trD:[14],trU:[15],
 mlD:[16,22].concat(c300v110fam(72,112)),mlU:[17,23].concat(c300v110fam(73,113)),
 mrD:[18,24].concat(c300v110fam(74,114)),mrU:[19,25].concat(c300v110fam(75,115))
};

function c300v110start(side,kind,dir){var a=[];for(var i=0;i<C300V110.waves.length;i++){var w=C300V110.waves[i];if(!(w.side===side&&w.kind===kind))a.push(w);}a.push({side:side,kind:kind,dir:dir,at:Date.now()});C300V110.waves=a;}

function c300v110capture(){if(c300v110any(C300V110_MAP.tlD,'tlD'))c300v110start('L','top','D');if(c300v110any(C300V110_MAP.tlU,'tlU'))c300v110start('L','top','U');if(c300v110any(C300V110_MAP.trD,'trD'))c300v110start('R','top','D');if(c300v110any(C300V110_MAP.trU,'trU'))c300v110start('R','top','U');if(c300v110any(C300V110_MAP.mlD,'mlD'))c300v110start('L','mid','D');if(c300v110any(C300V110_MAP.mlU,'mlU'))c300v110start('L','mid','U');if(c300v110any(C300V110_MAP.mrD,'mrD'))c300v110start('R','mid','D');if(c300v110any(C300V110_MAP.mrU,'mrU'))c300v110start('R','mid','U');}

function c300v110order(w){if(w.kind==='top'){if(w.side==='L')return w.dir==='U'?[1,0]:[0,1];return w.dir==='U'?[4,5]:[5,4];}if(w.side==='L')return w.dir==='U'?[3,2,1,0]:[0,1,2,3];return w.dir==='U'?[4,5,6,7]:[7,6,5,4];}

function c300v110bell(d,w){return Math.exp(-.5*d*d/(w*w));}

function c300v110env(age,dur){return c300v110smooth(Math.min(c300v110clamp(age/75,0,1),c300v110clamp((dur-age)/135,0,1)));}

function c300v110paintWaves(out){c300v110capture();var now=Date.now(),keep=[];for(var q=0;q<C300V110.waves.length;q++){var w=C300V110.waves[q],dur=w.kind==='mid'?1040:680,age=now-w.at;if(age<0||age>dur)continue;keep.push(w);var o=c300v110order(w),env=c300v110env(age,dur);if(w.kind==='mid'&&age<=780){var h=(age/780)*(o.length+.6);for(var a=0;a<o.length;a++){var d=Math.abs(a-h),s=d<.45?1:(d<1.15?.72:(d<2.1?.34:0));if(s>0)out[o[a]]=c300v110dim('#FFFFFFFF',(.62+.38*s)*env);}}var x=c300v110smooth(age/dur)*(o.length-1);for(var i=0;i<o.length;i++){var dist=Math.abs(i-x),s2=c300v110clamp((c300v110bell(dist,w.kind==='mid'?.62:.42)+c300v110bell(dist,w.kind==='mid'?1.15:.9)*.24)*env,0,1);if(s2>.015)out[o[i]]=c300v110blend('#FF020202','#FFFFFFFF',s2);}}C300V110.waves=keep;}

function c300v110triple(age){if(age<0||age>=840)return null;var p=Math.sin(Math.PI*((age%(840/3))/(840/3)));return p<.08?'#FF000000':c300v110dim('#FFFFFFFF',.3+.7*p);}

function c300v110hold(age){var p=((Math.max(0,age-240))%720)/720,b=.5-.5*Math.cos(2*Math.PI*p);return b<.045?'#FF000000':c300v110dim('#FFFFFFFF',.16+.84*b);}

function c300v110button(id,state){var now=Date.now(),live=c300v110raw(id),s=state[id];if(!s){s={down:live,at:live?now:0,rel:0,quick:false};state[id]=s;}if(live&&!s.down){s.at=now;s.rel=0;s.quick=false;}if(!live&&s.down){var held=now-s.at;s.rel=now;s.quick=held<430;}s.down=live;if(live)return now-s.at<240?'#FFFFFFFF':c300v110hold(now-s.at);if(s.quick&&s.rel){var c=c300v110triple(now-s.rel);if(c!==null)return c;}return null;}

function c300v110inputs(){var out=new Array(44).fill(null);for(var i=0;i<8;i++){var c=c300v110button(i,C300V110.buttons);if(c!==null)out[i]=c;}var l=c300v110button(8,C300V110.rear),r=c300v110button(9,C300V110.rear);if(l!==null){out[0]=l;out[1]=l;}if(r!==null){out[4]=r;out[5]=r;}c300v110paintWaves(out);return out;}

c300v25ApplyButtons=function(b){return b;};

c300v25ApplyEncoders=function(b){return b;};

c300v27ApplyRearButtons=function(b){return b;};

function c300v111Family(first,last){var a=[];for(var i=first;i<=last;i+=4)a.push(i);return a;}

C300V110_MAP={
    tlLeft:[12],tlRight:[13],trLeft:[14],trRight:[15],
    mlDown:[16,22].concat(c300v111Family(72,112)),mlUp:[17,23].concat(c300v111Family(73,113)),
    mrDown:[18,24].concat(c300v111Family(74,114)),mrUp:[19,25].concat(c300v111Family(75,115))
};

c300v110capture=function(){
    if(c300v110any(C300V110_MAP.tlLeft,'tlLeft'))c300v110start('L','top','LEFT');
    if(c300v110any(C300V110_MAP.tlRight,'tlRight'))c300v110start('L','top','RIGHT');
    if(c300v110any(C300V110_MAP.trLeft,'trLeft'))c300v110start('R','top','LEFT');
    if(c300v110any(C300V110_MAP.trRight,'trRight'))c300v110start('R','top','RIGHT');
    if(c300v110any(C300V110_MAP.mlDown,'mlDown'))c300v110start('L','mid','DOWN');
    if(c300v110any(C300V110_MAP.mlUp,'mlUp'))c300v110start('L','mid','UP');
    if(c300v110any(C300V110_MAP.mrDown,'mrDown'))c300v110start('R','mid','DOWN');
    if(c300v110any(C300V110_MAP.mrUp,'mrUp'))c300v110start('R','mid','UP');
};

c300v110order=function(w){
    if(w.kind==='top') {
        if(w.side==='L') return w.dir==='LEFT'?[1,0]:[0,1];
        return w.dir==='LEFT'?[5,4]:[4,5];
    }
    if(w.side==='L') return w.dir==='UP'?[3,2,1,0]:[0,1,2,3];
    return w.dir==='UP'?[7,6,5,4]:[4,5,6,7];
};

try { if (typeof C300V110==='object') C300V110.waves=[]; } catch(e){}
