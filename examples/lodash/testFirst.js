var _ = require('./lodash');

QUnit.module('lodash.first');

(function() {
  var array = [1, 2, 3];

  var objects = [
  { 'a': 2, 'b': 2 },
  { 'a': 1, 'b': 1 },
  { 'a': 0, 'b': 0 }
  ];

  /** @sample first */
  QUnit.test('should return the first element', function() {
    QUnit.equal(_.first([1, 2, 3]), 1);
  });

  /** @sample first */
  QUnit.test('should return the first two elements', function() {
    QUnit.aequal(_.first([1, 2, 3], 2), [1, 2]);
  });

  /** @sample first */
  QUnit.test('should work with a callback', function() {
    var actual = _.first([1, 2, 3], function(num) {
      return num < 3;
    });

    QUnit.aequal(actual, [1, 2]);
  });
}());