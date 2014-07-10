'use strict';
var esprima = require('esprima');
var recast = require('recast');
var Visitor = recast.Visitor;
var types = recast.types;
var namedTypes = types.namedTypes;
var builders = types.builders;

// http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf
var identifierToLiteral = Object.create(null);
// Keyword
//
identifierToLiteral.break = true;
identifierToLiteral.case = true;
identifierToLiteral.catch = true;
identifierToLiteral.continue = true;
identifierToLiteral.default = true;
identifierToLiteral.delete = true;
identifierToLiteral.do = true;
identifierToLiteral.else = true;
identifierToLiteral.finally = true;
identifierToLiteral.for = true;
identifierToLiteral.function = true;
identifierToLiteral.if = true;
identifierToLiteral.in = true;
identifierToLiteral.instanceof = true;
identifierToLiteral.new = true;
identifierToLiteral.return = true;
identifierToLiteral.switch = true;
identifierToLiteral.this = true;
identifierToLiteral.throw = true;
identifierToLiteral.try = true;
identifierToLiteral.typeof = true;
identifierToLiteral.var = true;
identifierToLiteral.void = true;
identifierToLiteral.while = true;
identifierToLiteral.with = true;

// FutureReservedWords
identifierToLiteral.abstract = true;
identifierToLiteral.boolean = true;
identifierToLiteral.byte = true;
identifierToLiteral.char = true;
identifierToLiteral.class = true;
identifierToLiteral.const = true;
identifierToLiteral.debugger = true;
identifierToLiteral.double = true;
identifierToLiteral.enum = true;
identifierToLiteral.export = true;
identifierToLiteral.extends = true;
identifierToLiteral.final = true;
identifierToLiteral.float = true;
identifierToLiteral.goto = true;
identifierToLiteral.implements = true;
identifierToLiteral.import = true;
identifierToLiteral.int = true;
identifierToLiteral.interface = true;
identifierToLiteral.long = true;
identifierToLiteral.native = true;
identifierToLiteral.package = true;
identifierToLiteral.private = true;
identifierToLiteral.protected = true;
identifierToLiteral.public = true;
identifierToLiteral.short = true;
identifierToLiteral.static =  true;
identifierToLiteral.super = true;
identifierToLiteral.synchronized = true;
identifierToLiteral.throws =  true;
identifierToLiteral.transient = true;
identifierToLiteral.volatile = true;

// NullLiteral
identifierToLiteral.null = true;

// BooleanLiteral
identifierToLiteral.true = true;
identifierToLiteral.false = true;

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

var TEST_REGEX = module.exports.TEST_REGEX = buildTestRegex();
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

function buildTestRegex() {
  var literalsString = Object.keys(identifierToLiteral).join('|');
  var memberString = '\\.\\s*(' + literalsString + ')';
  var propertyString = '(' + literalsString + ')\\s*\\:';
  var regexString = memberString + '|' + propertyString;
  return new RegExp(regexString, 'i');
}

module.exports.visit = function(ast) {
  new ES6Safe().visit(ast);
  return ast;
};
