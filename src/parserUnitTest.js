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

function parseAssertion(line) {
	check.verifyString(line, 'missing line');

	var equalParsed = parseEqual(line);
	if (check.isString(equalParsed)) {
		return equalParsed;
	}

	var equalReg = /(?:gt|QUnit)\.equal\(([\W\w]+),\s*([\W\w]+)\s*\)/;
	var matched = equalReg.exec(line);
	console.log(matched);
	if (!Array.isArray(matched)) {
		return line;
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