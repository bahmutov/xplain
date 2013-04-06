var check = require('check-types');

function parseName(code) {
	check.verifyString(code, 'missing code');
	var reg = /(?:'|")(\s*[\w\s]+\s*)(?:'|")/;
	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	return matched[1];
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

// parses multiline list of assertions in the code
// replaces all gt.ok(...) and other assertions with 
// human-readable code
function parseUnitTestCode(code) {
	check.verifyString(code, 'missing code text');
	var txt = code;
	return txt;
}

module.exports = {
	parseName: parseName,
	parseCode: parseCode,
	parseUnitTestCode: parseUnitTestCode
};