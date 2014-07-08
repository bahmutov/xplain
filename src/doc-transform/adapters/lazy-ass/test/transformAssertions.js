gt.module('parsing lazy-ass assertions');

var transform = require('../parsers');

gt.test(function basics() {
    gt.arity(transform, 1);
});

gt.test('empty code', function () {
    gt.equal(transform(''), '', 'empty input -> empty output');
});

gt.test('lazyAss(true)', function () {
    var code = 'lazyAss(true);';
    gt.equal(transform(code), 'true; // true');
});

gt.test('la(true)', function () {
    var code = 'la(true);';
    gt.equal(transform(code), 'true; // true');
});

gt.test('lazyAss with message', function () {
    var code = 'lazyAss(2 + 2 === 4, "2 + 2 === 4");';
    // hmm, for some reason the spaces were removed
    gt.equal(transform(code), '2+2===4; // true');
});
