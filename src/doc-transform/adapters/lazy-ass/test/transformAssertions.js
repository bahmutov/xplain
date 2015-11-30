gt.module('parsing lazy-ass assertions');

var transform = require('../parsers');
var la = require('lazy-ass');
var check = require('check-types');

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
    var code = 'lazyAss(foo, "2 + 2 === 4");';
    // hmm, for some reason the spaces were removed
    gt.equal(transform(code), 'foo; // true');
});

gt.module('simplify !');

gt.test('lazyAss(!false)', function () {
    var code = 'lazyAss(!false);';
    lazyAss(!false);
    gt.equal(transform(code), 'false; // false');
});

gt.test('lazyAss(!check.unemptyString())', function () {
    var code = 'lazyAss(!check.unemptyString(5));';
    lazyAss(!check.unemptyString(5));
    gt.equal(transform(code), 'check.unemptyString(5); // false');
});

gt.test('lazyAss(!0)', function () {
    var code = 'lazyAss(!0);';
    lazyAss(!0);
    gt.equal(transform(code), '0; // false');
});

gt.module('simplify ===');

gt.test('lazyAss(foo === bar)', function () {
    var foo = 'foo', bar = 'foo';
    lazyAss(foo === bar);
    var code = 'lazyAss(foo === bar);';
    gt.equal(transform(code), 'foo; // bar');
});

gt.test('lazyAss with message', function () {
    var code = 'lazyAss(2 + 2 === 4, "2 + 2 === 4");';
    // hmm, for some reason the spaces were removed
    gt.equal(transform(code), '2+2; // 4');
});

gt.test('without spaces', function () {
    var code = 'lazyAss(2===2);';
    gt.equal(transform(code), '2; // 2');
});

gt.module('simplify ==');

gt.test('lazyAss(foo == bar)', function () {
    var foo = 'foo', bar = 'foo';
    var code = 'lazyAss(foo == bar);';
    gt.equal(transform(code), 'foo; // bar');
});

gt.test('lazyAss with message', function () {
    var code = 'lazyAss(2 + 2 == 4, "something");';
    // hmm, for some reason the spaces were removed
    gt.equal(transform(code), '2+2; // 4');
});

gt.test('without spaces', function () {
    var code = 'lazyAss(2=="2");';
    gt.equal(transform(code), '2; // \'2\'');
});
