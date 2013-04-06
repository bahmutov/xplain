var check = require('check-types');

function parseAssertion(line) {
	check.verifyString(line, 'missing line');

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