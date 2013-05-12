// function add in module main/math
// comes from some other file

/** @module main/math */
/** @function add */

/** @sample main/math/add */
gt.test('adding numbers', function () {
    gt.equal(add(2, 3), 5);
    gt.equal(add(100, 1), 101);
});