gt.module('test code parsing');

var check = require('check-types');

function parseName(code) {
	check.verifyString(code, 'missing code');
	var reg = /(?:'|")(\s*\w+\s*)(?:'|")/;
	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	return matched[1];
}

function parseName2(code) {
	check.verifyString(code, 'missing code');
	var reg = /\(([\W\w]+),\s*function\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.isString(matched[1])) {
		return null;
	}
	return parseName(matched[1]);
}

function parseCode(code) {
	check.verifyString(code, 'missing code');
	var reg = /(?:gt|QUnit)\.test\(([\W\w]+),\s*function\s*\(\)\s*\{([\W\w]*)}\s*\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.isString(matched[1])) {
		return null;
	}

	var parsed = {
		name: parseName(matched[1]),
		code: matched[2].trim()
	}
	return parsed;
}

function parseCode2(code) {
	check.verifyString(code, 'missing code');
	var result = {};
	var regex = /(?:gt|QUnit)\.test/;
	var match = regex.exec(code);
	result.name = match[0];
	return result;
}

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

gt.test('name surrounded by quotes', function () {
	gt.equal(parseName2("('foo', function)"), 'foo');
	gt.equal(parseName2('("foo", function)'), 'foo');
	gt.equal(parseName2('("foo",function)'), 'foo');
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

/*
gt.test('empty code', function () {
	var code = "gt.test('empty', function () {});";
	var parsed = parseCode(code);
	gt.object(parsed, 'got parsed result');
});
*/

/*
gt.test('single assertion', function () {
	var code = "gt.test('sample add usage', function () { \n\
		gt.equal(add(2, 3), 5);\n\
	});";
	gt.string(code, 'have code');
});
*/