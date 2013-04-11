var add = require('../src/add').add;

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
@exampleFor add
*/
gt.test('testing add', function () {
	gt.equal(add('a', 0), 'a0', 'result is string if first arg is string');
	gt.equal(add(6, '3'), '63', 'result is number of second arg is a number');
});

/**
@sampleFor add
*/
gt.test('sample add usage', function () {
	// typical use
	gt.number(add(2, 3), 'returns a number');
	gt.equal(add(2, 3), 5);
	gt.ok(add(0, 1), 'returns 1 as true');
});

/**
@sampleFor add
*/
gt.test('edge cases', function () {
	gt.func(add, 'add is a function');
	gt.arity(add, 2, 'add expects two arguments');
	gt.equal(add('a', 'b'), 'ab', 'concatenates strings');
});