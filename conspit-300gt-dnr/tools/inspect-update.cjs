// Prepare a reviewable local candidate. Never runs the extracted engine or
// writes active vendor snapshots, provenance, profiles or SimHub settings.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const vm = require('node:vm');
const { root, verifySources } = require('./sources.cjs');
const resourceNames = {
  engine: 'DanielNewmanRacing.Plugin.Services.Rpm.DNR_LEDs_Engine.js',
  redlines: 'DanielNewmanRacing.Plugin.Services.Redline.redlines.json',
  trees: 'DanielNewmanRacing.Plugin.Services.Rpm.cartrees.json.gz',
};
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const parse = (bytes) => JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
function selectTrees(value) {
  const trees = value?.lengths?.['12'];
  if (!Array.isArray(trees) || !trees.length || trees.some(t => !t.ContainerType || !Array.isArray(t.LedContainers))) {
    throw new Error('Missing or changed width-12 car-tree schema; inspect RpmCarTreeLibrary before updating');
  }
  return { lengths: { 12: trees } };
}
function differences(before, after, at = '', output = []) {
  if (JSON.stringify(before) === JSON.stringify(after)) return output;
  if (before !== null && after !== null && typeof before === 'object' && typeof after === 'object' &&
      Array.isArray(before) === Array.isArray(after)) {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      differences(before[key], after[key], at + '/' + key.replaceAll('~', '~0').replaceAll('/', '~1'), output);
    }
  } else output.push({ path: at || '/', kind: before === undefined ? 'added' : after === undefined ? 'removed' : 'changed', before, after });
  return output;
}
function helperCalls(engine, trees) {
  const text = JSON.stringify(trees);
  const calls = [...new Set([...text.matchAll(/\b(dnr_[A-Za-z0-9_]+)\s*\(/g)].map(m => m[1]))].sort();
  return { calls, missingDeclarations: calls.filter(name => !engine.includes('function ' + name + '(')) };
}
function inspectUpdate({ resources, version, installer, output }) {
  if (!/^\d+\.\d+\.\d+(?:[-.][A-Za-z0-9]+)*$/.test(version)) throw new Error('Use a release version such as 7.0.3');
  const baseline = verifySources();
  if (fs.existsSync(output)) throw new Error('Candidate directory already exists; use a fresh review directory');
  const engine = fs.readFileSync(path.join(resources, resourceNames.engine));
  const redlineBytes = fs.readFileSync(path.join(resources, resourceNames.redlines));
  const gzip = fs.readFileSync(path.join(resources, resourceNames.trees));
  const fullTrees = parse(zlib.gunzipSync(gzip, { maxOutputLength: 64 * 1024 * 1024 }));
  const trees = selectTrees(fullTrees);
  const redlines = parse(redlineBytes);
  if (!redlines || Array.isArray(redlines) || typeof redlines !== 'object' || !Object.keys(redlines).length ||
      Object.values(redlines).some(value => !Array.isArray(value))) throw new Error('Unexpected C# redline table schema');
  new vm.Script(engine.toString('utf8')); // Syntax only; no candidate code execution.
  const current = (name) => {
    const record = baseline.records.find(r => r.file === `vendor/dnr-${baseline.dnrVersion}/${name}`);
    if (!record) throw new Error('Missing baseline provenance: ' + name);
    return fs.readFileSync(path.join(root, record.file));
  };
  const treeDiff = differences(parse(current('cartrees-12.json')), trees);
  const redlineDiff = differences(parse(current('csharp-redlines.json')), redlines);
  const sourceHash = hash(engine);
  const treeBytes = Buffer.from(JSON.stringify(trees, null, 2) + '\n');
  const report = {
    baselineVersion: baseline.dnrVersion, candidateVersionLabel: version,
    versionAndSignatureVerifiedByTool: false,
    installerSha256: hash(fs.readFileSync(installer)),
    engineChanged: sourceHash !== hash(current('engine.js')),
    treeDifferences: treeDiff.length, csharpRedlineDifferences: redlineDiff.length,
    gameTrees: trees.lengths['12'].length,
    games: trees.lengths['12'].flatMap(t => t.GameRestriction?.SupportedGames || []),
    treeMetadata: Object.fromEntries(Object.entries(fullTrees).filter(([k]) => k !== 'lengths')),
    helperReview: helperCalls(engine.toString('utf8'), trees),
    resources: [
      { file: 'engine.js', originalResource: resourceNames.engine, sha256: sourceHash },
      { file: 'csharp-redlines.json', originalResource: resourceNames.redlines, sha256: hash(redlineBytes) },
      { file: 'cartrees-12.json', originalResource: resourceNames.trees, sha256: hash(treeBytes), gzipSha256: hash(gzip) },
    ],
    limits: [
      'Version label is supplied by the caller; verify official release metadata and Authenticode separately.',
      'Tree diff uses JSON paths: reordered arrays can produce many changes; review car conditions, not only indexes.',
      'C# redline diff does not establish JS redline parity. Review the engine and run original-vs-adapted tests.',
      'Helper detection is a text inventory, not dependency resolution. No engine execution, source activation or game validation.',
    ],
  };
  // Finish reading and validation before creating any candidate output.
  fs.mkdirSync(output, { recursive: true });
  for (const [file, bytes] of [['engine.js', engine], ['csharp-redlines.json', redlineBytes], ['cartrees-12.json', treeBytes]]) fs.writeFileSync(path.join(output, file), bytes);
  for (const [file, value] of [['candidate.json', report], ['tree-diff.json', treeDiff], ['csharp-redline-diff.json', redlineDiff]]) {
    fs.writeFileSync(path.join(output, file), JSON.stringify(value, null, 2) + '\n');
  }
  return report;
}
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 6 || new Set(args.filter((_, i) => i % 2 === 0)).size !== 3) throw new Error('Usage: node tools/inspect-update.cjs --resources <ILSpy output> --version <release> --installer <official installer>');
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--resources', '--version', '--installer'].includes(args[i])) throw new Error('Unknown argument: ' + args[i]);
    options[args[i].slice(2)] = args[i + 1];
  }
  // Validate version before using it as a directory component.
  if (!/^\d+\.\d+\.\d+(?:[-.][A-Za-z0-9]+)*$/.test(options.version)) throw new Error('Invalid version');
  const output = path.join(root, '.validation/updates', options.version);
  const report = inspectUpdate({ ...options, output });
  console.log(JSON.stringify({ output, engineChanged: report.engineChanged, treeDifferences: report.treeDifferences,
    csharpRedlineDifferences: report.csharpRedlineDifferences, note: 'Candidate prepared; active sources unchanged' }, null, 2));
}
module.exports = { inspectUpdate, selectTrees, differences, resourceNames };
