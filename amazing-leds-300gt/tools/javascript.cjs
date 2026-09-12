const acorn = require('acorn');

const parse = (source) => acorn.parse(source, { ecmaVersion: 'latest', allowReturnOutsideFunction: true });
function walk(node, visitor) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visitor(node);
  for (const [key, value] of Object.entries(node)) {
    if (key === 'start' || key === 'end') continue;
    if (Array.isArray(value)) value.forEach((item) => walk(item, visitor));
    else if (value && typeof value === 'object') walk(value, visitor);
  }
}
function edit(source, changes) {
  const accepted = [];
  for (const change of changes.sort((a, b) => a.start - b.start || b.end - a.end)) {
    if (!accepted.length || change.start >= accepted[accepted.length - 1].end) accepted.push(change);
  }
  for (const { start, end, text } of accepted.reverse()) source = source.slice(0, start) + text + source.slice(end);
  return source;
}
const unknown = Symbol('unknown');
const gameProperties = new Set(['DataCorePlugin.CurrentGame', 'CurrentGame', 'GameName', 'DataCorePlugin.GameData.NewData.GameName']);
const disabledState = (name) => /redline.*(?:state|active)|(?:state|active).*redline/i.test(name);
const otherGameHelper = new Set(['cp300v13ACCYellow', 'cp300v13LMURF2Yellow', 'c300v11IsLMU', 'c300v11HyperParent']);
const gameHelper = new Set(['cp300v5CurrentGame', 'cp300v22GameKey']);
const foreignProperty = (value) => typeof value === 'string' && /(?:^|\.)GameRawData\.(?:Graphics\.|Physics\.|physicsGuessing\.|PlayerNativeTelemetry\.|CurrentPlayerTelemetry\.|CurrentPlayer\.|PacketSessionData\.|PlayerLapData\.|TruckValues\.|StaticInfo\.|SessionUpdate\.|Scoring\.|Data\.|m[A-Z])/.test(value);
function evaluate(node, env = {}) {
  if (!node) return unknown;
  if (node.type === 'Literal') return node.value;
  if (node.type === 'Identifier') {
    if (node.name === 'f1Games') return [];
    return Object.hasOwn(env, node.name) ? env[node.name] : unknown;
  }
  if (node.type === 'ArrayExpression') {
    const values = node.elements.map((n) => evaluate(n, env));
    return values.includes(unknown) ? unknown : values;
  }
  if (node.type === 'CallExpression') {
    const name = node.callee.name;
    const args = node.arguments.map((n) => evaluate(n, env));
    if (gameProperties.has(args[0]) && (name === '$prop' || /Prop$/.test(name || ''))) return 'IRacing';
    if (name === '$prop' && args[0] === 'RPMRedlineReached') return false;
    if (name && disabledState(name)) return false;
    if (otherGameHelper.has(name)) return false;
    if (gameHelper.has(name)) return 'IRacing';
    if (name === 'c300v11Canonical') return '';
    if (name === 'String' && args[0] !== unknown) return String(args[0]);
    if (node.callee.type === 'MemberExpression') {
      const value = evaluate(node.callee.object, env), method = node.callee.property.name;
      if (value !== unknown && args.every((v) => v !== unknown)) {
        if (method === 'includes' && (typeof value === 'string' || Array.isArray(value))) return value.includes(...args);
        if (method === 'indexOf' && (typeof value === 'string' || Array.isArray(value))) return value.indexOf(...args);
        if (method === 'toLowerCase' && typeof value === 'string') return value.toLowerCase();
      }
    }
  }
  if (node.type === 'UnaryExpression') {
    const value = evaluate(node.argument, env);
    if (value !== unknown && node.operator === '!') return !value;
  }
  if (node.type === 'LogicalExpression') {
    const left = evaluate(node.left, env);
    if (left === unknown) return unknown;
    if (node.operator === '&&') return left ? evaluate(node.right, env) : left;
    if (node.operator === '||') return left ? left : evaluate(node.right, env);
    if (node.operator === '??') return left == null ? evaluate(node.right, env) : left;
  }
  if (node.type === 'BinaryExpression') {
    const a = evaluate(node.left, env), b = evaluate(node.right, env);
    if (a === unknown || b === unknown) return unknown;
    switch (node.operator) {
      case '===': return a === b;
      case '!==': return a !== b;
      case '==': return a == b;
      case '!=': return a != b;
      case '>': return a > b;
      case '<': return a < b;
      case '>=': return a >= b;
      case '<=': return a <= b;
    }
  }
  return unknown;
}

