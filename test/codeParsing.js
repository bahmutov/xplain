gt.module('test code parsing');

gt.test('single assertion', function () {
	var code = "gt.test('sample add usage', function () { \n\
		gt.equal(add(2, 3), 5);\n\
	});";
	gt.string(code, 'have code');
});