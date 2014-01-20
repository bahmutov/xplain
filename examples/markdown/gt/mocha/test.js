var assert = require('assert');
var _ = require('lodash');

describe('parsing gt test', function () {

  var join = require('path').join;
  var _gt = require('gt');
  var framework = _gt.TestingFramework;

  beforeEach(function () {
    framework.init();
  });

  it('supports parsing', function () {
    assert(_.isObject(framework));
    assert(_.isFunction(framework.collect), 'gt has collect method');
  });

  it('parses add.js', function () {
    framework.collect(join(__dirname, '../add-test.js'));
    var tests = framework.getAllTests();
    assert(_.isArray(tests), 'all tests are array');
    assert.equal(tests.length, 1, 'finds single test');
  });

  it('has test info', function () {
    framework.collect(join(__dirname, '../add-test.js'));
    var tests = framework.getAllTests();
    assert.equal(tests.length, 1, 'finds single test');
    var t = tests[0];
    assert.equal(t.name, 'add example');
    assert(_.isString(t.code.toString()), 'has function code');
  });
});