// To be run via jscodeshift (`npx run jscodeshift -t remove-iife.js <js_file_to_transform>`)
//
// Removes IIFE (Immediately Invoked Function Expressions), which are expressions in the form of
// (function() { /* code */})(). See https://developer.mozilla.org/en-US/docs/Glossary/IIFE for more details.
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root
    .find(j.ExpressionStatement, {
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'FunctionExpression'
        }
      }
    })
    .forEach(path => {
      const body = path.node.expression.callee.body.body;
      j(path).replaceWith(body);
    });

  return root.toSource();
};