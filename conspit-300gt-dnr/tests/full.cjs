const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=JSON.parse(fs.readFileSync(path.join(__dirname,'../vendor/conspit/base-v1.6.ledsprofile'),'utf8'));
const profile=JSON.parse(fs.readFileSync(path.join(__dirname,'../profiles/CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile'),'utf8'));

const results=[];
function check(name,a,b){assert.deepStrictEqual(a,b,name);results.push({name,passed:true});}
function clean(x){
 if(Array.isArray(x))return x.filter(v=>v!=='F12026').map(clean);
 if(!x||typeof x!=='object')return x;
 const out={};for(const [k,v]of Object.entries(x)){
   if(k==='JSExt')continue;
   if(k==='Expression'&&typeof v==='string')out[k]=v.replace(/\bc300_isnull\(/g,'isnull(').replace(/String\(\$prop\('DataCorePlugin.CurrentGame'\) \?\? ''\)/g,"$prop('DataCorePlugin.CurrentGame')");
   else out[k]=clean(v);
 }return out;
}
check('All original button groups, colors, mappings, flags, spotter and priorities retained',clean(profile.LedContainers[1]),clean(base.LedContainers[1]));
check('All original knob groups, colors, mappings and priorities retained',clean(profile.LedContainers[2]),clean(base.LedContainers[2]));
for(const i of [0,2,3])check('RPM auxiliary group retained '+i,clean(profile.LedContainers[0].LedContainers[i]),clean(base.LedContainers[0].LedContainers[i]));
check('RPM pit/invalid-lap/speed-limit/start overlays retained',clean(profile.LedContainers[0].LedContainers[1].LedContainers.slice(1)),clean(base.LedContainers[0].LedContainers[1].LedContainers.slice(1)));
check('Source profile ID not reused',profile.ProfileId===base.ProfileId,false);
check('Original global brightness retained',profile.GlobalBrightness,base.GlobalBrightness);
check('No DNR property references',/DNRLEDs\./.test(JSON.stringify(profile)),false);
function nodes(x,out=[]){if(!x||typeof x!=='object')return out;if(x.ContainerType)out.push(x);for(const c of x.LedContainers??[])nodes(c,out);return out;}
const allNodes=nodes(profile);



function formulas(x,out=[]){if(!x||typeof x!=='object')return out;for(const [k,v]of Object.entries(x)){if(v&&typeof v==='object'&&typeof v.Expression==='string')out.push({kind:k,...v});else if(v&&typeof v==='object')formulas(v,out);}return out;}
const allFormulas=formulas(profile);
const scripts=allFormulas.filter(f=>f.Interpreter===1).map(f=>({formula:f,script:new vm.Script(`(function(){${f.PreExpression??''}\n${f.Expression}\n})()`)}));
check('All JS formulas load only embedded helpers',scripts.every(x=>x.formula.JSExt===4),true);
let props={};const ctx=vm.createContext({$prop:k=>props[k]??null,Date:{now:()=>1000}});vm.runInContext(profile.EmbeddedJavascript,ctx);
const defaults={CarSettings_MaxGears:6,CarSettings_RedLineRPM:7500,Throttle:100,SpeedKmh:100,Brake:0};
const scenarios=[{},
 {'DataCorePlugin.CurrentGame':'IRacing',CarModel:'BMW M4 GT3 EVO',CarId:'bmwm4gt3',Gear:'3',Rpms:6899},
 {'DataCorePlugin.CurrentGame':'IRacing',CarModel:'BMW M4 GT3 EVO',CarId:'bmwm4gt3',Gear:'3',Rpms:6900},
 {'DataCorePlugin.CurrentGame':'F12025',Gear:'3',Rpms:11000,'GameRawData.PlayerCarTelemetryData.m_revLightsBitValue':32767},
 {'DataCorePlugin.CurrentGame':'F12026',Gear:'3',Rpms:11000,'GameRawData.PacketSessionData.m_safetyCarStatus':1,'GameRawData.PlayerLapData.m_safetyCarDelta':-0.3,'GameRawData.PlayerCarTelemetryData.m_revLightsBitValue':32767},
 {'DataCorePlugin.CurrentGame':'LMU',CarClass:'GT3',CarModel:'Team WRT 2024',Gear:'6',Rpms:8000},
 {'DataCorePlugin.CurrentGame':'Automobilista2',CarModel:'Formula USA 2023',Gear:'6',Rpms:10000},
 {'DataCorePlugin.CurrentGame':'AssettoCorsa',CarId:'rss_formula_1990',Gear:'4',Rpms:13000}];
for(const [si,scenario]of scenarios.entries()){
 props={...defaults,...scenario};
 for(const [fi,{script}]of scripts.entries()){
   script.runInContext(ctx,{timeout:1000});
   results.push({name:`JS formula ${fi} executes in scenario ${si}`,passed:true});
 }
}
function scenario(name,properties,expression,expected){props={...defaults,...properties};check(name,vm.runInContext(expression,ctx),expected);}
const m4={R:6600,N:6600,1:7150,2:7150,3:6900,4:6900,5:6720,6:7100};
for(const [gear,rpm]of Object.entries(m4))for(const delta of [-1,0,1])scenario(`M4 ${gear} @ ${rpm+delta}`,{'DataCorePlugin.CurrentGame':'IRacing',CarModel:'BMW M4 GT3 EVO',CarId:'bmwm4gt3',Gear:gear,Rpms:rpm+delta},'c300_RedlineState()',delta>=0);
scenario('M4 uses specific branch',{'DataCorePlugin.CurrentGame':'IRacing',CarModel:'BMW M4 GT3 EVO'},'c300_hasCar()',true);
scenario('Unknown car gets generic branch',{'DataCorePlugin.CurrentGame':'IRacing',CarModel:'Unknown'},'c300_hasCar()',false);
const f1=allNodes.find(n=>n.Description==='F1 series'&&n.LedContainers?.[1]?.Description==='SC/VSC Delta Animation');
const normalF1=new vm.Script('(function(){'+f1.LedContainers[0].TriggerFormula.Expression+'})()');
const scF1=new vm.Script('(function(){'+f1.LedContainers[1].TriggerFormula.Expression+'})()');
for(const [status,delta,expected]of [[0,0,false],[1,0,true],[2,-1,true],[3,0,false],[1,null,false],[1,'',false],[1,'bad',false]]){
 props={...defaults,'DataCorePlugin.CurrentGame':'F12026','GameRawData.PacketSessionData.m_safetyCarStatus':status,'GameRawData.PlayerLapData.m_safetyCarDelta':delta};
 check(`SC display ${status}/${delta}`,scF1.runInContext(ctx),expected);
 check(`F1 RPM remains visible ${status}/${delta}`,normalF1.runInContext(ctx),!expected);
}
scenario('iRacing DRS detection',{'DataCorePlugin.CurrentGame':'IRacing','GameRawData.Telemetry.DRS_Status':1},'c300_drsDetection()',true);
scenario('AMS2 DRS detection',{'DataCorePlugin.CurrentGame':'Automobilista2','GameRawData.mDrsState':4},'c300_drsDetection()',true);
scenario('F1 DRS detection',{'DataCorePlugin.CurrentGame':'F12026','GameRawData.PlayerCarStatusData.m_drsActivationDistance':50},'c300_drsDetection()',true);
scenario('No telemetry DRS off',{},'c300_drsDetection()',false);
vm.runInContext('C300_OPTIONS.lastGearRedline=false',ctx);
scenario('Highest gear redline switch',{'DataCorePlugin.CurrentGame':'IRacing',CarModel:'BMW M4 GT3 EVO',Gear:'6',Rpms:8000},'c300_RedlineState()',false);
const report={scope:'Original non-RPM framework preservation, all JS formulas executed with synthetic inputs, M4 boundaries, F1 SC/DRS states. No live game or hardware test.',passed:results.length,failed:0,containers:allNodes.length,jsFormulas:scripts.length,ncalcFormulas:allFormulas.filter(f=>f.Interpreter!==1&&f.Expression.trim()).length,results};
fs.writeFileSync(path.join(__dirname,'../.validation/full.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,results:undefined},null,2));
