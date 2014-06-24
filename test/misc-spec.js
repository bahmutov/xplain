require('lazy-ass');
var check = require('check-types');

describe('detect framework', function () {
  var join = require('path').join;
  var xplain = require(join(__dirname, '../src/xplain.js'));
  lazyAss(check.fn(xplain.detectFramework));

  it('detects jasmine spec by filename', function () {
    lazyAss(xplain.detectFramework(['something-spec.js']) === 'jasmine');
  });

  it('otherwise it is qunit', function () {
    lazyAss(xplain.detectFramework(['something.js']) === 'qunit');
  });
});
