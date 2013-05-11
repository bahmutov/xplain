var _ = require('./lodash');

QUnit.module('Arrays');

/** @sample compact */
(function() {
    deepEqual(_.compact([0, 1, false, 2, '', 3]), [1, 2, 3]);
}());

/** @sample difference */
(function() {
    deepEqual(_.difference([1, 2, 3, 4, 5], [5, 2, 10]), [1, 3, 4]);
}());

/** @sample findIndex */
(function() {
  var found = _.findIndex(['apple', 'banana', 'beet'], function(food) {
    return /^b/.test(food);
  });
  strictEqual(found, 1);
}());