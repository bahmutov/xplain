var check = require('check-types');
require('lazy-ass');
var xplain = require('..');
var path = require('path');

describe('using xplain as package', function () {
  var testFolder = path.join(__dirname, '../examples/jasmine');

  it('is defined', function () {
    lazyAss(check.object(xplain));
  });

  it('has .document', function () {
    lazyAss(check.fn(xplain.document));
  });

  it('works', function () {
    return xplain.document({
      patterns: testFolder + '/sp*.js',
      outputFolder: testFolder + '/docs',
      title: 'as module works'
    })/*.then(function (result) {
      lazyAss(check.object(result),
        'xplain.document resolves with object', result);
    })*/;
  });
});
