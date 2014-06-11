"use strict";

var recast = require('recast');
var esprima = require('esprima');
var Visitor = recast.Visitor;
var types = recast.types;
var namedTypes = types.namedTypes;
var builders = types.builders;

// http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf
var identifierToLiteral = {
  // Keyword
  break: true,
  case: true,
  catch: true,
  continue: true,
  default: true,
  delete: true,
  do: true,
  else: true,
  finally: true,
  for: true,
  function: true,
  if: true,
  in: true,
  instanceof: true,
  new: true,
  return: true,
  switch: true,
  this: true,
  throw: true,
  try: true,
  typeof: true,
  var: true,
  void: true,
  while: true,
  with: true,

  // FutureReservedWords
  abstract: true,
  boolean: true,
  byte: true,
  char: true,
  class: true,
  const: true,
  debugger: true,
  double: true,
  enum: true,
  export: true,
  extends: true,
  final: true,
  float: true,
  goto: true,
  implements: true,
  import: true,
  int: true,
  interface: true,
  long: true,
  native: true,
  package: true,
  private: true,
  protected: true,
  public: true,
  short: true,
  static: true,
  super: true,
  synchronized: true,
  throws: true,
  transient: true,
  volatile: true,

  // NullLiteral
  null: true,

  // BooleanLiteral
  true: true,
  false: true
};

var ES6Safe = Visitor.extend({
  visitProperty: function(node) {
    if (namedTypes.Identifier.check(node.key) && identifierToLiteral[node.key.name]) {
      node.key = builders.literal(node.key.name);
    }

    return this.genericVisit(node);
  },

  visitMemberExpression: function(node) {
    var property = node.property;
    var newNode;
    if (namedTypes.Identifier.check(property) && identifierToLiteral[property.name]) {
      newNode = builders.memberExpression(node.object, builders.literal(property.name), true);
    } else {
      newNode = node;
    }
    return this.genericVisit(newNode);
  }
});

module.exports.Visitor = ES6Safe;

module.exports.compile = function(source) {
  var ast, code;
  if (TEST_REGEX.test(source)) {
    ast = recast.parse(source, { esprima: esprima } );
    new ES6Safe().visit(ast);
    code = recast.print(ast).code;
  } else {
    code = source;
  }

  return code;
};

var TEST_REGEX = module.exports.TEST_REGEX = buildTestRegex();
function buildTestRegex() {
  var regexString = Object.keys(identifierToLiteral).join('|');
  return new RegExp(regexString, 'i');
}

module.exports.visit = function(ast) {
  new ES6Safe().visit(ast);
  return ast;
};