// Specialize known game branches without executing the source. Rendering is
// separately gated against the actual CurrentGame by src/runtime/entrypoints.js.
function specialize(source) {
  for (let pass = 0; pass < 8; pass++) {
    const changes = [];
    function visit(node, outer = {}) {
      if (!node || !node.type) return;
      let env = outer;
      if (/Function/.test(node.type) || node.type === 'Program') {
        env = { ...outer };
        for (const param of node.params || []) if (param.name) delete env[param.name];
        // Only immutable local bindings may participate in branch elimination.
        const candidates = new Map(), assigned = new Set();
        function locals(n) {
          if (n !== node && /Function/.test(n.type || '')) return;
          if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier') candidates.set(n.id.name, n.init);
          if (n.type === 'AssignmentExpression' && n.left.type === 'Identifier') assigned.add(n.left.name);
          if (n.type === 'UpdateExpression' && n.argument.type === 'Identifier') assigned.add(n.argument.name);
          for (const value of Object.values(n)) {
            if (Array.isArray(value)) value.forEach((v) => { if (v?.type) locals(v); });
            else if (value?.type) locals(value);
          }
        }
        locals(node);
        for (const [name, init] of candidates) {
          const value = evaluate(init, env);
          if (!assigned.has(name) && typeof value === 'string' && /^(iracing|IRacing)$/.test(value)) env[name] = value;
        }
      }
      if (node.type === 'IfStatement' || node.type === 'ConditionalExpression') {
        const result = evaluate(node.test, env);
        if (result !== unknown) {
          const selected = result ? node.consequent : node.alternate;
          changes.push({ start: node.start, end: node.end, text: selected ? source.slice(selected.start, selected.end) : ';' });
          return;
        }
      }
      if (node.type === 'ArrayExpression' && node.elements.some((n) => foreignProperty(n?.value))) {
        changes.push({ start: node.start, end: node.end, text: '[' + node.elements.filter((n) => !foreignProperty(n?.value)).map((n) => source.slice(n.start, n.end)).join(', ') + ']' });
        return;
      }
      if (node.type === 'CallExpression' && foreignProperty(node.arguments[0]?.value)) {
        const name = node.callee.name || '';
        let replacement;
        if (name === '$prop') replacement = 'undefined';
        else if (/Bool|EqAny|Known/.test(name)) replacement = 'false';
        else if (/Num|Prop/.test(name)) replacement = node.arguments[1] ? source.slice(node.arguments[1].start, node.arguments[1].end) : '0';
        if (replacement) { changes.push({ start: node.start, end: node.end, text: replacement }); return; }
      }
      if (node.type === 'CallExpression' || node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
        const result = evaluate(node, env);
        if (result !== unknown && ['string', 'boolean', 'number'].includes(typeof result)) {
          changes.push({ start: node.start, end: node.end, text: JSON.stringify(result) });
          return;
        }
      }
      for (const value of Object.values(node)) {
        if (Array.isArray(value)) value.forEach((v) => { if (v?.type) visit(v, env); });
        else if (value?.type) visit(value, env);
      }
    }
    visit(parse(source));
    if (!changes.length) break;
    source = edit(source, changes);
  }
  // Strip empty branches and unreachable trailing statements left by game
  // specialization. Keep the rest verbatim to preserve inherited timings.
  const cleanup = [];
  function terminates(n) {
    if (n.type === 'ReturnStatement' || n.type === 'ThrowStatement') return true;
    if (n.type === 'BlockStatement') return n.body.some(terminates);
    return false;
  }
  walk(parse(source), (n) => {
    if (n.type !== 'BlockStatement') return;
    let ended = false;
    for (const statement of n.body) {
      if (ended || statement.type === 'EmptyStatement') cleanup.push({ start: statement.start, end: statement.end, text: '' });
      if (terminates(statement)) ended = true;
    }
  });
  source = edit(source, cleanup);
  return source;
}

function identifiers(source) {
  const names = new Set();
  walk(parse(source), (n) => { if (n.type === 'Identifier') names.add(n.name); });
  return names;
}
function rootName(node) {
  while (node?.type === 'MemberExpression') node = node.object;
  return node?.type === 'Identifier' ? node.name : null;
}
function writes(node) {
  if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') return [node.id.name];
  const out = new Set();
  function visit(n) {
    if (!n?.type || /Function/.test(n.type)) return;
    if (n.type === 'VariableDeclarator' && n.id.name) out.add(n.id.name);
    if (n.type === 'AssignmentExpression') out.add(rootName(n.left));
    if (n.type === 'UpdateExpression') out.add(rootName(n.argument));
    for (const value of Object.values(n)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value?.type) visit(value);
    }
  }
  visit(node);
  return [...out].filter(Boolean);
}
function reachable(source, roots) {
  const ast = parse(source), lastDeclaration = new Map();
  for (const n of ast.body) if (n.type === 'FunctionDeclaration') lastDeclaration.set(n.id.name, n);
  const statements = ast.body.filter((n) => n.type !== 'FunctionDeclaration' || lastDeclaration.get(n.id.name) === n)
    .map((n) => ({ node: n, writes: writes(n), refs: identifiers(source.slice(n.start, n.end)) }));
  const required = new Set(roots), included = new Set();
  let progress = true;
  while (progress) {
    progress = false;
    for (const s of statements) {
      if (included.has(s) || !s.writes.some((name) => required.has(name))) continue;
      included.add(s);
      for (const name of s.refs) required.add(name);
      progress = true;
    }
  }
  return statements.filter((s) => included.has(s)).map((s) => source.slice(s.node.start, s.node.end)).join('\n\n') + '\n';
}
module.exports = { parse, walk, edit, specialize, identifiers, reachable, evaluate, unknown };
