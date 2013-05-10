gt.module('parsing gt assertions');

var transform = require('../parsers');

gt.test(function basics() {
    gt.arity(transform, 1);
});

gt.test('empty code', function () {
    gt.equal(transform(''), '', 'empty input -> empty output');
});

gt.test('gt.array', function () {
    var code = 'gt.array(a);';
    gt.equal(transform(code), 'a; // Array');
});

gt.test('gt.ok', function () {
    var code = 'gt.ok(true);';
    gt.equal(transform(code), 'true; // true');
});

gt.test('gt.ok with message', function () {
    var code = 'gt.ok(true, "should be true");';
    gt.equal(transform(code), 'true; // true');
});

gt.test('single gt.equal', function () {
    var code = 'gt.equal(add(2, 3), 5);';
    gt.equal(transform(code), 'add(2,3); // 5');
});

gt.test('single gt.equal with message', function () {
    var code = 'gt.equal(add(2, 3), 5, "2 + 3 = 5");';
    gt.equal(transform(code), 'add(2,3); // 5');
});

gt.test('comments are preserved', function () {
    var text = '// a comment';
    gt.equal(transform(text), text);
});