var _ = require('lodash');
var parse = require('../parserUnitTest').parseUnitTestCode;

gt.module('misc parsing functions');

gt.test('calling functions', function () {
	function foo() { return 'foo'; };
	function bar() { return 'bar'; };
	function zoo() { return 'zoo'; };
	var functions = [foo, bar, zoo];
	var answer = null;
	functions.some(function (method) {
		return answer = method();
	});
	gt.equal(answer, 'foo', 'first functions success');
});

gt.test('non first function', function () {
	function foo() { return null; };
	function bar() { return undefined; };
	function zoo() { return 'zoo'; };
	var functions = [foo, bar, zoo];
	var answer = null;
	functions.some(function (method) {
		return answer = method();
	});
	gt.equal(answer, 'zoo', 'last functions success');
});
