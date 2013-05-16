var add = require('./add').add;
var abs = require('./add').abs;

gt.module('add');

/**
@exampleFor math/add
*/
gt.test('functionality', function () {
	gt.func(add, 'add is a function');
	gt.arity(add, 2, 'expects two arguments');
	gt.equal(add(1, 4), 5, '1 + 4 = 5');
	gt.equal(add(-1, 1), 0, '-1 + 1 = 0');
	gt.equal(add(1, 10), add(10, 1), 'order does not matter');
});

/**
@exampleFor math/add
*/
gt.test('add as concatenate', function () {
	gt.equal(add('a', 0), 'a0', 'result is string if first arg is string');
	gt.equal(add(6, '3'), '63', 'result is number of second arg is a number');
});

/**
@sampleFor math/add
*/
gt.test('sample add usage', function () {
	// typical use
	// var add = require('xplain').add;
	// have to use relative paths inside the module
	var add = require('../src/add').add;
	gt.equal(add(2, 3), 5);
});

/**
@sampleFor math/add
*/
gt.test('edge cases', function () {
	gt.func(add, 'add is a function');
	gt.arity(add, 2, 'add expects two arguments');
	gt.number(add(2, 3), 'returns a number');
	gt.ok(add(0, 1), 'returns 1 as true');
	gt.equal(add('a', 'b'), 'ab', 'concatenates strings');
});

/**
@sample math/abs
*/
gt.test('using abs', function () {
	gt.equal(abs(10), 10, 'absolute number remains itself');
	gt.equal(abs(-15), 15, 'negative number changes sign');
	gt.equal(abs(0), 0, 'zero remains zero');
});

/** @sample math/add */
gt.test(function addImplicit() {
    // unit test with implicit name from function name
    gt.ok(true);
});