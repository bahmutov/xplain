gt.module('parsing QUnit assertions');

var transform = require('../parsers');

gt.test(function basics() {
    gt.arity(transform, 1);
});

gt.test('empty code', function () {
    gt.equal(transform(''), '', 'empty input -> empty output');
});

gt.test('QUnit.strictEqual', function () {
    var code = 'QUnit.strictEqual(_.first(array), 1);';
    gt.equal(transform(code), '_.first(array); // 1');
});

gt.test('strictEqual', function () {
    var code = 'strictEqual(_.first(array), 1);';
    gt.equal(transform(code), '_.first(array); // 1');
});

/*
gt.test('single gt.equal with message', function () {
    var code = 'gt.equal(add(2, 3), 5, "2 + 3 = 5");';
    gt.equal(transform(code), 'add(2,3); // 5');
});

gt.test('comments are preserved', function () {
    var text = '// a comment';
    gt.equal(transform(text), text);
});
*/