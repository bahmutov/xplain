/**
Sample math operations

@module math
*/
module.exports.add = add;
module.exports.abs = abs;

/**
Returns the sum of two numbers

@method add
@param {Number} a First argument
@param {Number} b Second argument
@returns a + b
@public
*/
function add(a, b) {
	console.assert(a !== undefined, 'missing first argument');
	console.assert(b !== undefined, 'missing second argument');
	return a + b;
}

/**
Returns the absolute value

@method abs
@param {Number} a Number
@public
*/
function abs(a) {
    return a >= 0 ? a : -a;
}