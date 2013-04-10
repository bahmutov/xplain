gt.module('parse unit test code');

var parse = require('../src/parserUnitTest').parseUnitTestCode;

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