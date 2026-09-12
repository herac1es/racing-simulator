const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const input=path.join(root,'vendor/conspit/base-v1.6.ledsprofile');
const out=path.join(root,'profiles');fs.mkdirSync(out,{recursive:true});
const source=JSON.parse(fs.readFileSync(input,'utf8').replace(/^\uFEFF/,''));
const rpm=JSON.parse(fs.readFileSync(path.join(out,'rpm/300GT_DNR703_RPM_FullColour.ledsprofile'),'utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));const p=clone(source);
const changes=[];
const js=Expression=>({JSExt:4,Interpreter:1,Expression});
p.Name='CONSPIT 300GT - Standalone V2.0 - DNR 7.0.3 Data';
p.ProfileId='3c70494a-f7ce-490d-98e4-9710341940a2';
p.Author='Personal adaptation of CONSPIT V1.6 framework and DNR 7.0.3 data';
p.Description=(source.Description??'')+'\r\n\r\nStandalone V2.0: CONSPIT 300GT Individual (ungrouped) framework; DNR 7.0.3 width-12 car trees and JS redlines. Runtime embedded, no DNR plugin required. Original buttons, knobs and effect priorities retained. Non-official adaptation. See accompanying README.';
p.EmbeddedJavascript=rpm.EmbeddedJavascript
 .replace('// This file configures only the 12-LED RPM section. No DNR plugin is required.','// Full CONSPIT V1.6 framework adapter. All helpers are embedded; no DNR plugin is required.')
 .replace('darkMode:false, useCarRedline:true, lastGearRedline:true,','darkMode:false, useCarRedline:true, lastGearRedline:true, safetyCarDelta:true, drsDetection:true,');
p.EmbeddedJavascript+=`
// Helpers required by the original CONSPIT F1 and wheel effects.
function c300_isnull(value,fallback){
  const missing=value===null||value===undefined;
  return arguments.length<2 ? missing : missing?fallback:value;
}
function c300_isF1(){return /^F120[0-9]{2}$/.test(String($prop('DataCorePlugin.CurrentGame')??''));}
function c300_scDisplayActive(){
  if(!C300_OPTIONS.safetyCarDelta || !c300_isF1()) return false;
  const status=Number($prop('GameRawData.PacketSessionData.m_safetyCarStatus'));
  const delta=$prop('GameRawData.PlayerLapData.m_safetyCarDelta');
  return (status===1||status===2) && delta!==null && delta!==undefined && delta!=='' && Number.isFinite(Number(delta));
}
function c300_drsDetection(){
  if(!C300_OPTIONS.drsDetection) return false;
  const game=$prop('DataCorePlugin.CurrentGame');
  return game==='IRacing' && $prop('GameRawData.Telemetry.DRS_Status')==1
    || game==='Automobilista2' && (($prop('GameRawData.mDrsState') & (1<<2))!==0)
    || c300_isF1() && Number($prop('GameRawData.PlayerCarStatusData.m_drsActivationDistance'))>0;
}
`;
const runner=p.LedContainers[0].LedContainers[1].LedContainers[0];
const originalGeneric=clone(runner.LedContainers[0]);
const oldSpecific=runner.LedContainers[1];
const f1=clone(oldSpecific.LedContainers.find(c=>c.Description==='F1 series'));
if(!f1)throw Error('F1 source branch missing');
f1.LedContainers[0].TriggerFormula=js('return !c300_scDisplayActive();');
f1.LedContainers[1].TriggerFormula=js('return c300_scDisplayActive();');
const updatedTrees=clone(rpm.LedContainers[0].LedContainers.slice(1));
originalGeneric.ContainerType='Groups.CustomConditionalGroup';
delete originalGeneric.GameRestriction;
originalGeneric.TriggerFormula=js('return !c300_hasCar() && !c300_isF1();');
originalGeneric.Description='Generic RPM - unlisted cars (original CONSPIT pattern)';
runner.LedContainers=[originalGeneric,...updatedTrees,f1,...runner.LedContainers.slice(2)];
changes.push({kind:'rpm',detail:'Replaced old 5-game car tables with all original DNR 7.0.3 width-12 trees for 7 games; kept original F1 branch and original generic pattern. Generic/specific/F1 selectors are mutually exclusive.'});
function adapt(node,where=''){
 if(!node||typeof node!=='object')return;
 if(node.GameRestriction?.SupportedGames?.some(g=>/^F120[0-9]{2}$/.test(g))){
   if(!node.GameRestriction.SupportedGames.includes('F12026')){node.GameRestriction.SupportedGames.push('F12026');changes.push({kind:'f1-game-list',path:where});}
 }
 for(const [k,v]of Object.entries(node)){
   if(v&&typeof v==='object'&&typeof v.Expression==='string'&&v.Interpreter===1){
     const before=v.Expression;
     if(v.Expression.includes('DNRLEDs.DRSDetectionPoint')) v.Expression='return c300_drsDetection();';
     v.Expression=v.Expression.replace(/\bdnr_RedlineState\b/g,'c300_RedlineState').replace(/\bdnr_DRS_detection\b/g,'c300_drsDetection').replace(/\bisnull\s*\(/g,'c300_isnull(');
     v.Expression=v.Expression.replace(/\$prop\('DataCorePlugin.CurrentGame'\)\.startsWith/g,"String($prop('DataCorePlugin.CurrentGame') ?? '').startsWith");
     // F1 bit-map color helper is local to each formula; name is retained from the source.
     v.JSExt=4;
     if(before!==v.Expression)changes.push({kind:'formula',path:where+'/'+k,before,after:v.Expression});
   }else if(v&&typeof v==='object')adapt(v,where+'/'+k);
 }
}
adapt(p.LedContainers,'/LedContainers');
if(/DNRLEDs\./.test(JSON.stringify(p)))throw Error('Unresolved DNR property dependency');
p.TestLedsGameData=clone(rpm.TestLedsGameData);
// Preserve original group brightness, LED ordering, disabled options and strict-isolation setting.
const file='CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile';
fs.writeFileSync(path.join(out,file),JSON.stringify(p,null,2));
fs.writeFileSync(path.join(root,'.validation/embedded-runtime.js'),p.EmbeddedJavascript);
fs.writeFileSync(path.join(root,'docs/changes.json'),JSON.stringify(changes,null,2));
const meta={sourcePath:'vendor/conspit/base-v1.6.ledsprofile',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex').toUpperCase(),profileId:p.ProfileId,framework:'User-provided CONSPIT V1.6',data:'DNR 7.0.3 original width-12 car trees and JavaScript redline tables',layout:{rpm:[1,12],buttons:[13,20],knobLeft:[21,32],knobCenter:[33,44],knobRight:[45,56]},file,bytes:fs.statSync(path.join(out,file)).size,changes:changes.length,limitations:['All effects present in the provided CONSPIT V1.6 framework retained; not a claim to include every effect introduced by newer official DNR device profiles.','TDM option affects the updated car-specific RPM branches; existing wheel/F1 effect colors remain the original framework colors.','F1 2026 is enabled using existing field layouts; telemetry compatibility requires game testing.','Hardware-specific raw telemetry availability still depends on SimHub and the game.']};
fs.writeFileSync(path.join(root,'docs/build-manifest.json'),JSON.stringify(meta,null,2));
console.log('Built full-wheel profile: ' + file);
