/**
    Adds two numbers

    @method add
*/
function add(a, b) { return a + b; }

/** @sample add */
QUnit.test('adding numbers', function () {
    QUnit.strictEqual(add(2, 3), 5);
});

/** @sample add */
QUnit.test('QUnit assertions', function () {
    QUnit.deepEqual([1, 2], [1, 2]);
});

/** @sample add */
QUnit.test('QUnit assertions test with multiple words', function () {
    QUnit.deepEqual([1, 2], [1, 2]);
    QUnit.equal('foo', 'foo');
    QUnit.ok(true, 'true is true');
});