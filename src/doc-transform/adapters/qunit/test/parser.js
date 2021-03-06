gt.module('test QUnit code parsing');

var parser = require('../parser');
var parseCode = parser.parseCode;
var parseName = parser.parseName;
var isSkippedTest = parser.isSkippedTest;

gt.test('no name', function () {
	gt.null(parseName(''));
	gt.null(parseName('something without quotes'));
});

gt.test('invalid code', function () {
	gt.null(parseCode(''));
	var parsed = parseCode('QUnit.test("4", () {});');
	gt.null(parsed, 'null is returned for invalid input');
});

gt.test('multiple words', function () {
	gt.equal(parseName('"foo bar"'), 'foo bar');
});

gt.test('camel case', function () {
	gt.equal(parseName('"fooBar"'), 'fooBar');
});

gt.test('single quote words', function () {
	gt.equal(parseName("'foo'"), 'foo');
	gt.equal(parseName("' foo'"), ' foo');
	gt.equal(parseName("' foo\t'"), ' foo\t');
});

gt.test('double quote words', function () {
	gt.equal(parseName('"foo"'), 'foo');
	gt.equal(parseName('" foo"'), ' foo');
	gt.equal(parseName('" foo\t "'), ' foo\t ');
});

gt.test('two lines of code', function () {
	var txt = 'QUnit.test("foo",function() {\nvar foo;\n\t\tconsole.log(foo); } )';
	var p = parseCode(txt);
	gt.equal(p.name, 'foo');
	gt.equal(p.code, 'var foo;\n\t\tconsole.log(foo);');
	gt.ok(!isSkippedTest(txt), 'unit test is not skipped');
});

gt.test('name and code', function () {
	var p = parseCode("QUnit.test('foo', function () {})");
	gt.equal(p.name, 'foo');
	gt.equal(p.code, '');

	p = parseCode('QUnit.test("foo", function(){})');
	gt.equal(p.name, 'foo');
	gt.equal(p.code, '');

	p = parseCode('QUnit.test("foo",function() {} )');
	gt.equal(p.name, 'foo');
	gt.equal(p.code, '');

	p = parseCode('QUnit.test("foo",function() {\nvar foo;\n} )');
	gt.equal(p.name, 'foo');
	gt.equal(p.code, 'var foo;');
});

gt.test('name and code using QUnit are parsed', function () {
	var p = parseCode("QUnit.test('foo', function () {})");
	gt.equal(p.code, '', 'does not parse QUnit, got', p);
});

gt.test('empty code', function () {
	var code = "QUnit.test('empty', function () {});";
	var parsed = parseCode(code);
	gt.object(parsed, 'got parsed result');
	gt.equal(parsed.name, 'empty');
	gt.equal(parsed.code, '');
});

gt.test('single assertion', function () {
	var txt = "QUnit.test('sample add usage', function () { \n\
		QUnit.equal(add(2, 3), 5);\n\
	});";
	var parsed = parseCode(txt);
	gt.equal(parsed.name, 'sample add usage');
	gt.equal(parsed.code, 'QUnit.equal(add(2, 3), 5);');
});

gt.test('name with comma', function () {
	var txt = 'QUnit.test("foo, bar",function() {});';
	var p = parseCode(txt);
	gt.equal(p.name, 'foo, bar', 'grabs test name, even if it has a comma');
	gt.equal(p.code, '', 'there is no source code');
});

