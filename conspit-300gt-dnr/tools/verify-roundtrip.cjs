const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { root } = require('./sources.cjs');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8').replace(/^\uFEFF/, ''));
const profile = read('profiles/CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile');
const roundtrip = read('.validation/native-scratch/roundtrip.json');
function nodes(n) { return [...(n.ContainerType ? [n] : []), ...(n.LedContainers || []).flatMap(nodes)]; }
assert.deepEqual(nodes(roundtrip).map(n => n.ContainerType), nodes(profile).map(n => n.ContainerType));
assert.equal(nodes(roundtrip).some(n => n.OriginalJson || /Unknown/.test(n.ContainerType)), false);
assert.equal(roundtrip.EmbeddedJavascript, profile.EmbeddedJavascript);
console.log('Native roundtrip retains all ' + nodes(profile).length + ' containers and embedded JavaScript');
