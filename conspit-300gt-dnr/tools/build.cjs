const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { root, verifySources } = require('./sources.cjs');
verifySources();
fs.mkdirSync(path.join(root, '.validation'), { recursive: true });
for (const script of ['build-rpm.cjs', 'build-full.cjs']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
