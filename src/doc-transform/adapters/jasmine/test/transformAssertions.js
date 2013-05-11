gt.module('parsing jasmine assertions');

var transform = require('../parsers');

gt.test(function basics() {
    gt.arity(transform, 1);
});

gt.test('empty code', function () {
    gt.equal(transform(''), '', 'empty input -> empty output');
});

gt.test('gt.equal is ignored', function () {
    var code = 'gt.equal(1, 1);';
    gt.equal(transform(code), 'gt.equal(1, 1);');
});

gt.test('expect(foo).toBeTruthy();', function () {
    var code = 'expect(foo).toBeTruthy();';
    gt.equal(transform(code), 'foo; // true');
});

gt.test('expect(foo).toBeFalsy();', function () {
    var code = 'expect(foo).toBeFalsy();';
    gt.equal(transform(code), 'foo; // false');
});

gt.skip('expect(-5 + 5).toBeFalsy();', function () {
    var code = 'expect(-5 + 5).toBeFalsy();';
    gt.equal(transform(code), '-5 + 5; // false');
});

gt.test('expect(add(2, 4)).toEqual(6);', function () {
    var code = 'expect(add(2, 4)).toEqual(6);';
    gt.equal(transform(code), 'add(2,4); // 6');
});

gt.test('expect(add(2, 4)).toEqual(add(3, 3));', function () {
    var code = 'expect(add(2, 4)).toEqual(add(3, 3));';
    gt.equal(transform(code), 'add(2,4); // add(3,3)');
});

gt.test('expect(foo).toEqual(bar);', function () {
    var code = 'expect(foo).toEqual(bar);';
    gt.equal(transform(code), 'foo; // bar');
});

/*
gt.test('QUnit.strictEqual', function () {
    var code = 'QUnit.strictEqual(_.first(array), 1);';
    gt.equal(transform(code), '_.first(array); // 1');
});

gt.test('strictEqual', function () {
    var code = 'strictEqual(_.first(array), 1);';
    gt.equal(transform(code), '_.first(array); // 1');
});

gt.test('complicated QUnit.deepEqual', function () {
    var code = '  QUnit.deepEqual(actual, [1, 2]);';
    gt.equal(transform(code), 'actual; // [1,2]');
});

gt.test('QUnit.deepEqual', function () {
    var code = 'QUnit.deepEqual(_.first(array, 2), [1, 2]);';
    gt.equal(transform(code), '_.first(array,2); // [1,2]');
});

gt.test('deepEqual', function () {
    var code = 'deepEqual(_.first(array, 2), [1, 2]);';
    gt.equal(transform(code), '_.first(array,2); // [1,2]');
});

gt.test('gt.ok is ignored', function () {
    var code = 'gt.ok(true);';
    gt.equal(transform(code), 'gt.ok(true);');
});

gt.test('QUnit.ok', function () {
    var code = 'QUnit.ok(actual instanceof _);';
    gt.equal(transform(code), 'actual instanceof _; // true');
});

gt.test('QUnit.ok with spaces', function () {
    var code = ' QUnit.ok(actual instanceof _);';
    gt.equal(transform(code), 'actual instanceof _; // true');
});

gt.test('ok', function () {
    var code = 'ok(actual instanceof _);';
    gt.equal(transform(code), 'actual instanceof _; // true');
});

gt.test('ok with spaces', function () {
    var code = 'ok(actual instanceof _);';
    gt.equal(transform(code), 'actual instanceof _; // true');
});
*/