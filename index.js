'use strict';
var recast = require('recast');
var esprima = require('esprima');
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

// yield literal
// Not officially reserved but throws in Android 4.0
identifierToLiteral.yield = true;

var visitor = {
  visitProperty: function(path) {
    var node = path.node;

    if (namedTypes.Identifier.check(node.key) && identifierToLiteral[node.key.name]) {
      node.key = builders.literal(node.key.name);
    }

    return this.traverse(path);
  },

  visitMemberExpression: function(path) {
    var node = path.node;
    var property = node.property;
    var newNode;

    if (namedTypes.Identifier.check(property) && identifierToLiteral[property.name]) {
      path.replace(builders.memberExpression(node.object, builders.literal(property.name), true));
    } else {
      newNode = node;
    }

    return this.traverse(path);
  }
};

//taken from remove-trailing-comma npm package, MIT licensed
function removeTrailingComma(source) {
  var syntax = esprima.parse(source, {
    tokens: true,
    range: true,
    raw: true
  });

  var collectedDatas = [];

  syntax.tokens.forEach(function(token, index, tokens) {
    if (token.type === "Punctuator" &&
        (token.value === "}" || token.value === "]") &&
        tokens[index - 1].type === "Punctuator" &&
        tokens[index - 1].value === ",") {
      collectedDatas.push({
        range: tokens[index - 1].range,
        replaceString: ""
      });
    }
  });

  // no trailing comma found
  if (collectedDatas.length === 0) {
    return source;
  }

  // from the backward forward we can ignore the offset problem
  for (var i = collectedDatas.length - 1; i >= 0; i--) {
    var range = collectedDatas[i].range;
    var replaceString = collectedDatas[i].replaceString;
    source = source.slice(0, range[0]) + replaceString + source.slice(range[1]);
  }
  return source;
}

var TEST_REGEX = module.exports.TEST_REGEX = buildTestRegex();
module.exports.compile = function(source, options) {
  var ast, code;
  if (TEST_REGEX.test(source)) {
    ast = recast.parse(source);
    recast.visit(ast, visitor);
    code = recast.print(ast).code;
  } else {
    code = source;
  }
  if (options && options.trailingComma) {
    return removeTrailingComma(code);
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
  recast.visit(ast, visitor);

  return ast;
};
