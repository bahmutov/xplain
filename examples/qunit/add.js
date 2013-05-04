/**
    Adds two numbers

    @method add
*/
function add(a, b) { return a + b; }

/** @sample add */
QUnit.test('adding numbers', function () {
    QUnit.equal(add(2, 3), 5);
});

/** @sample add */
QUnit.test('QUnit assertions', function () {
    QUnit.aequal([1, 2], [1, 2]);
});