var foo = require('../src/foo');

gt.module('testing foo');

/** @sample foo */
gt.test('basic usage', function () {
    gt.equal(foo(), 'foo', 'returns string foo');
});

/** @example foo */
gt.test('advanced usage', function () {
    gt.arity(foo, 0, 'no arguments expected');
    gt.string(foo(), 'returns a string');
});