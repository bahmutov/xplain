var add = require('./add');
gt.test('add example', function () {
    // add function returns sum of numbers
    gt.equal(add(2, 3), 5);
    // it also concatenates strings
    gt.equal(add('foo', 'bar'), 'foobar')
});