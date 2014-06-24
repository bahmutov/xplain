/** @sample add */
gt.test('basic addition', function () {
  gt.equal(add(1, 2), 3, '1 + 2 = 3');
  gt.equal(add(100, -100), 0, '100 + -100 = 0');
});

// this should NOT be part of the test

/** @example add */
gt.test('concatenation', function () {
  gt.equal(add('a', 'b'), 'ab');
});

// this is NOT part of the test
