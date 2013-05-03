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
	check.verifyString(code, 'missing code, have ' + code);
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

function getNameFromTest(code) {
	return parseCode(code).name;
}

module.exports = {
	parseName: parseName,
	parseCode: parseCode,
	getNameFromTest: getNameFromTest
};