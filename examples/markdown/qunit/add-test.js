var add = require('./add');
QUnit.test('add example', function () {
    // add function returns sum of numbers
    QUnit.equal(add(2, 3), 5);
    // it also concatenates strings
    QUnit.equal(add('foo', 'bar'), 'foobar')
});