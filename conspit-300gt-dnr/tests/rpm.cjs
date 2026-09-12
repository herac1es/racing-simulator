const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const srcRoot=path.join(__dirname,'../vendor/dnr-7.0.3');
const source=fs.readFileSync(path.join(srcRoot,'engine.js'),'utf8');
const original=JSON.parse(fs.readFileSync(path.join(srcRoot,'cartrees-12.json'),'utf8')).lengths['12'];
let redlines=JSON.parse(fs.readFileSync(path.join(srcRoot,'csharp-redlines.json'),'utf8'));
let props={};
const results=[];
const check=(name,a,b)=>{assert.deepStrictEqual(a,b,name);results.push({name,passed:true});};
const normalize=x=>x===undefined?'__undefined__':JSON.parse(JSON.stringify(x));
const base={'DNRLEDs.TDMColour':0,'DNRLEDs.TDMColourMain':'#FFFF0000','DNRLEDs.TDMColourAlt':'#FFFF8C00',CarSettings_MaxGears:6,CarSettings_RedLineRPM:7500,Throttle:100,SpeedKmh:100};
const ctxOriginal=vm.createContext({$prop:k=>props[k]??null,Date:{now:()=>1000}});
vm.runInContext(source,ctxOriginal);
redlines=Object.fromEntries(Object.keys(redlines).map(k=>[k,JSON.parse(vm.runInContext('JSON.stringify('+k+')',ctxOriginal))]));
function undo(node){
 if(Array.isArray(node))return node.map(undo);
 if(!node||typeof node!=='object')return node;
 const out={};for(const [k,v]of Object.entries(node))out[k]=(k==='Expression'||k==='PreExpression')&&typeof v==='string'?v.replace(/\bc300_RedlineState\b/g,'dnr_RedlineState').replace(/\bc300_TDM_Colour_Hex\b/g,'dnr_TDM_Colour_Hex'):undo(v);
 return out;
}
function formulas(node,list=[]){if(!node||typeof node!=='object')return list;for(const [k,v]of Object.entries(node)){if(v&&typeof v==='object'&&typeof v.Expression==='string')list.push({kind:k,pre:v.PreExpression??'',body:v.Expression});else if(v&&typeof v==='object')formulas(v,list);}return list;}
const games={dnr_ACRedlines:'AssettoCorsa',dnr_ACRallyRedlines:'AssettoCorsaRally',dnr_ACCRedlines:'AssettoCorsaCompetizione',dnr_AMS2Redlines:'Automobilista2',dnr_EAWRCRedlines:'EAWRC23',dnr_iRacingRedlines:'IRacing',dnr_LMURedlines:'LMU'};
for(const mode of ['FullColour','TDM']){
 const p=JSON.parse(fs.readFileSync(path.join(__dirname,`../profiles/rpm/300GT_DNR703_RPM_${mode}.ledsprofile`),'utf8'));
 check(mode+' no DNR property dependency',/DNRLEDs\./.test(JSON.stringify(p)),false);
 const ctx=vm.createContext({$prop:k=>props[k]??null,Date:{now:()=>1000}});
 vm.runInContext(p.EmbeddedJavascript,ctx);
 const restored=undo(p.LedContainers[0].LedContainers.slice(1));
 for(const g of restored)for(const half of g.LedContainers[0].LedContainers){half.ContainerType='Base.Group';delete half.TriggerFormula;}
 check(mode+' original width-12 trees preserved',restored,original);
 const allFormulas=formulas(p.LedContainers);
 for(const [i,f]of allFormulas.entries()){
   new vm.Script(`(function(){${f.pre}\n${f.body}\n})()`);
   results.push({name:`${mode} formula syntax ${i}`,passed:true});
 }
 for(const [table,g]of Object.entries(games))for(const [ci,car]of redlines[table].entries()){
   for(const [gear,value]of Object.entries(car.redline??{})){
    if(typeof value!=='number')continue;
    for(const delta of [-1,0,1]){
     props={...base,'DataCorePlugin.CurrentGame':g,CarModel:car.name,CarId:g==='AssettoCorsa'||g==='AssettoCorsaRally'?car.name:car.carid,CarClass:car.carclass,Gear:gear==='ALL'?'3':gear,Rpms:value+delta};
     check(`${mode} redline ${g}/${ci}/${gear}/${delta}`,vm.runInContext('c300_RedlineState()',ctx),vm.runInContext('dnr_RedlineState()',ctxOriginal));
    }
   }
 }
 const sourceFormulas=formulas(original);
 for(const [i,f]of sourceFormulas.entries()){
   props={...base,'DataCorePlugin.CurrentGame':'IRacing',CarModel:'BMW M4 GT3 EVO',CarId:'bmwm4gt3',Gear:'3',Rpms:6900};
   const text=`(function(){${f.pre}\n${f.body}\n})()`;
   const adapted=text.replace(/\bdnr_RedlineState\b/g,'c300_RedlineState').replace(/\bdnr_TDM_Colour_Hex\b/g,'c300_TDM_Colour_Hex');
   check(`${mode} original formula equivalence ${i}`,normalize(vm.runInContext(adapted,ctx,{timeout:1000})),normalize(vm.runInContext(text,ctxOriginal,{timeout:1000})));
 }
 for(const gear of ['R','N','1','2','3','4','5','6']){
   props={...base,'DataCorePlugin.CurrentGame':'IRacing',CarModel:'BMW M4 GT3 EVO',CarId:'bmwm4gt3',Gear:gear,Rpms:0};
   check(mode+' M4 selector '+gear,vm.runInContext('c300_hasCar()',ctx),true);
 }
 props={...base,'DataCorePlugin.CurrentGame':'UnknownGame',CarModel:'UnknownCar',Gear:'3',Rpms:8000};
 check(mode+' unknown car fallback',vm.runInContext('c300_hasCar()',ctx),false);
 check(mode+' fallback length',vm.runInContext('c300_generic().length',ctx),12);
 props.CarSettings_RedLineRPM=0;
 check(mode+' missing RPM limit yields no lights',normalize(vm.runInContext('c300_generic()',ctx)),Array(12).fill(null));
}
const report={scope:'JSON structure preservation, standalone JS syntax, original-vs-adapted formula execution and redline table parity. No live SimHub import or device test.',passed:results.length,failed:0,results};
fs.writeFileSync(path.join(__dirname,'../.validation/rpm.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,failed:0,scope:report.scope},null,2));
