var assert = require('assert');
var _ = require('lodash');
var transform = require('../../../../src/doc-transform/toHumanForm');
var parseCode = require('../../../../src/doc-transform/adapters/gt/parser').parseCode;

describe('parsing gt test', function () {

  var join = require('path').join;
  var _gt = require('gt');
  var framework = _gt.TestingFramework;
  var filename = join(__dirname, '../add-test.js');

  beforeEach(function () {
    framework.init();
  });

  it('supports parsing', function () {
    assert(_.isObject(framework));
    assert(_.isFunction(framework.collect), 'gt has collect method');
  });

  it('parses add.js', function () {
    framework.collect(filename);
    var tests = framework.getAllTests();
    assert(_.isArray(tests), 'all tests are array');
    assert.equal(tests.length, 1, 'finds single test');
  });

  it('has test info', function () {
    framework.collect(filename);
    var tests = framework.getAllTests();
    assert.equal(tests.length, 1, 'finds single test');
    var t = tests[0];
    assert.equal(t.name, 'add example');
    assert(_.isString(t.code.toString()), 'has function code');
  });

  it('can be transformed to human form', function () {
    framework.collect(filename);
    var tests = framework.getAllTests();
    var t = tests[0];
    assert(_.isFunction(transform), 'transform is a function');
    var code = t.code.toString();
    var innerCode = parseCode(code);
    assert(innerCode, 'could not get inner code from ' + code);
    assert(_.isObject(innerCode), 'returns an object');
    assert(_.isString(innerCode.code), 'has code string');
    var transformedCode = transform(innerCode.code, 'gt');
    assert(_.isObject(transformedCode), 'returned object');
    assert(_.isString(transformedCode.code), 'has code string');
    console.log('transformed code\n' + transformedCode.code);
    assert(transformedCode.code.length > 0, 'string is unempty');
  });
});