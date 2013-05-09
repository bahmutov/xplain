gt.module('parsing QUnit assertions');

var transform = require('../parsers');

gt.test(function basics() {
    gt.arity(transform, 1);
});

gt.test('empty code', function () {
    gt.equal(transform(''), '', 'empty input -> empty output');
});

gt.test('QUnit.equal', function () {
    var code = 'QUnit.equal(_.first(array), 1);';
    gt.equal(transform(code), '_.first(array); // 1');
});

gt.test('QUnit.strictEqual', function () {
    var code = 'QUnit.strictEqual(_.first(array), 1);';
    gt.equal(transform(code), '_.first(array); // 1');
});

gt.test('strictEqual', function () {
    var code = 'strictEqual(_.first(array), 1);';
    gt.equal(transform(code), '_.first(array); // 1');
});

gt.test('QUnit.deepEqual', function () {
    var code = 'QUnit.deepEqual(_.first(array, 2), [1, 2]);';
    gt.equal(transform(code), '_.first(array,2); // [1,2]');
});

gt.test('deepEqual', function () {
    var code = 'deepEqual(_.first(array, 2), [1, 2]);';
    gt.equal(transform(code), '_.first(array,2); // [1,2]');
});

gt.test('QUnit.ok', function () {
    var code = 'QUnit.ok(actual instanceof _);';
    gt.equal(transform(code), 'actual instanceof _; // true');
});

gt.test('ok', function () {
    var code = 'ok(actual instanceof _);';
    gt.equal(transform(code), 'actual instanceof _; // true');
});