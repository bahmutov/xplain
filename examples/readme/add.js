/** 
	Adds two numbers
	
	@method add
*/
function add(a, b) {
	return a + b;
}

/** @sample add */
gt.test('basic addition', function () {
	gt.equal(add(1, 2), 3, '1 + 2 = 3');
	gt.equal(add(100, -100), 0, '100 + -100 = 0');
});