/**
Sample math operations

@module xplain
@class Sample math
*/

/**
Returns the sum of two numbers

@method add
@param {Number} a First argument
@param {Number} b Second argument
@public
*/
function add(a, b) {
	console.assert(a !== undefined, 'missing first argument');
	console.assert(b !== undefined, 'missing second argument');
	return a + b;
}

module.exports = add;