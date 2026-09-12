const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'profiles/rpm');
fs.mkdirSync(out, {recursive:true});
const sourceRoot = path.join(root, 'vendor/dnr-7.0.3') + path.sep;
const original = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'cartrees-12.json'),'utf8')).lengths['12'];
const csharpRedlines = JSON.parse(fs.readFileSync(sourceRoot+'csharp-redlines.json','utf8'));
const originalEngine = fs.readFileSync(sourceRoot+'engine.js','utf8');
const extractionContext = vm.createContext({$prop:()=>null});
vm.runInContext(originalEngine,extractionContext);
const redlines = Object.fromEntries(Object.keys(csharpRedlines).map(k=>[k,JSON.parse(vm.runInContext('JSON.stringify('+k+')',extractionContext))]));
const clone = x => JSON.parse(JSON.stringify(x));
const selectors = {};
const identities = [];
const nodeCounts = {};
function collect(node, game, conditions = []) {
  if (node.IsEnabled === false) return;
  let tests = conditions.slice();
  if (node.ContainerType === 'Groups.GameCarModelGroup') {
    tests.push(`function(){return $prop('CarModel') === ${JSON.stringify(node.CarModel)};}`);
    identities.push({game, model:node.CarModel, id:node.CarChoice?.CarId ?? null});
  }
  const expr = node.TriggerFormula?.Expression;
  if (expr && /\$prop\(['"]Car(?:Id|Model|Class)['"]\)/.test(expr)) tests.push(`function(){${expr}\n}`);
  if (['RPMSegments','ScriptedContent'].includes(node.ContainerType) && tests.length) {
    const key = tests.map(t => `(${t})()`).join(' && ');
    selectors[game].add(key);
  }
  for (const c of node.LedContainers ?? []) collect(c, game, tests);
}
for (const gameTree of original) {
  const game = gameTree.GameRestriction.SupportedGames[0];
  selectors[game] = new Set();
  collect(gameTree.LedContainers[0].LedContainers[0], game);
}
const selectorSource = 'function c300_hasCar(){\n switch($prop("DataCorePlugin.CurrentGame")){\n'+Object.entries(selectors).map(([g,tests])=>`case ${JSON.stringify(g)}: return ${[...tests].map(t=>`(${t})`).join(' ||\n') || 'false'};`).join('\n')+'\ndefault:return false;}}';
const selectStart = originalEngine.indexOf('function dnr_SelectCarRedline()');
const selectEnd = originalEngine.indexOf('function dnr_RedlineState()', selectStart);
let selectSource = originalEngine.slice(selectStart,selectEnd).replace(/dnr_/g,'c300_').replace(/\s*CarSupportedPuginOutput\s*=\s*(?:true|false);/g,'');
// Remove the status-only conditional left by the original function.
selectSource = selectSource.replace(/if \(c300_car != undefined\)\s*return c300_car;/, 'return c300_car;');
const tableSource = Object.entries(redlines).map(([k,v])=>'const '+k.replace(/^dnr_/,'c300_')+' = '+JSON.stringify(v)+';').join('\n');
const runtime = `// CONSPIT 300GT standalone RPM adapter. Non-official; data from DNR 7.0.3.
// This file configures only the 12-LED RPM section. No DNR plugin is required.
// Edit these options in the profile's embedded JavaScript editor.
const C300_OPTIONS = {darkMode:__DARK__, useCarRedline:true, lastGearRedline:true,
  darkMain:'#FFFF0000', darkAlt:'#FFFF8C00', genericStartFraction:0.70};
${tableSource}
${selectSource}
function c300_RedlineState(){
  const gear = String($prop('Gear'));
  const rpm = Number($prop('Rpms'));
  const maxGear = Number($prop('CarSettings_MaxGears'));
  if(!C300_OPTIONS.lastGearRedline && maxGear>0 && Number(gear)===maxGear) return false;
  const car = c300_SelectCarRedline();
  if(!C300_OPTIONS.useCarRedline || !car || !car.redline){
    const red = Number($prop('CarSettings_RedLineRPM'));
    return red>0 && rpm>=red;
  }
  const red = car.redline[gear] ?? car.redline.ALL;
  return red != null && rpm>=red;
}
function c300_TDM_Colour_Hex(role){return role==='main'?C300_OPTIONS.darkMain:C300_OPTIONS.darkAlt;}
${selectorSource}
function c300_generic(){
 const leds = Array(12).fill(null);
 const rpm = Number($prop('Rpms'));
 const max = Number($prop('CarSettings_RedLineRPM')) || Number($prop('MaxRpm'));
 if(!(max>0) || !(rpm>=0)) return leds;
 const start = max*C300_OPTIONS.genericStartFraction;
 for(let i=0;i<12;i++){
   if(rpm>=start+(max-start)*i/11) leds[i]=C300_OPTIONS.darkMode
     ? (i>=8?C300_OPTIONS.darkAlt:C300_OPTIONS.darkMain)
     : i<4?'#FF00FF00':i<8?'#FFFFFF00':'#FFFF0000';
 }
 if(c300_RedlineState()) return Array(12).fill(C300_OPTIONS.darkMode?C300_OPTIONS.darkAlt:'#FFFF0000');
 return leds;
}
`;
function transform(x) {
  if(Array.isArray(x)) return x.map(transform);
  if(!x || typeof x!=='object') return x;
  const result={};
  for(const [k,v]of Object.entries(x)) result[k]=(k==='Expression'||k==='PreExpression')&&typeof v==='string'
    ? v.replace(/\bdnr_RedlineState\b/g,'c300_RedlineState').replace(/\bdnr_TDM_Colour_Hex\b/g,'c300_TDM_Colour_Hex')
    : transform(v);
  if(result.ContainerType) nodeCounts[result.ContainerType]=(nodeCounts[result.ContainerType]||0)+1;
  return result;
}
const trees = transform(clone(original));
for(const g of trees) for(const half of g.LedContainers[0].LedContainers){
  half.ContainerType='Groups.CustomConditionalGroup';
  half.TriggerFormula={JSExt:6,Interpreter:1,Expression:half.Description.includes('TDM')?'return C300_OPTIONS.darkMode;':'return !C300_OPTIONS.darkMode;'};
}
const template = JSON.parse(fs.readFileSync(path.join(root, 'vendor/conspit/rpm-template.json'),'utf8'));
const generated = [];
for(const dark of [false,true]){
  const p=clone(template);
  const mode=dark?'TDM':'Full Colour';
  p.Name='300GT Standalone - DNR 7.0.3 RPM - '+mode;
  p.ProfileId=dark?'5de0d8b6-fa03-4132-a0c7-f4f968de6c3e':'d1bf598f-8a36-4cd6-9ae3-e2fb7a69dc24';
  p.Author='Personal standalone adaptation';
  p.Description='12-LED RPM section only. All embedded DNR 7.0.3 width-12 car trees; no DNR plugin dependency. Buttons/rings/flags/pit effects are not included. Non-official adaptation.';
  p.GlobalBrightness=30;
  p.GlobalBrightnessPreset={CurrentMode:0,Brightness:30,BrightnessSettings:{}};
  p.EmbeddedJavascript=runtime.replace('__DARK__',String(dark));
  p.UseStrictJSIsolation=true;
  p.UseProfileBrightness=true;
  p.TestLedsGameData={...p.TestLedsGameData,CarModel:'BMW M4 GT3 EVO',CarId:'bmwm4gt3',CarChoice:{CarId:'bmwm4gt3',CarModel:'BMW M4 GT3 EVO',GameCode:'IRacing',IsSet:true},GameName:'IRacing',GearEx:3,Gear:'3',MaxRpm:7500,RPMSMax:7500,GameRunning:true,PitLimiterOn:false};
  p.LedContainers=[{ContainerType:'Groups.GameRunningGroup',Description:'12 LED RPM output',LedContainers:[
    {ContainerType:'Groups.CustomConditionalGroup',Description:'Generic fallback (adapter behavior for unlisted cars)',TriggerFormula:{JSExt:6,Interpreter:1,Expression:'return !c300_hasCar();'},LedContainers:[{ContainerType:'ScriptedContent',Description:'Generic 12 LED RPM',LedCount:12,StartPosition:1,ContentFormula:{JSExt:6,Interpreter:1,Expression:'return c300_generic();'}}]},
    ...clone(trees)
  ]}];
  const file=dark?'300GT_DNR703_RPM_TDM.ledsprofile':'300GT_DNR703_RPM_FullColour.ledsprofile';
  fs.writeFileSync(path.join(out,file),JSON.stringify(p,null,2));
  generated.push({file,profileId:p.ProfileId,bytes:fs.statSync(path.join(out,file)).size});
  new vm.Script(p.EmbeddedJavascript);
}
const inventory = {scope:'RPM only; full wheel effect compilation requires original DNR 300GT device profiles',sourceVersion:'7.0.3',width:12,games:Object.keys(selectors),selectorsByGame:Object.fromEntries(Object.entries(selectors).map(([g,s])=>[g,s.size])),nodeCounts,explicitNamedCars:identities,generated};
inventory.redlineSource='Original embedded JavaScript tables, matching the retained native profile formulas. These differ from the C# redlines.json on some cars.';
fs.writeFileSync(path.join(root,'docs/rpm-inventory.json'),JSON.stringify(inventory,null,2));
console.log('Built two RPM-only profiles for ' + inventory.games.length + ' games');
