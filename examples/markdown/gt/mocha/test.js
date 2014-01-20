var assert = require('assert');
var _ = require('lodash');

describe('parsing gt test', function () {

  var join = require('path').join;
  var _gt = require('gt');
  var framework = _gt.TestingFramework;

  it('supports parsing', function () {
    assert(_.isObject(framework));
    assert(_.isFunction(framework.collect), 'gt has collect method');
  });

  it('parses add.js', function () {
    framework.collect(join(__dirname, '../add.js'));
    var tests = framework.getAllTests();
    assert(_.isArray(tests), 'all tests are array');
  });
});