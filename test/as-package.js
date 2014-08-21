var check = require('check-types');
require('lazy-ass');
var xplain = require('..');
var path = require('path');
var Q = require('q');

describe('using xplain as package', function () {

  it('is defined', function () {
    lazyAss(check.object(xplain));
  });

  it('initializes global log object', function () {
    lazyAss(check.object(global.log), 'missing global log');
    lazyAss(check.fn(global.log.debug), 'missing log.debug');
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
    }).done();
  });

  it('returns a promise', function () {
    var testFolder = path.join(__dirname, '../examples/jasmine-module');
    var p = xplain.document({
      patterns: testFolder + '/sp*.js',
      outputFolder: testFolder + '/docs',
      title: 'as module works'
    });
    lazyAss(Q.isPromise(p));
    return p.done();
  });

  it('discovers jasmine', function () {
    var testFolder = path.join(__dirname, '../examples/jasmine-lazy-ass');
    var p = xplain.document({
      patterns: testFolder + '/s*.js',
      outputFolder: testFolder + '/docs'
    });
    return p.then(function (result) {
      lazyAss(check.object(result), 'has result');
      lazyAss(check.object(result.inputOptions), 'has input options');
      lazyAss(check.array(result.inputFiles), 'has input files');
      lazyAss(result.inputFiles.length === 1,
        'should have single inputfile', result);
      lazyAss(result.inputOptions.framework === 'jasmine',
        'should be jasmine', result);
    }).done();
  });
});
