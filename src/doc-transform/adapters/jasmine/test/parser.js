gt.module('jasmine top level test code parsing');

var p = require('../parser');
var parseCode = p.parseCode;
var parseName = p.parseName;
var testName = p.getNameFromTest;

gt.test('no name', function () {
	gt.null(parseName(''));
	gt.null(parseName('something without quotes'));
});

gt.test('invalid code', function () {
	gt.null(parseCode(''));
	var parsed = parseCode('gt.test("4", () {});');
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

gt.test('empty named unit test', function () {
	gt.arity(testName, 1);
	var txt = 'it("foo",function(){})';
	var name = testName(txt);
	// console.dir(name);
	gt.string(name, 'got back text name string');
	gt.equal(name, 'foo', 'got back correct unit test name');
});

gt.test('named unit test with some content', function () {
	var txt = 'it("foo",function(){ var foo;\n var bar; \n})';
	var name = testName(txt);
	// console.dir(name);
	gt.string(name, 'got back text name string');
	gt.equal(name, 'foo', 'got back correct unit test name');
});

/*
gt.test('two lines of code', function () {
	var txt = 'gt.test("foo",function() {\nvar foo;\n\t\tconsole.log(foo); } )';
	var p = parseCode(txt);
	gt.equal(p.name, 'foo');
	gt.equal(p.code, 'var foo;\n\t\tconsole.log(foo);');
});

gt.test('name and code', function () {
	var p = parseCode("gt.test('foo', function () {})");
	gt.equal(p.name, 'foo');
	gt.equal(p.code, '');

	p = parseCode('gt.test("foo", function(){})');
	gt.equal(p.name, 'foo');
	gt.equal(p.code, '');

	p = parseCode('gt.test("foo",function() {} )');
	gt.equal(p.name, 'foo');
	gt.equal(p.code, '');

	p = parseCode('gt.test("foo",function() {\nvar foo;\n} )');
	gt.equal(p.name, 'foo');
	gt.equal(p.code, 'var foo;');
});

gt.test('name and code using QUnit', function () {
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

gt.test('empty code', function () {
	var code = "gt.test('empty', function () {});";
	var parsed = parseCode(code);
	gt.object(parsed, 'got parsed result');
	gt.equal(parsed.name, 'empty');
	gt.equal(parsed.code, '');
});

gt.test('single assertion', function () {
	var txt = "gt.test('sample add usage', function () { \n\
		gt.equal(add(2, 3), 5);\n\
	});";
	var parsed = parseCode(txt);
	gt.equal(parsed.name, 'sample add usage');
	gt.equal(parsed.code, 'gt.equal(add(2, 3), 5);');
});

gt.test('name with comma', function () {
	var txt = 'gt.test("foo, bar",function() {});';
	var p = parseCode(txt);
	gt.equal(p.name, 'foo, bar', 'grabs test name, even if it has a comma');
	gt.equal(p.code, '', 'there is no source code');
});
*/