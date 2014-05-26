var assert = require('better-assert');
var astEqual = require('esprima-ast-equality');
var readFileSync = require('fs').readFileSync;

var compiler = require('./../index');

describe('object properties', function() {
  it('works', function() {
    var path = './tests/fixtures/object-literal';
    var actual = compiler.compile(readFileSync(path + '/input.js'));
    var expected = readFileSync(path + '/output.js');

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});

describe('object member', function() {
  it('works', function() {
    var path = './tests/fixtures/object-member';
    var actual = compiler.compile(readFileSync(path + '/input.js'));
    var expected = readFileSync(path + '/output.js');

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});
