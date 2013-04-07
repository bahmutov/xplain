var add = require('../src/add');

gt.module('add');

/**
@exampleFor add
*/
gt.test('testing add', function () {
	gt.func(add, 'add is a function');
	gt.arity(add, 2, 'expects two arguments');
	gt.equal(add(1, 4), 5, '1 + 4 = 5');
	gt.equal(add(-1, 1), 0, '-1 + 1 = 0');
	gt.equal(add(1, 10), add(10, 1), 'order does not matter');
});

/**
@sampleFor add
*/
gt.test('sample add usage', function () {
	gt.equal(add(2, 3), 5);
	gt.equal(add('a', 'b'), 'ab', 'concatenates strings');
});