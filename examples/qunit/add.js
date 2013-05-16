/**
    Adds two numbers

    @method add
*/
function add(a, b) { return a + b; }

/**
    Function name starts with dollar sign

    @function $sum
*/
function $sum(a, b) { return a + b; }

/** @sample add */
QUnit.test('adding numbers', function () {
    QUnit.strictEqual(add(2, 3), 5);
});

/** @sample add */
QUnit.test('QUnit assertions', function () {
    QUnit.deepEqual([1, 2], [1, 2]);
});

/** @sample add */
QUnit.test('$dollar sign', function () {
    QUnit.deepEqual([1, 2], [1, 2]);
});

/** @sample add */
QUnit.test('dollar sign at the end$', function () {
    QUnit.deepEqual([1, 2], [1, 2]);
});

/** @sample add */
QUnit.test('QUnit assertions test with multiple words', function () {
    QUnit.deepEqual([1, 2], [1, 2]);
    QUnit.equal('foo', 'foo');
    QUnit.ok(true, 'true is true');
});

/** @sample $sum */
QUnit.test('sample for $sum', function () {
    QUnit.equal($sum(2, 3), 5);
});