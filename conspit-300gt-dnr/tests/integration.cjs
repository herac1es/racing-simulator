const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { root, verifySources } = require('../tools/sources.cjs');
verifySources();
const files = [
  'profiles/CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile',
  'profiles/rpm/300GT_DNR703_RPM_FullColour.ledsprofile',
  'profiles/rpm/300GT_DNR703_RPM_TDM.ledsprofile',
  'docs/build-manifest.json', 'docs/changes.json', 'docs/rpm-inventory.json',
];
const digest = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const before = files.map(digest);
// Building from another cwd must use only repository inputs and stable IDs.
const result = spawnSync(process.execPath, [path.join(root, 'tools/build.cjs')], { cwd: os.tmpdir(), encoding: 'utf8' });
assert.equal(result.status, 0, result.stderr || result.stdout);
assert.deepEqual(files.map(digest), before, 'Rebuild changed generated artifacts');
const profiles = files.filter(f => f.endsWith('.ledsprofile')).map(f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')));
assert.equal(new Set(profiles.map(p => p.ProfileId)).size, 3);
assert.deepEqual(profiles[0].LedContainers.map(n => [n.Description, n.StartPosition || 1]), [['RPM BAR', 1], ['BUTTONS', 13], ['KNOBS', 21]]);
const report = { passed: true, deterministic: true, independentOfWorkingDirectory: true, sourceHashesVerified: true, profiles: profiles.length };
fs.writeFileSync(path.join(root, '.validation/integration.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
