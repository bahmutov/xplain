gt.module('parse unit test code');

var _ = require('lodash');
var parse = require('../parserUnitTest').parseUnitTestCode;

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

gt.test('empty code', function () {
	gt.equal(parse(''), '', 'empty input -> empty output');
});

gt.test('single gt.equal', function () {
	var code = 'gt.equal(add(2, 3), 5);';
	var parsed = parse(code);
	console.log(parsed);
	gt.equal(parsed, 'add(2, 3); // 5');
});

gt.test('single gt.equal with message', function () {
	var code = 'gt.equal(add(2, 3), 5, "2 + 3 = 5");';
	var parsed = parse(code);
	console.log(parsed);
	gt.equal(parsed, 'add(2, 3); // 5');
});

gt.test('comments are preserved', function () {
	var text = '// a comment';
	var parsed = parse(text);
	console.log('parsed:', parsed);
	gt.equal(parsed, text);
});
