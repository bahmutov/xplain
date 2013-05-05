var _ = require('./lodash');

QUnit.module('lodash.first combined');

/** @sample first */
(function() {
    var array = [1, 2, 3];

    var objects = [
    { 'a': 2, 'b': 2 },
    { 'a': 1, 'b': 1 },
    { 'a': 0, 'b': 0 }
    ];

    test('should return the first element', function() {
      strictEqual(_.first(array), 1);
  });

    test('should return the first two elements', function() {
      deepEqual(_.first(array, 2), [1, 2]);
  });

    test('should work with a `callback`', function() {
      var actual = _.first(array, function(num) {
        return num < 3;
    });

      deepEqual(actual, [1, 2]);
  });

    test('should pass the correct `callback` arguments', function() {
      var args;

      _.first(array, function() {
        args || (args = slice.call(arguments));
    });

      deepEqual(args, [1, 0, array]);
  });

    test('supports the `thisArg` argument', function() {
      var actual = _.first(array, function(value, index) {
        return this[index] < 3;
    }, array);

      deepEqual(actual, [1, 2]);
  });

    test('should chain when passing `n`, `callback`, or `thisArg`', function() {
      var actual = _(array).first(2);

      ok(actual instanceof _);

      actual = _(array).first(function(num) {
        return num < 3;
    });

      ok(actual instanceof _);

      actual = _(array).first(function(value, index) {
        return this[index] < 3;
    }, array);

      ok(actual instanceof _);
  });

    test('should not chain when no arguments are passed', function() {
      var actual = _(array).first();
      strictEqual(actual, 1);
  });

    test('should work with an object for `callback`', function() {
      deepEqual(_.first(objects, { 'b': 2 }), objects.slice(0, 1));
  });

    test('should work with a string for `callback`', function() {
      deepEqual(_.first(objects, 'b'), objects.slice(0, 2));
  });
}());