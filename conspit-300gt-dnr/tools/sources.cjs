const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
function verifySources() {
  const provenance = JSON.parse(fs.readFileSync(path.join(root, 'src/provenance.json'), 'utf8'));
  for (const record of provenance.records.filter((r) => r.file.startsWith('vendor/'))) {
    const bytes = fs.readFileSync(path.join(root, record.file));
    const actual = crypto.createHash('sha256').update(bytes).digest('hex');
    if (actual !== record.sha256) throw new Error('Source snapshot changed: ' + record.file);
  }
  return provenance;
}
module.exports = { root, verifySources };
