// Explicit, one-time migration. Normal builds use only this project's src/.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { parse, walk, edit, specialize, identifiers, reachable, evaluate, unknown } = require('./javascript.cjs');
const project = path.resolve(__dirname, '..');
const upstream = path.resolve(project, '../Conspit 300 GT Themes Pack V1.2/LEDs Profiles');
const json = (value) => JSON.stringify(value, null, 2) + '\n';
const save = (name, value) => {
  const target = path.join(project, 'src', name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' ? value : json(value));
};
const removed = [];
function migrateNode(node) {
  const label = node.Description || '';
  if (/^Rpms Function$|redline|RPM Synchronisation/i.test(label) && !/ - RPM & Redline$/.test(label)) {
    removed.push(label);
    return null;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.endsWith('Formula') && value && typeof value === 'object') {
      for (const field of ['Expression', 'PreExpression']) {
        if (value[field] && value.Interpreter === 1) value[field] = specialize(value[field]);
      }
    }
  }
  if (node.TriggerFormula?.Interpreter === 1) {
    const statements = parse(node.TriggerFormula.Expression || '').body;
    if (statements.length === 1 && statements[0].type === 'ReturnStatement') {
      const value = evaluate(statements[0].argument);
      if (value !== unknown && !value) { removed.push(label); return null; }
    }
  }
  if (node.LedContainers) {
    node.LedContainers = node.LedContainers.map(migrateNode).filter(Boolean);
    if (!node.LedContainers.length) return null;
  }
  // The existing profile sometimes advertises a 45th wheel LED; the 300 GT has
  // 8 button LEDs + 36 ring LEDs. Keep each migrated layer within those 44 slots.
  if (node.LedCount === 45) node.LedCount = 44;
  node.Description = label.replace(/ - RPM & Redline$/, ' - Top Status Lights')
    .replace(/ - Car-Specific RPM Output$/, ' - Top Telemetry');
  return node;
}
function formulas(value, out = []) {
  if (!value || typeof value !== 'object') return out;
  for (const [key, item] of Object.entries(value)) {
    if (key.endsWith('Formula') && item?.Interpreter === 1) {
      out.push(item.PreExpression || '', item.Expression || '');
    } else if (item && typeof item === 'object') formulas(item, out);
  }
  return out;
}
function themeRuntime(source) {
  const changes = [], values = {}, occurrences = {};
  // Only top-level palette assignments differ between the five upstream themes.
  for (const node of parse(source).body) {
    let name, value;
    if (node.type === 'VariableDeclaration' && node.declarations.length === 1) {
      name = node.declarations[0].id.name; value = node.declarations[0].init;
    } else if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
      name = node.expression.left.name; value = node.expression.right;
    }
    if (!/^CP300V\d+_/.test(name || '') || value?.type !== 'Literal' || typeof value.value !== 'string') continue;
    const key = name + '_' + (occurrences[name] = (occurrences[name] || 0) + 1);
    values[key] = value.value;
    changes.push({ start: value.start, end: value.end, text: `AMAZING_THEME.runtime[${JSON.stringify(key)}]` });
  }
  return { source: edit(source, changes), values };
}
function differences(base, value, keys = [], out = []) {
  if (JSON.stringify(base) === JSON.stringify(value)) return out;
  if (base && value && typeof base === 'object' && typeof value === 'object' &&
      JSON.stringify(Object.keys(base)) === JSON.stringify(Object.keys(value))) {
    for (const key of Object.keys(base)) differences(base[key], value[key], [...keys, key], out);
  } else out.push({ path: keys, value });
  return out;
}

const entries = [];
let baseProfile, sharedRuntime;
for (const filename of fs.readdirSync(upstream).filter((f) => f.endsWith('.ledsprofile')).sort()) {
  const raw = fs.readFileSync(path.join(upstream, filename), 'utf8');
  const profile = JSON.parse(raw);
  const themeName = profile.Name.replace(/^Conspit 300 GT /, '').replace(/ V1\.2$/, '');
  const slug = themeName.toLowerCase().replaceAll(' ', '-');
  const embedded = profile.EmbeddedJavascript;
  delete profile.EmbeddedJavascript;
  profile.LedContainers = profile.LedContainers.map(migrateNode).filter(Boolean);
  // Preserve the existing non-RPM top animations, while leaving the driving bar
  // transparent so fuel/brake/flags/spotter layers can render normally.
  const roots = new Set(formulas(profile).flatMap((s) => [...identifiers(s)]));
  const nonRpm = specialize(embedded);
  const trimmed = reachable(nonRpm, roots);
  const themed = themeRuntime(trimmed);
  if (!sharedRuntime) sharedRuntime = themed.source;
  else if (sharedRuntime !== themed.source) throw new Error(`Unexpected non-palette runtime difference in ${filename}`);
  profile.GameCode = 'IRacing';
  profile.Author = 'Heracles; based on Conspit 300 GT Themes Pack V1.2';
  profile.Name = 'amazing-leds-300gt';
  profile.ProfileId = null;
  profile.Description = 'iRacing non-RPM lights: buttons, encoders, flags, spotter, pit and startup effects. RPM lights are not included.';
  profile.TestLedsGameData.GameName = 'IRacing';
  profile.TestLedsGameData.CarModel = 'BMW M2 Racing (G87)';
  profile.TestLedsGameData.CarId = 'bmwm2g87';
  profile.TestLedsGameData.CarChoice = { CarId: 'bmwm2g87', CarModel: 'BMW M2 Racing (G87)', GameCode: 'IRacing', IsSet: true };
  profile.TestLedsGameData.RPMRedlineReached = false;
  profile.TestLedsGameData.RPMPercent = 0;
  if (!baseProfile) baseProfile = profile;
  const id = crypto.createHash('sha256').update('amazing-leds-300gt/' + slug).digest('hex');
  const profileId = `${id.slice(0,8)}-${id.slice(8,12)}-4${id.slice(13,16)}-a${id.slice(17,20)}-${id.slice(20,32)}`;
  save(`themes/${slug}.json`, { name: themeName, slug, profileId, runtime: themed.values, layoutOverrides: differences(baseProfile, profile) });
  entries.push({ file: filename, sha256: crypto.createHash('sha256').update(raw).digest('hex'), theme: slug });
  console.log(`${slug}: runtime ${embedded.length} -> ${trimmed.length} characters`);
}
save('profile.json', baseProfile);
save('runtime/inherited.js', '// Migrated non-RPM helpers from Conspit 300 GT Themes Pack V1.2.\n// Palette values live in src/themes/. Historical helper names preserve compatibility.\n' + sharedRuntime.replace(/^[\t ]+$/gm, ''));
save('upstream.json', {
  directory: path.relative(path.resolve(project, '..'), upstream),
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8' }).trim(),
  files: entries,
  removedContainers: [...new Set(removed)].sort(),
});
