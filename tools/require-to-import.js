// Replaces require calls to import statements. Handles some cases that lebab (https://github.com/lebab/lebab)
// does not handle with the "commonjs" transform.
//
// To be run with jscodeshift
// For example: `npx jscodeshift -t require-to-import.js <path_to_script_to_transform>
const path = require('path');

function toCamelCase(str) {
  return str.replace(/[-_.](.)/g, (_, c) => c.toUpperCase());
}

function toIdentifier(requirePath, existing) {
  const parts = requirePath.split('/');
  const base = toCamelCase(path.basename(requirePath, path.extname(requirePath)));

  if (!Array.from(existing.values()).includes(base)) return base;

  const parent = parts.length >= 2
    ? toCamelCase(parts[parts.length - 2])
    : '';
  const candidate = parent
    ? `${parent}${base[0].toUpperCase()}${base.slice(1)}`
    : base;

  if (!Array.from(existing.values()).includes(candidate)) return candidate;

  let i = 2;
  while (Array.from(existing.values()).includes(`${candidate}${i}`)) i++;
  return `${candidate}${i}`;
}

function warn(fileInfo, message, nodePath) {
  const loc = nodePath.node.loc;
  const line = loc ? `:${loc.start.line}` : '';
  console.warn(`[require-to-import] ${fileInfo.path}${line} — ${message}`);
}

module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // requirePath -> identifier (used for both default and namespace imports)
  const imports = new Map();
  // requirePath -> 'default' | 'namespace'
  const importKind = new Map();

  // First pass: collect
  root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'require' }
  })
    .forEach(nodePath => {
      const arg = nodePath.node.arguments[0];

      if (!arg) {
        warn(fileInfo, 'require() called with no arguments — skipped', nodePath);
        return;
      }

      if (arg.type !== 'Literal') {
        warn(fileInfo, `Dynamic require(${j(arg).toSource()}) — skipped, convert manually`, nodePath);
        return;
      }

      const requirePath = arg.value;
      const parent = nodePath.parent.node;
      const isNamed = parent.type === 'MemberExpression' && parent.object === nodePath.node;

      if (!imports.has(requirePath)) {
        imports.set(requirePath, toIdentifier(requirePath, imports));
        importKind.set(requirePath, isNamed ? 'namespace' : 'default');
      } else if (isNamed && importKind.get(requirePath) === 'default') {
        // Upgrade to namespace if any usage is named
        importKind.set(requirePath, 'namespace');
      }
    });

  // Second pass: replace require('x').foo — keep as namespace.foo, just remove the require() call
  root.find(j.MemberExpression, {
    object: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'require' }
    }
  })
    .forEach(nodePath => {
      const arg = nodePath.node.object.arguments[0];
      if (!arg || arg.type !== 'Literal') return;

      const requirePath = arg.value;
      const name = imports.get(requirePath);
      if (!name) return;

      // Replace require('x').foo with name.foo
      j(nodePath).replaceWith(
        j.memberExpression(j.identifier(name), nodePath.node.property)
      );
    });

  // Third pass: replace bare default require() calls
  root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'require' }
  })
    .forEach(nodePath => {
      const arg = nodePath.node.arguments[0];
      if (!arg || arg.type !== 'Literal') return;

      const requirePath = arg.value;
      if (importKind.get(requirePath) !== 'default') return;

      j(nodePath).replaceWith(j.identifier(imports.get(requirePath)));
    });

  // Fourth pass: remove self-assignments (let foo = foo)
  root.find(j.VariableDeclaration)
    .forEach(nodePath => {
      nodePath.node.declarations = nodePath.node.declarations.filter(decl =>
        !(
          decl.init &&
          decl.init.type === 'Identifier' &&
          decl.id.type === 'Identifier' &&
          decl.init.name === decl.id.name
        )
      );
      if (nodePath.node.declarations.length === 0) {
        j(nodePath).remove();
      }
    });

  // Build import declarations
  const importNodes = Array.from(imports.entries()).map(([requirePath, name]) => {
    const cleanPath = requirePath.replace(/\.(js|ts)$/, '');
    const specifier = importKind.get(requirePath) === 'namespace'
      ? j.importNamespaceSpecifier(j.identifier(name))
      : j.importDefaultSpecifier(j.identifier(name));
    return j.importDeclaration([specifier], j.literal(cleanPath));
  });

  root.find(j.Program).get('body').unshift(...importNodes);

  return root.toSource();
};