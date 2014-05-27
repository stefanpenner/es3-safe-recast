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

describe('catch', function() {
  it('works with literal syntax', function() {
    var actual = compiler.compile('var object = {\ncatch: null,\n};');
    var expected = 'var object = {\n"catch": null,\n};'

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });

  it('works with member syntax', function() {
    var actual = compiler.compile('object.catch(function(){\n\n});');
    var expected = 'object["catch"](function(){\n\n});';

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});

describe('finally', function() {
  it('works with literal syntax', function() {
    var actual = compiler.compile('var object = {\nfinally: null,\n};');
    var expected = 'var object = {\n"finally": null,\n};'

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });

  it('works with member syntax', function() {
    var actual = compiler.compile('object.finally(function(){\n\n});');
    var expected = 'object["finally"](function(){\n\n});';

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});

describe('default', function() {
  it('works with literal syntax', function() {
    var actual = compiler.compile('var object = {\ndefault: null,\n};');
    var expected = 'var object = {\n"default": null,\n};'

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });

  it('works with member syntax', function() {
    var actual = compiler.compile('object.default(function(){\n\n});');
    var expected = 'object["default"](function(){\n\n});';

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});

describe('new', function() {
  it('works with literal syntax', function() {
    var actual = compiler.compile('var object = {\nnew: null,\n};');
    var expected = 'var object = {\n"new": null,\n};'

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });

  it('works with member syntax', function() {
    var actual = compiler.compile('object.new(function(){\n\n});');
    var expected = 'object["new"](function(){\n\n});';

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});

describe('throw', function() {
  it('works with literal syntax', function() {
    var actual = compiler.compile('var object = {\nthrow: null,\n};');
    var expected = 'var object = {\n"throw": null,\n};'

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });

  it('works with member syntax', function() {
    var actual = compiler.compile('object.throw(function(){\n\n});');
    var expected = 'object["throw"](function(){\n\n});';

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});

describe('return', function() {
  it('works with literal syntax', function() {
    var actual = compiler.compile('var object = {\nreturn: null,\n};');
    var expected = 'var object = {\n"return": null,\n};'

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });

  it('works with member syntax', function() {
    var actual = compiler.compile('object.return(function(){\n\n});');
    var expected = 'object["return"](function(){\n\n});';

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});

describe('import', function() {
  it('works with literal syntax', function() {
    var actual = compiler.compile('var object = {\nimport: null,\n};');
    var expected = 'var object = {\n"import": null,\n};'

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });

  it('works with member syntax', function() {
    var actual = compiler.compile('object.import(function(){\n\n});');
    var expected = 'object["import"](function(){\n\n});';

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});
