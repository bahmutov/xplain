var check = require('check-types');
var code = require('./code');

function parseEqualArguments(equal) {
	check.verifyString(equal, 'equal is not a string');

	console.log('splitting', equal);
	var split = code.split(equal);
	check.verifyArray(split, 'did not get array from', equal);
	console.log(split);
	var result = {
		op: split[0],
		expected: split[1]
	};
	return result;
}

function parseNumberArguments(args) {
	check.verifyString(args, 'args is not a string');

	console.log('splitting', args);
	var split = code.split(args);
	check.verifyArray(split, 'did not get array from', args);
	var result = {
		op: split[0]
	};
	return result;
}

function parseOkArguments(args) {
	check.verifyString(args, 'args is not a string');

	console.log('splitting', args);
	var split = code.split(args);
	check.verifyArray(split, 'did not get array from', args);
	var result = {
		op: split[0]
	};
	return result;
}

function parseEqual(line) {
	var isEqualReg = /(?:gt|QUnit)\.equal\(([\W\w]+)\);/;
	if (!isEqualReg.test(line)) {
		return null;
	}
	var matches = isEqualReg.exec(line);
	console.log('matches', matches);
	var equalArguments = matches[1];
	check.verifyString(equalArguments, 'invalid equal arguments');
	var parsed = parseEqualArguments(equalArguments);
	check.verifyObject(parsed, 'did not get parsed arguments');
	return parsed.op + '; // ' + parsed.expected;
}

function parseNumber(line) {
	var reg = /(?:gt|QUnit)\.number\(([\W\w]+)\);/;
	if (!reg.test(line)) {
		return null;
	}
	var matches = reg.exec(line);
	console.log('number matches', matches);
	var args = matches[1];
	check.verifyString(args, 'invalid number arguments');
	var parsed = parseNumberArguments(args);
	check.verifyObject(parsed, 'did not get parsed arguments');
	return parsed.op + '; // returns a number';
}

function parseOk(line) {
	var reg = /(?:gt|QUnit)\.ok\(([\W\w]+)\);/;
	if (!reg.test(line)) {
		return null;
	}
	var matches = reg.exec(line);
	console.log('ok matches', matches);
	var args = matches[1];
	check.verifyString(args, 'invalid number arguments');
	var parsed = parseOkArguments(args);
	check.verifyObject(parsed, 'did not get parsed arguments');
	return parsed.op + '; // returns truthy value';
}

function parseAssertion(line) {
	check.verifyString(line, 'missing line');

	var parsed = parseEqual(line);
	if (check.isString(parsed)) {
		return parsed;
	}
	parsed = parseNumber(line);
	if (check.isString(parsed)) {
		return parsed;
	}
	parsed = parseOk(line);
	if (check.isString(parsed)) {
		return parsed;
	}
	/*
	parsed = parseRaisesAssertion(line) {
	}
	*/

	var equalReg = /(?:gt|QUnit)\.equal\(([\W\w]+),\s*([\W\w]+)\s*\)/;
	var matched = equalReg.exec(line);
	console.log(matched);
	if (!Array.isArray(matched)) {
		var cleaned = code.reformat(line);
		return cleaned;
	}

	var op = matched[1];
	var output = matched[2];
	if (!check.isString(op) ||
		!check.isString(output)) {
		return line;
	}

	return op + '; // ' + output;
}

// parses multiline list of assertions in the code
// replaces all gt.ok(...) and other assertions with 
// human-readable code
function parseUnitTestCode(text) {
	check.verifyString(text, 'missing text');
	var lines = text.split('\n');
	var transformedLines = lines.map(parseAssertion);
	var output = transformedLines.join('\n');
	return output;
}

module.exports = {
	parseUnitTestCode: parseUnitTestCode
};