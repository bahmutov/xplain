var check = require('check-types');
require('lazy-ass');
var xplain = require('..');
var path = require('path');
var Q = require('Q');

describe('using xplain as package', function () {

  it('is defined', function () {
    lazyAss(check.object(xplain));
  });

  it('has .document', function () {
    lazyAss(check.fn(xplain.document));
  });

  it('works', function () {
    var testFolder = path.join(__dirname, '../examples/jasmine');
    return xplain.document({
      patterns: testFolder + '/sp*.js',
      outputFolder: testFolder + '/docs',
      title: 'as module works'
    });
  });

  it('returns a promise', function () {
    var testFolder = path.join(__dirname, '../examples/jasmine-module');
    var p = xplain.document({
      patterns: testFolder + '/sp*.js',
      outputFolder: testFolder + '/docs',
      title: 'as module works'
    });
    lazyAss(Q.isPromise(p));
    return p;
  });
});
